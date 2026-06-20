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

## Public exports

| Export | Purpose |
||---------|
| `Sigil` | Tagged-template contract factory. |
| `sigil` | Plain JavaScript object-definition contract factory. |
| `optional` | Helper to mark object-definition fields optional. |
| `union` | Helper to create object-definition union contracts. |
| `oneOf` | Helper to create literal union/enum-style contracts. |
| `pipe` | Field-level transform composition helper. |
| `trim` | String trimming transform helper for `pipe`. |
| `httpContract` | Framework-neutral request/response boundary helper. |
| `realType` | Runtime type detector for values. |
| `SigilValidationError` | Structured error type for contract validation failures. |

## Define pillar

### `Sigil`

Tagged-template contract factory.

```js
const User = Sigil`
  id: string
  name: string
`;
```

### `Sigil.exact`

Exact-mode tagged-template factory that rejects extra object keys.

```js
const ExactUser = Sigil.exact`
  id: string
  name: string
`;
```

### `Sigil.meta(metadata)`

Tagged-template helper that attaches optional metadata.

```js
const User = Sigil.meta({ name: 'User', version: '1.0.0' })`
  id: string
  name: string
`;
```

### `Sigil.define(name)` / `Sigil.named(name)`

Create globally registered named sigils.

```js
const Email = Sigil.define('Email')`string`;
const User = Sigil`
  email: Email
`;
```

### `Sigil.collection(definitions)`

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

Exact-mode object-definition contract factory.

```js
const ExactUser = sigil.exact({
  id: String,
  name: String,
});
```

### `optional(definition)`

Mark an object-definition field optional.

```js
const User = sigil({
  name: String,
  age: optional(Number),
});
```

### `union(...definitions)`

Create a primitive union in object-definition syntax.

```js
const Id = sigil({
  id: union(String, Number),
});
```

### `oneOf(...values)`

Create a literal union in object-definition syntax.

```js
const Role = sigil({
  role: oneOf('admin', 'user'),
});
```

### `pipe(definition, ...transforms)`

Compose field transforms in object-definitions.

```js
const User = sigil({
  name: pipe(String, trim()),
});
```

### `trim()`

String trimming transform helper.

```js
const cleanName = trim();
```

## Contract methods

Every contract object returned by `Sigil`, `sigil()`, or `sigil.exact()` shares this stable shape.

| Method                   | Purpose                                                |
| ------------------------ | ------------------------------------------------------ |
| `check(value)`           | Returns `true` or `false`.                             |
| `assert(value)`          | Returns trusted value or throws.                       |
| `parse(value)`           | Returns trusted value or throws.                       |
| `safeParse(value)`       | Returns `{ success, data }` or `{ success, error }`.   |
| `serialize(value)`       | Validates trusted data for boundary output.            |
| `transform(fn)`          | Returns a derived contract with a transform.           |
| `withMetadata(metadata)` | Returns a derived contract with metadata.              |
| `version(version)`       | Shorthand for version metadata only.                   |
| `describe()`             | Returns stable contract description object.            |
| `toJSONSchema()`         | Projects contract to JSON Schema.                      |
| `toTypeScript(name)`     | Projects contract to a TypeScript type declaration.    |
| `toOpenAPI()`            | Projects contract to an OpenAPI-compatible schema.     |
| `toFormConstraints()`    | Projects basic form constraints for object contracts.  |
| `mock()`                 | Returns a deterministic valid sample value.            |
| `cases()`                | Returns deterministic `{ valid, invalid }` test cases. |
| `diff(other)`            | Returns deterministic lifecycle diff entries.          |
| `compile()`              | Returns the compiled boolean validator.                |

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

**Purpose:** fast boolean validation path.

**Signature:** `check(value, options?) => boolean`

**Example:**

```js
const valid = User.check({ name: 'D', role: 'admin' });
```

**Returns:** `true` when valid, `false` when invalid.

**Throws:** never.

### `contract.assert(value)`

**Purpose:** validate and return trusted runtime data.

**Signature:** `assert(value, options?) => value`

**Example:**

```js
const trusted = User.assert(unknownInput);
```

**Returns:** the validated input value.

**Throws:** `SigilValidationError` when invalid.

### `contract.parse(value)`

**Purpose:** enforce contract semantics and return trusted runtime data.

**Signature:** `parse(value, options?) => value`

**Example:**

```js
const trusted = User.parse(unknownInput);
```

**Returns:** the validated input value.

**Throws:** `SigilValidationError` when invalid.

### `contract.safeParse(value)`

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

**Purpose:** validate data for boundary-safe output.

**Signature:** `serialize(value, options?) => value`

**Example:**

```js
const output = User.serialize(trustedValue);
```

**Returns:** the validated value.

**Throws:** `SigilValidationError` when invalid.

### `contract.transform(fn)`

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

**Purpose:** create a derived contract with metadata.

**Signature:** `withMetadata(metadata) => contract`

**Example:**

```js
const VersionedUser = User.withMetadata({ version: '2.0.0' });
```

**Returns:** a new derived contract.

**Throws:** never.

### `contract.version(version)`

**Purpose:** shorthand metadata-only versioning.

**Signature:** `version(version) => contract`

**Example:**

```js
const VersionedUser = User.version('2.0.0');
```

**Returns:** a new derived contract.

**Throws:** never.

### `contract.describe()`

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

**Purpose:** project the contract description to JSON Schema.

**Signature:** `toJSONSchema() => object`

**Example:**

```js
User.toJSONSchema();
```

**Returns:** a JSON Schema-like object.

**Throws:** never.

### `contract.toTypeScript(name)`

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

**Purpose:** project the contract to an OpenAPI-compatible schema.

**Signature:** `toOpenAPI() => object`

**Example:**

```js
User.toOpenAPI();
```

**Returns:** an OpenAPI-compatible schema object.

**Throws:** never.

### `contract.toFormConstraints()`

**Purpose:** project basic object contracts to form metadata.

**Status:** experimental.

**Signature:** `toFormConstraints() => object`

**Example:**

```js
User.toFormConstraints();
```

**Returns:** form constraint metadata for object contracts.

**Throws:** never.

### `contract.mock()`

**Purpose:** generate a deterministic valid sample value.

**Signature:** `mock() => any`

**Example:**

```js
User.mock();
```

**Returns:** a valid sample value for the contract.

**Throws:** never.

### `contract.cases()`

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
