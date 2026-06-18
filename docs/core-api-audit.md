# Core API Audit

Phase 1 stabilization note for the current SigilJS public runtime surface.

SigilJS is being stabilized as an executable data contract system. This page records what exists before adding the next Define/Enforce features.

## Public exports

```js
import {
  Sigil,
  S,
  T,
  sigil,
  optional,
  union,
  oneOf,
  pipe,
  trim,
  httpContract,
  realType,
  SigilValidationError,
} from '@weipertda/sigiljs';
```

Current export meanings:

- `Sigil` — primary tagged-template contract factory.
- `S` — alias for `Sigil`.
- `T` — legacy alias for `Sigil`.
- `sigil` — plain JavaScript object-definition contract factory.
- `optional` — helper for optional object-definition fields.
- `union` — helper for object-definition union contracts.
- `oneOf` — helper for literal enum-like object-definition contracts.
- `pipe` — minimal field-level transform helper for object-definition fields.
- `trim` — string trimming transform helper for `pipe`.
- `httpContract` — framework-neutral request/response boundary helper.
- `realType` — runtime type detector used by diagnostics and available as a utility.
- `SigilValidationError` — structured error type thrown by `.assert()` and `.parse()`.

## Define pillar object API

Template syntax and object syntax are two front doors into the same contract engine.

```js
const User = sigil({
  id: Number,
  name: String,
  age: optional(Number),
  role: oneOf('admin', 'user'),
  contact: union(String, Number),
});
```

Native constructor mapping:

| Constructor | Contract type |
| ----------- | ------------- |
| `String`    | `string`      |
| `Number`    | `number`      |
| `Boolean`   | `boolean`     |
| `BigInt`    | `bigint`      |
| `Symbol`    | `symbol`      |
| `Array`     | `array`       |
| `Object`    | `object`      |

`sigil.exact({ ... })` creates the object-definition equivalent of `Sigil.exact`.

## Contract object methods and fields

Every Sigil contract should have a stable shape:

```js
{
  kind: 'sigil.contract',
  name,
  source,
  raw,
  ast,
  normalized,
  validator,
  options,
  check,
  assert,
  parse,
  safeParse,
  serialize,
  transform,
  describe,
  toJSONSchema,
  toTypeScript,
  toOpenAPI,
  toFormConstraints,
  mock,
  cases,
  diff,
  compile,
}
```

Notes:

- `source` is the canonical source string for the contract.
- `raw` remains as a backwards-compatible alias for `source`.
- `validator` is the compiled boolean validator function.
- `compile()` returns the same function as `validator`.
- `check(value)` returns a boolean and should remain the hot path.
- `assert(value)` returns the input value when valid and throws `SigilValidationError` when invalid.
- `parse(value)` is the Enforce-pillar name for `assert(value)` semantics.
- `safeParse(value)` returns `{ success: true, data }` or `{ success: false, error }` without throwing.
- `transform(fn)` returns a derived contract that validates input, applies transforms, then revalidates output during `parse()`.
- `serialize(value)` validates trusted data for boundary-safe output. The initial implementation validates and returns the value.
- `describe()` returns a stable public contract description and must not expose unstable parser internals.
- `toJSONSchema()` projects the stable contract description into a JSON Schema-like object.
- `toTypeScript(name)` projects the stable contract description into a TypeScript type declaration string.
- `toOpenAPI()` projects the JSON Schema output into an OpenAPI-compatible schema object.
- `toFormConstraints()` experimentally projects object contracts into basic form metadata.
- `mock()` generates a deterministic valid sample value for tests and examples.
- `cases()` returns basic deterministic `{ valid, invalid }` contract test cases.
- `diff(other)` compares object contracts for lifecycle drift: added, removed, changed, and requiredness changes.

## Transform behavior

Contract-level transform:

```js
const User = sigil({ id: Number, name: String }).transform((user) => ({
  ...user,
  name: user.name.trim(),
}));
```

Field-level transform:

```js
const User = sigil({
  name: pipe(String, trim()),
});
```

Transform safety rule:

```txt
validate input → transform → validate output
```

Loose contracts preserve unknown keys. Exact contracts reject unknown keys before transform.

## Canonical contract description

`describe()` is the public structural bridge for projection APIs. Projection features such as `toTypeScript`, `toOpenAPI`, `toFormConstraints`, and future package adapters should consume this stable model rather than parser internals. JSON Schema projection is already available with `toJSONSchema()`, OpenAPI projection builds on that with `toOpenAPI()`, and forms projection is available experimentally with `toFormConstraints()`.

Example:

```js
sigil({ id: Number }).describe();
```

returns:

```js
{
  kind: 'object',
  exact: false,
  properties: [
    {
      key: 'id',
      required: true,
      contract: { kind: 'number' },
    },
  ],
}
```

## Exact mode behavior

```js
const User = Sigil.exact`{ name: string }`;
```

Exact contracts reject extra object keys. Normal contracts allow extra keys.

Exactness currently propagates through nested object expressions in the same contract.

## Named sigil behavior

```js
Sigil.define('Email')`string`;
const User = Sigil`{ email: Email }`;
```

- `Sigil.define(name)` and `Sigil.named(name)` are aliases.
- Named sigils are registered globally.
- References can appear inside objects, arrays, and unions.
- Missing references fail at enforcement time with `Unknown sigil reference: <Name>`.
- Circular references are resolved lazily and finite structures are supported.
- Duplicate global registrations use last-write-wins behavior.

## Collection behavior

```js
const Auth = Sigil.collection({
  Email: Sigil`string`,
  Login: Sigil`{ email: Email }`,
});
```

Collections create grouped reusable sigils with collection-local resolution. Collection names do not pollute the global registry.
