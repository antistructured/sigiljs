# Public API

This page documents the stable public API for `@weipertda/sigiljs`.

SigilJS is written in JavaScript and ships TypeScript declarations for public API consumption via `index.d.ts`. The declarations are conservative: they describe the public runtime API and allow explicit generics such as `sigil<User>(...)`, but they do not yet infer precise object shapes from every contract definition.

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
  real,
  Real,
  SigilValidationError,
} from '@weipertda/sigiljs';
```

**Stable candidates (0.18.0):** `Sigil`, `sigil`, `sigil.exact`, `optional`, `union`, `oneOf`, `pipe`, `trim`, `realType`, contract methods (`check`, `assert`, `parse`, `safeParse`, `serialize`, `transform`, `withMetadata`, `version`, `describe`, `toJSONSchema`, `toTypeScript`, `toOpenAPI`, `diff`, `compile`, `mock`, `cases`, `test`), `SigilValidationError`, and constructor helpers (`Sigil.exact`, `Sigil.meta`, `Sigil.named` / `Sigil.define`, `Sigil.collection`).

**Experimental (0.18.0):** `httpContract`, `toFormConstraints()`.

Experimental APIs carry a warning in their documentation and may change before 1.0.0.

**Type declarations:** the package exposes `"types": "./index.d.ts"` for TypeScript consumers. Source files remain plain JavaScript and no TypeScript build step is required to publish or run SigilJS. See [`docs/typescript.md`](typescript.md) for explicit generic examples and conservative inference limits.

> **Preferred API:** `sigil()` is the primary object-definition API. `Sigil`\`...\` is supported as an alternative template syntax. `S` and `T` are legacy aliases for `Sigil` and should not be used in new code.

## Public exports

| Export | Status | Purpose |
|---------|--------|---------|
| `Sigil` | stable advanced | Tagged-template contract factory. |
| `S` | stable (legacy) | Legacy convenience alias for `Sigil`. |
| `T` | stable (legacy) | Legacy convenience alias for `Sigil`. |
| `sigil` | stable | Plain JavaScript object-definition contract factory. |
| `optional` | stable | Helper to mark object-definition fields optional. |
| `union` | stable | Helper to create object-definition union contracts. |
| `oneOf` | stable | Helper to create literal union/enum-style contracts. |
| `pipe` | stable | Field-level transform composition helper. |
| `trim` | stable | String trimming transform helper for `pipe`. |
| `httpContract` | experimental | Framework-neutral HTTP boundary helper with request parts, multi-status responses, and OpenAPI projection. |
| `realType` | stable | Runtime type detector for values. |
| `real` | stable (legacy) | Legacy convenience alias for `realType`. |
| `Real` | stable (legacy) | Legacy convenience alias for `realType`. |
| `SigilValidationError` | stable | Structured error type for contract validation failures: `{ name, code, message, path, expected, actual }`. |

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
| `safeParse(value)` | stable | Returns `{ success: true, data }` or `{ success: false, error }`. |
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
| `test(cases?)` | stable | Returns deterministic contract proof summary object. |
| `diff(other)` | stable | Returns deterministic lifecycle diff entries. |
| `compile()` | stable advanced | Returns the cached compiled boolean validator from a contract instance. |

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

**Returns:** the validated value. For transformed contracts, `parse()` validates input, applies field and contract transforms, revalidates the transformed output, and returns the transformed output.

**Throws:** `SigilValidationError` when invalid.

### `contract.safeParse(value)`

**Status:** stable

**Purpose:** validate without throwing.

**Signature:** `safeParse(value, options?) => { success: true, data } | { success: false, error }`

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

`safeParse()` delegates to `parse()`, so successful transformed contracts return transformed data in the success branch. Ordinary validation failures do not throw.

**Throws:** never for ordinary validation failures.

### `contract.serialize(value)`

**Status:** stable

**Purpose:** validate data for boundary-safe output.

**Signature:** `serialize(value, options?) => value`

**Example:**

```js
const output = User.serialize(trustedValue);
```

**Returns:** the validated value. `serialize()` validates only and does **not** apply field-level or contract-level transforms.

**Throws:** `SigilValidationError` when invalid.

### `contract.transform(fn)`

**Status:** stable

**Purpose:** create a derived contract that validates input, transforms, then revalidates transformed output during `parse()`.

**Signature:** `transform(fn) => contract`

**Example:**

```js
const TrimmedUser = User.transform((user) => ({
  ...user,
  name: user.name.trim(),
}));
```

**Returns:** a new derived contract. Transform callbacks run in registration order during `parse()` / successful `safeParse()`.

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

**Returns:** a deterministic JSON Schema-like subset object. Object property order and required-field order follow contract definition order. Metadata maps to `title`, `description`, `x-version`, and `x-tags`.

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

**Returns:** an OpenAPI-compatible schema-level object. This is a schema projection, not a full OpenAPI document or path item.

**Throws:** never.

### `contract.toFormConstraints()`

**Status:** experimental

Experimental. May change before 1.0.0.

**Purpose:** project object contracts into plain form field metadata (type, required, label, path, options).

**Signature:** `toFormConstraints() => { fields: { [key]: FieldConstraint } }`

**Example:**

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const SignupForm = sigil.exact({
  name: String,
  age: optional(Number),
  role: oneOf('admin', 'user'),
});

const { fields } = SignupForm.toFormConstraints();
fields.name.type     // 'text'
fields.name.required // true
fields.name.label    // 'Name'
fields.age.required  // false
fields.role.type     // 'select'
fields.role.options  // ['admin', 'user']
```

**Returns:** `{ fields: { [fieldName]: { name, path, type, required, label, options?, accepts?, fields?, items? } } }`

Non-object contracts return `{ fields: {} }`.

**Throws:** never.

### `contract.mock()`

**Status:** stable

**Purpose:** generate a deterministic valid sample value.

**Signature:** `mock(options?) => value`

**Example:**

```js
User.mock();
```

**Returns:** a deterministic structurally valid sample value for the contract. Optional fields are omitted by default and included with `{ includeOptional: true }`.

Generated values are structurally valid but not semantically meaningful.

**Throws:** never.

### `contract.cases()`

**Status:** stable

**Purpose:** return deterministic valid/invalid contract test cases.

**Signature:** `cases(options?) => { valid: CaseEntry[], invalid: CaseEntry[] }`

**Example:**

```js
const cases = User.cases();
```

**Returns:**

```ts
{
  valid: Array<{ label: string; value: unknown }>;
  invalid: Array<{
    label: string;
    value: unknown;
    expectedPath?: Array<string | number>;
  }>;
}
```

**Throws:** never.

### `contract.test(cases?)`

**Status:** stable

**Purpose:** run generated or custom cases against the contract and return a runner-agnostic report.

**Signature:** `test(cases?) => { success, valid, invalid, failures }`

**Example:**

```js
const report = User.test();
```

**Returns:**

```ts
{
  success: boolean;
  valid: { passed: number; failed: number };
  invalid: { passed: number; failed: number };
  failures: Array<{ kind: 'valid' | 'invalid'; label: string; value: unknown }>;
}
```

**Throws:** never for ordinary case pass/fail results.

### `contract.diff(other)`

**Status:** stable

**Purpose:** compare contracts for lifecycle drift.

Use `Next.diff(Previous)` to describe changes from the previous contract to the next contract. See [`docs/diff.md`](diff.md) for migration and API review examples.

**Signature:** `diff(other) => change[]`

**Example:**

```js
const changes = NextUser.diff(PreviousUser);
```

**Returns:**

```js
[
  { kind: 'property.added', path: ['displayName'], impact: 'non-breaking', ... },
  { kind: 'property.removed', path: ['username'], impact: 'breaking', ... },
]
```

**Throws:** never.

### `contract.compile()`

**Status:** stable advanced

**Purpose:** expose the cached compiled validator for performance-critical paths.

**Signature:** `compile() => function`

**Example:**

```js
const validate = User.compile();
const ok = validate(data);
```

**Returns:** a compiled validator function.

`contract.compile()` is a method on contract instances. The lower-level compiler in `src/core/compile.js` is internal and is not exported from the package root.

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

### `httpContract({ request, response, ... })`

**Status:** experimental

Experimental. May change before 1.0.0.

**Purpose:** framework-neutral HTTP request/response boundary helper.

**Signature:**

```js
httpContract({
  request,    // Sigil contract for the request body (required)
  response,   // Sigil contract for the primary response body (required)
  responses?, // { [statusCode]: SigilContract } — multi-status response map
  params?,    // Sigil contract for route params
  query?,     // Sigil contract for query string values
  headers?,   // Sigil contract for request headers
  method?,    // string metadata (e.g. 'POST')
  path?,      // string metadata (e.g. '/users/:id')
  summary?,   // string metadata for OpenAPI
  operationId?, // string metadata for OpenAPI
}) => httpContractObject
```

**Example:**

```js
const CreateUser = httpContract({
  method: 'POST',
  path: '/users',
  summary: 'Create a user',
  operationId: 'createUser',
  request: CreateUserBody,
  response: UserResponse,
  responses: {
    201: UserResponse,
    400: ErrorResponse,
  },
  params: sigil.exact({ id: String }),
  headers: sigil.exact({ requestId: String }),
});

// Request
const trusted = CreateUser.parseRequest({
  params: { id: 'user-1' },
  headers: { requestId: 'req_123' },
  body: { name: 'Alex', email: 'alex@example.com', role: 'user' },
});

// Response
const result = CreateUser.parseResponse({ status: 201, body: { id: 1, name: 'Alex' } });

// OpenAPI
CreateUser.toOpenAPI();   // operation-level shape
CreateUser.toPathItem();  // path item shape keyed by path and method
```

**Returned object methods:**

| Method | Description |
|--------|-------------|
| `parseRequest(input)` | Validates `{ body?, params?, query?, headers? }`. Throws on error. |
| `safeParseRequest(input)` | Non-throwing. Returns `{ success, data }` or `{ success, error }`. |
| `parseResponse(input)` | Accepts `{ status, body }` or flat body. Returns `{ status, body }`. |
| `safeParseResponse(input)` | Non-throwing variant of `parseResponse`. |
| `serializeResponse(body)` | Validates and returns the response body. Throws on error. |
| `safeSerializeResponse(body)` | Non-throwing variant of `serializeResponse`. |
| `toOpenAPI()` | Returns operation-level OpenAPI shape (requestBody + responses). |
| `toPathItem()` | Returns path item shape `{ [path]: { [method]: operation } }`. |
| `handler(fn)` | Wraps a function with request validation and response serialization. |

**Throws:** `Error` (multi-part request errors carry a `parts` array); `SigilValidationError` (single-contract validation errors).

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

- `name: 'SigilValidationError'`
- `code: 'SIGIL_VALIDATION_FAILED'`
- `message: string`
- `path: Array<string | number>`
- `expected: string`
- `actual: unknown`

`error.toJSON()` returns `{ code, message, path, expected, actual }`.

This page documents the current stable surface only.



