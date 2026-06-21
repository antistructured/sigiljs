# Public API

This page documents the stable public API for `@weipertda/sigiljs`.

```js
import {
  Sigil,
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

**Stable (0.4.0):** `Sigil`, `sigil`, `sigil.exact`, `optional`, `union`, `oneOf`, `pipe`, `trim`, `realType`, contract methods (`check`, `assert`, `parse`, `safeParse`, `serialize`, `transform`, `withMetadata`, `version`, `describe`, `toJSONSchema`, `toTypeScript`, `toOpenAPI`, `diff`, `compile`, `mock`, `cases`), `SigilValidationError`, and constructor helpers (`Sigil.exact`, `Sigil.meta`, `Sigil.named` / `Sigil.define`, `Sigil.collection`).

**Experimental (0.4.0):** `httpContract`, `toFormConstraints()`.

Experimental APIs carry a warning in their documentation and may change before 1.0.0.

> **Preferred API:** `sigil()` is the primary object-definition API. `Sigil`\`...\` is supported as an alternative template syntax. `S` and `T` are legacy aliases for `Sigil` and should not be used in new code.

## Public exports

| Export | Status | Purpose |
|---------|--------|---------|
| `Sigil` | stable | Tagged-template contract factory. |
| `S` | stable (legacy) | Legacy convenience alias for `Sigil`. |
| `T` | stable (legacy) | Legacy convenience alias for `Sigil`. |
| `sigil` | stable | Plain JavaScript object-definition contract factory. |
| `optional` | stable | Helper to mark object-definition fields optional. |
| `union` | stable | Helper to create object-definition union contracts. |
| `oneOf` | stable | Helper to create literal union/enum-style contracts. |
| `pipe` | stable | Field-level transform composition helper. |
| `trim` | stable | String trimming transform helper for `pipe`. |
| `httpContract` | experimental | Framework-neutral request/response boundary helper. |
| `realType` | stable | Runtime type detector for values. |
| `SigilValidationError` | stable | Structured error type for contract validation failures. |

## Define pillar

### `Sigil`

**Status:** stable

Tagged-template contract factory.

```js
const User = Sigil`
  id: string
  name: string
`;
```

### `Sigil.exact`

**Status:** stable

Exact-mode tagged-template factory that rejects extra object keys.

```js
const ExactUser = Sigil.exact`
  id: string
  name: string
`;
```

### `Sigil.meta(metadata)`

**Status:** stable

Tagged-template helper that attaches optional metadata.

```js
const User = Sigil.meta({ name: 'User', version: '1.0.0' })`
  id: string
  name: string
`;
```

### `Sigil.define(name)` / `Sigil.named(name)`

**Status:** stable

Create globally registered named sigils.

```js
const Email = Sigil.define('Email')`string`;
const User = Sigil`
  email: Email
`;
```

### `Sigil.collection(definitions)`

**Status:** stable

Create grouped reusable sigils with local resolution.

```js
const Auth = Sigil.collection({
  Email: Sigil`string`,
  Session: Sigil`
    email: Email
    token: string
  `,
});
```

### `sigil(definition, metadata?)`

**Status:** stable

Object-definition contract factory.

```js
const User = sigil({
  id: String,
  name: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});
```

### `sigil.exact(definition, metadata?)`

**Status:** stable

Exact-mode object-definition contract factory.

```js
const ExactUser = sigil.exact({
  id: String,
  name: String,
});
```

### `optional(definition)`

**Status:** stable

Mark an object-definition field optional.

```js
const User = sigil({
  name: String,
  age: optional(Number),
});
```

### `union(...definitions)`

**Status:** stable

Create a primitive union in object-definition syntax.

```js
const Id = sigil({
  id: union(String, Number),
});
```

### `oneOf(...values)`

**Status:** stable

Create a literal union in object-definition syntax.

```js
const Role = sigil({
  role: oneOf('admin', 'user'),
});
```

### `pipe(definition, ...transforms)`

**Status:** stable

Compose field transforms in object-definitions.

```js
const User = sigil({
  name: pipe(String, trim()),
});
```

### `trim()`

**Status:** stable

String trimming transform helper.

```js
const cleanName = trim();
```

## Contract methods

Every contract object returned by `Sigil`, `sigil()`, or `sigil.exact()` shares this stable shape.

| Method | Status | Purpose |
|------|--------|---------|
| `check(value)` | stable | Returns `true` or `false`. |
| `assert(value)` | stable | Returns trusted value or throws. |
| `parse(value)` | stable | Returns trusted value or throws. |
| `safeParse(value)` | stable | Returns `{ success, data }` or `{ success, error }`. |
| `serialize(value)` | stable | Validates trusted data for boundary output. |
| `transform(fn)` | stable | Returns a derived contract with a transform. |
| `withMetadata(metadata)` | stable | Returns a derived contract with metadata. |
| `version(version)` | stable | Shorthand for version metadata only. |
| `describe()` | stable | Returns stable contract description object. |
| `toJSONSchema()` | stable | Projects contract to JSON Schema. |
| `toTypeScript(name)` | stable | Projects contract to a TypeScript type declaration. |
| `toOpenAPI()` | stable | Projects contract to an OpenAPI-compatible schema. |
| `toFormConstraints()` | experimental | Projects basic form constraints for object contracts. |
| `mock()` | stable | Returns a deterministic valid sample value. |
| `cases()` | stable | Returns deterministic `{ valid, invalid }` test cases. |
| `diff(other)` | stable | Returns deterministic lifecycle diff entries. |
| `compile()` | stable | Returns the compiled boolean validator. |

### Contract lifecycle metadata

Contracts can carry optional metadata for descriptions and projections.

```js
const User = sigil(
  { name: String },
  { name: 'User', version: '1.0.0', tags: ['public'] },
);

User.version('2.0.0');
```

Supported metadata fields:

- `name`
- `version`
- `description`
- `tags`

Metadata does not change runtime validation behavior.

## Method reference

### `contract.check(value)`

**Status:** stable

**Purpose:** fast boolean validation path.

**Signature:** `check(value, options?) => boolean`

**Example:**

```js
const valid = User.check({ name: 'D', role: 'admin' });
```

**Returns:** `true` when valid, `false` when invalid.

**Throws:** never.

### `contract.assert(value)`

**Status:** stable

**Purpose:** validate and return trusted runtime data.

**Signature:** `assert(value, options?) => value`

**Example:**

```js
const trusted = User.assert(unknownInput);
```

**Returns:** the validated input value.

**Throws:** `SigilValidationError` when invalid.

### `contract.parse(value)`

**Status:** stable

**Purpose:** enforce contract semantics and return trusted runtime data.

**Signature:** `parse(value, options?) => value`

**Example:**

```js
const trusted = User.parse(unknownInput);
```

**Returns:** the validated input value.

**Throws:** `SigilValidationError` when invalid.

### `contract.safeParse(value)`

**Status:** stable

**Purpose:** validate without throwing.

**Signature:** `safeParse(value, options?) => { success, data? | error? }`

**Example:**

```js
const result = User.safeParse(unknownInput);
```

**Returns:**

```js
{ success: true, data: {...} }
// or
{ success: false, error: SigilValidationError }
```

**Throws:** never.

### `contract.serialize(value)`

**Status:** stable

**Purpose:** validate data for boundary-safe output.

**Signature:** `serialize(value, options?) => value`

**Example:**

```js
const output = User.serialize(trustedValue);
```

**Returns:** the validated value.

**Throws:** `SigilValidationError` when invalid.

### `contract.transform(fn)`

**Status:** stable

**Purpose:** create a derived contract that transforms then revalidates.

**Signature:** `transform(fn) => contract`

**Example:**

```js
const TrimmedUser = User.transform((user) => ({
  ...user,
  name: user.name.trim(),
}));
```

**Returns:** a new derived contract.

**Throws:** throws if the transformed value fails revalidation during `parse()`.

### `contract.withMetadata(metadata)`

**Status:** stable

**Purpose:** create a derived contract with metadata.

**Signature:** `withMetadata(metadata) => contract`

**Example:**

```js
const VersionedUser = User.withMetadata({ version: '2.0.0' });
```

**Returns:** a new derived contract.

**Throws:** never.

### `contract.version(version)`

**Status:** stable

**Purpose:** shorthand metadata-only versioning.

**Signature:** `version(version) => contract`

**Example:**

```js
const VersionedUser = User.version('2.0.0');
```

**Returns:** a new derived contract.

**Throws:** never.

### `contract.describe()`

**Status:** stable

**Purpose:** return the stable public contract description.

**Signature:** `describe() => object`

**Example:**

```js
User.describe();
```

**Returns:**

```js
{
  kind: 'object',
  exact: false,
  properties: [ ... ],
}
```

**Throws:** never.

### `contract.toJSONSchema()`

**Status:** stable

**Purpose:** project the contract description to JSON Schema.

**Signature:** `toJSONSchema() => object`

**Example:**

```js
User.toJSONSchema();
```

**Returns:** a JSON Schema-like object.

**Throws:** never.

### `contract.toTypeScript(name)`

**Status:** stable

**Purpose:** project the contract description to a TypeScript type declaration.

**Signature:** `toTypeScript(name) => string`

**Example:**

```js
User.toTypeScript('User');
```

**Returns:**

```ts
type User = {
  id: string;
  name: string;
};
```

**Throws:** never.

### `contract.toOpenAPI()`

**Status:** stable

**Purpose:** project the contract to an OpenAPI-compatible schema.

**Signature:** `toOpenAPI() => object`

**Example:**

```js
User.toOpenAPI();
```

**Returns:** an OpenAPI-compatible schema object.

**Throws:** never.

### `contract.toFormConstraints()`

**Status:** experimental

Experimental. May change before 1.0.0.

**Purpose:** project basic object contracts to form metadata.

**Signature:** `toFormConstraints() => object`

**Example:**

```js
User.toFormConstraints();
```

**Returns:** form constraint metadata for object contracts.

**Throws:** never.

### `contract.mock()`

**Status:** stable

**Purpose:** generate a deterministic valid sample value.

**Signature:** `mock() => any`

**Example:**

```js
User.mock();
```

**Returns:** a valid sample value for the contract.

**Throws:** never.

### `contract.cases()`

**Status:** stable

**Purpose:** return deterministic valid/invalid contract test cases.

**Signature:** `cases() => { valid: [any], invalid: [[value, path, expected, actual], ...] }`

**Example:**

```js
User.cases();
```

**Returns:**

```ts
{
  valid: any[];
  invalid: Array<[value, path, expected, actual]>;
}
```

**Throws:** never.

### `contract.diff(other)`

**Status:** stable

**Purpose:** compare contracts for lifecycle drift.

**Signature:** `diff(other) => change[]`

**Example:**

```js
const changes = NextUser.diff(PreviousUser);
```

**Returns:**

```js
[
  { kind: 'property_added', path: 'displayName', impact: 'non-breaking', ... },
  { kind: 'property_removed', path: 'username', impact: 'breaking', ... },
]
```

**Throws:** never.

### `contract.compile()`

**Status:** stable

**Purpose:** expose the compiled validator.

**Signature:** `compile() => function`

**Example:**

```js
const validate = User.compile();
const ok = validate(data);
```

**Returns:** a compiled validator function.

**Throws:** never.

## Utilities

### `realType(value)`

**Status:** stable

**Purpose:** inspect a runtime value as a simple type label.

**Signature:** `realType(value, options?) => string`

**Example:**

```js
realType('hello'); // 'string'
realType([]); // 'array'
```

**Returns:** a type label as a string.

**Throws:** never.

### `httpContract({ request, response })`

**Status:** experimental

Experimental. May change before 1.0.0.

**Purpose:** framework-neutral request/response boundary helper.

**Signature:** `httpContract({ request, response }) => object`

**Example:**

```js
const { parseRequest, serializeResponse } = httpContract({
  request: ApiRequest,
  response: ApiResponse,
});
```

**Returns:** helpers for parsing and serializing HTTP contracts.

**Throws:** never.

## Error shape

### `SigilValidationError`

**Status:** stable

Thrown by `assert()` and `parse()` on invalid input.

```js
try {
  User.assert(badValue);
} catch (error) {
  if (error instanceof SigilValidationError) {
    console.log(error.code);
    console.log(error.path);
    console.log(error.message);
    console.log(error.toJSON());
  }
}
```

Common properties:

- `code`
- `path`
- `expected`
- `actual`
- `message`

This page documents the current stable surface only.
