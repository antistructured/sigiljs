# Prove Output Contracts

**Block:** Stable Core Hardening  
**Package:** `@weipertda/sigiljs` v0.14.0  
**Pass:** 8 — Prove Output Contract Hardening

---

## Scope

Stable-core Prove APIs:

- `mock(options?)`
- `cases(options?)`
- `test(cases?)`

These APIs generate deterministic structural samples and report objects from an executable contract.

---

## `mock()` Output Semantics

`mock()` returns one deterministic structurally valid sample for the contract.

Stable expectations:

- output passes `contract.check(output)` when the contract can generate a supported value
- primitive defaults are deterministic:
  - string → `'string'`
  - number → `0`
  - boolean → `true`
  - null → `null`
  - bigint → `0n`
- literal unions choose the first variant
- object property order follows contract definition order
- optional properties are omitted by default
- `mock({ includeOptional: true })` includes optional properties
- arrays use `arrayLength` when supplied, defaulting to one generated item

---

## Required Semantic Limitation

`mock()` values are structurally valid but not semantically meaningful.

Examples:

- generated email-like fields are still `'string'`
- generated IDs are usually `0` or `'string'`
- generated roles use the first literal option

This is intentional. `mock()` is a smoke-test/sample generator, not a domain-specific fixture engine or faker library.

---

## `cases()` Output Shape

`cases()` returns:

```js
{
  valid: Array<{ label: string, value: unknown }>,
  invalid: Array<{
    label: string,
    value: unknown,
    expectedPath?: Array<string | number>
  }>
}
```

Stable expectations:

- top-level shape is `{ valid, invalid }`
- `valid` is an array
- `invalid` is an array
- valid entries have `label` and `value`
- invalid entries have `label` and `value`
- invalid entries include `expectedPath` when practical
- generated output is deterministic

---

## Valid Case Shape

Current default valid case:

```js
{
  label: 'valid default',
  value: contract.mock(options)
}
```

Generated valid cases should pass `contract.check(value)`.

---

## Invalid Case Shape

Invalid cases are deterministic mutations of generated valid data.

Current invalid case categories include:

- missing required property
- wrong primitive type
- invalid literal
- invalid union value
- invalid array value/item
- invalid object value
- extra key in exact object
- nested invalid value

Generated invalid cases should fail `contract.check(value)`.

---

## `test()` Report Shape

`test(cases?)` runs generated or provided cases and returns:

```js
{
  success: boolean,
  valid: { passed: number, failed: number },
  invalid: { passed: number, failed: number },
  failures: Array<{
    kind: 'valid' | 'invalid',
    label: string,
    value: unknown
  }>
}
```

Stable expectations:

- no throwing for ordinary generated or custom case mismatches
- valid cases pass when `contract.check(value)` is true
- invalid cases pass when `contract.check(value)` is false
- failures preserve `kind`, `label`, and `value`
- report is a plain JSON-like object for runner-agnostic use

---

## Determinism Guarantees

Stable deterministic output:

- `mock()` returns equal output across calls for the same contract/options
- `cases()` returns equal output across calls for the same contract/options
- `test()` counts are deterministic for the same contract/cases

No random/faker behavior is part of the stable core.

---

## Relationship to Contract-Driven Testing

The Prove APIs are intended for structural contract smoke tests:

- generate a representative valid sample
- generate representative invalid samples
- assert that the executable contract still accepts/rejects expected shapes

They do not replace hand-authored domain examples, fuzzing, or property-based testing.

---

## Tests

Focused tests live in:

```txt
tests/stable-core-prove-contracts.test.js
```

They cover:

- deterministic `mock()` output
- `mock()` output passing the contract
- optional-field behavior
- stable `{ valid, invalid }` case shape
- case labels and values
- valid cases passing and invalid cases failing
- `expectedPath` when practical
- `test()` success report shape
- `test()` failure entry shape

Current focused test status:

```txt
7 pass, 0 fail
```

---

## 1.0 Recommendation

Freeze `mock()`, `cases()`, and `test()` as stable-core structural proof helpers after one additional regression-matrix pass.

Keep the semantic limitation prominent: generated values are structurally valid, not domain-realistic.

