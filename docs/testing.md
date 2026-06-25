# Contract-Driven Testing

SigilJS supports contract-driven testing by generating valid samples, invalid samples, and simple contract behavior reports from an executable contract.

## What is contract-driven testing?

Contract-driven testing uses the contract itself as the source of test data. Instead of hand-writing fixtures, you derive them from the same contract that enforces boundary behavior at runtime.

In SigilJS, the contract is already an executable object. That means:

- It can validate trusted runtime data.
- It can describe its own shape.
- It can generate representative valid and invalid samples.

This keeps test fixtures in sync with the contract automatically.

---

## `mock()`

`mock()` returns one valid sample for the contract.

```js
const User = sigil.exact({
  id: Number,
  name: String,
  role: oneOf('admin', 'user'),
});

User.mock();
// { id: 0, name: 'string', role: 'admin' }
```

`mock()` is deterministic and omits optional fields by default so the sample stays minimal.

---

## `cases()`

`cases()` returns labeled valid and invalid samples.

```js
const cases = User.cases();

// {
//   valid: [{ label: 'valid default', value: { id: 0, name: 'string', role: 'admin' } }],
//   invalid: [{ label: 'missing required property: id', value: { name: 'string', role: 'admin' }, expectedPath: ['id'] }]
// }
```

- Valid samples are generated from the contract.
- Invalid samples are deterministic mutations that violate one rule of the contract.
- Each invalid entry includes a label and, when practical, an `expectedPath`.

---

## `test()`

`test()` runs generated or custom cases against the contract and returns a plain report.

```js
const report = User.test();

// {
//   success: true,
//   valid: { passed: 1, failed: 0 },
//   invalid: { passed: 4, failed: 0 },
//   failures: []
// }
```

Pass custom cases when you want boundary-specific coverage:

```js
User.test({
  valid: [{ label: 'minimum id', value: { id: 0, name: 'Ada' } }],
  invalid: [{ label: 'null name', value: { id: 0, name: null } }],
});
```

---

## Valid samples

Use `mock()` or `cases().valid` when you need representative data that should pass the contract.

```js
const sample = User.mock();

for (const item of User.cases().valid) {
  expect(User.check(item.value)).toBe(true);
}
```

Valid samples are useful for:

- seeding test databases
- example payloads in docs
- default fixture data

Because they come from the executable contract, they stay aligned with the enforced boundary behavior.

---

## Invalid samples

Use `cases().invalid` when you want to verify the contract rejects bad data.

```js
for (const item of User.cases().invalid) {
  expect(User.check(item.value)).toBe(false);
}
```

Invalid samples cover common failures such as:

- missing required properties
- wrong primitive types
- invalid literals
- invalid union values
- invalid array items
- extra keys in exact objects
- nested property failures

They are deterministic and small, not exhaustive. They exist to prove the contract's boundary behavior, not to replace fuzzing.

---

## Using generated cases with Bun test

`cases()` and `test()` are runner-agnostic. They work with Bun test directly because they return plain objects and never throw.

```js
import { expect, test } from 'bun:test';
import { sigil, oneOf } from '@weipertda/sigiljs';

const User = sigil.exact({
  id: Number,
  role: oneOf('admin', 'user'),
});

test('generated user samples match contract', () => {
  const cases = User.cases();

  for (const item of cases.valid) {
    expect(User.check(item.value)).toBe(true);
  }

  for (const item of cases.invalid) {
    expect(User.check(item.value)).toBe(false);
  }
});
```

`test()` gives a plain report you can assert on if you prefer one block:

```js
const report = User.test();
expect(report.success).toBe(true);
expect(report.failures).toEqual([]);
```

---

## Limits of generated cases

Generated cases are deterministic and minimal.

They do not cover:

- random or seeded fuzzing
- boundary edge cases such as empty strings, very large numbers, or deeply nested objects
- every possible invalid permutation
- shrinking or traceable reproduction of failing cases

Think of generated cases as a behavioral smoke test for the contract. They prove that the contract still accepts what it should accept and rejects what it should reject after changes.

---

## Future fuzzing

SigilJS plans to add fuzzing as a future capability, likely behind a `fuzz()` helper or a future boundary-scoped package.

Possible future scope includes seeded random generation, boundary values, nested depth controls, optional-field inclusion modes, invalid-case categories, and shrinking failing cases.

For now, the supported testing surface is `mock()`, `cases()`, and `test()`.
