# Projections

Projection is what turns SigilJS from a validator into a contract system.

A single contract object can do more than just enforce values at runtime. It can also describe its own structure so other tools, formats, and boundaries can consume the same contract without redefining it by hand.

SigilJS treats that capability as a first-class pillar, not an afterthought.

## Four pillars

- Define structure once
- Enforce it at runtime
- Transform it into trusted shape
- Project it into other structural representations

That ordering matters.

`describe()` is the source of truth. All projections derive from the public contract description, not from parser internals or runtime enforcement details.

## Stable projection source

```js
const description = User.describe();
```

`describe()` returns a fresh plain object every call. Callers may mutate the returned object without affecting the contract.

This boundary matters for future package extraction. Projection packages should accept either a contract object or a description object, then derive output from that shared model:

```txt
contract -> describe() -> projection package
```

The current single package is `@weipertda/sigiljs`.

## Public projection surfaces

### `describe()`

**Purpose:** return the stable contract description used by all projections.

**Input:** none.

**Output shape:**

```ts
{
  kind: string
  exact?: boolean
  properties?: Array<{
    key: string
    required: boolean
    contract: object
  }>
  variants?: Array<object>
  element?: object
  value?: any
  name?: string
  metadata?: {
    name?: string
    version?: string
    description?: string
    tags?: string[]
  }
}
```

**Behavior contract:**
- returns a fresh plain object on every call
- does not expose parser internals or runtime validator state
- includes metadata only when present on the contract
- objects use `properties` array with `key`, `required`, and `contract` fields
- primitive unions use `variants` array
- literal unions use `variants` array with `kind: 'literal'` and `value`
- arrays include `element`
- named sigil references resolve to `{ kind: 'reference', name: '...' }`

**Throws:** never.
**Experimental:** no.

### `toJSONSchema()`

**Purpose:** project a contract description into a JSON Schema-like object.

**Input:** none. Uses `describe()` internally.

**Output shape:** plain object.

**Behavior contract:**
- primitives map to `{ type: '<kind>' }`
- `bigint` maps to `{ type: 'integer' }`
- `null` maps to `{ type: 'null' }`
- `boolean` maps to `{ type: 'boolean' }`
- `any` and `unknown` map to `{}`
- `never` maps to `{ not: {} }`
- `symbol` is unsupported and throws `SigilProjectionError`
- literal values map to `{ const: value }` or `{ enum: [...] }`
- primitive unions map to `{ type: ['string', 'number', ...] }`
- mixed unions map to `{ anyOf: [...] }`
- objects map to `{ type: 'object', properties: { ... }, required: [...] }`
- exact objects add `additionalProperties: false`
- broad `Array` without `element` maps to `{ type: 'array' }`
- broad `Object` without `properties` maps to `{ type: 'object' }`
- named references map to `{ $ref: '#/$defs/<Name>' }`
- metadata maps to `title`, `description`, `x-version`, `x-tags`

**Throws:** `SigilProjectionError` for unsupported kinds (e.g. `symbol`).
**Experimental:** no.

### `toTypeScript(name?)`

**Purpose:** emit a TypeScript type declaration string.

**Input:** optional `name` string. Falls back to contract metadata name, then `'Contract'`.

**Output shape:** `string`.

**Behavior contract:**
- primitives map to lowercase type keywords (`string`, `number`, `boolean`, `bigint`, `any`, `unknown`, `never`)
- `null` maps to `null`
- literals map to JSON-quoted literal values
- unions map to `A | B` expressions
- primitive unions flatten directly (e.g. `string | number`)
- arrays map to `T[]` for simple types, `Array<T>` for unions and objects
- objects map to `{ key: type; key?: type }`
- broad `Object` without properties maps to `Record<string, unknown>`
- broad `Array` without element maps to `unknown[]`
- named references resolve via the registry and use metadata names when available
- metadata emits a JSDoc-style doc comment above the declaration

**Throws:** `SigilProjectionError` when the contract cannot be represented accurately.
**Experimental:** no.

### `toOpenAPI()`

**Purpose:** return an OpenAPI-compatible schema object derived from JSON Schema projection.

**Input:** none.

**Output shape:** plain object (deep clone of JSON Schema output).

**Behavior contract:**
- output is structurally identical to `toJSONSchema()`
- output is a fresh deep clone each call, so callers may mutate without affecting subsequent calls
- metadata mapping is identical to JSON Schema

**Throws:** same conditions as `toJSONSchema()`.
**Experimental:** no.

## Error handling

Projections throw `SigilProjectionError` instead of raw strings or uncaught exceptions.

```ts
class SigilProjectionError extends Error {
  code: 'SIGIL_PROJECTION_FAILED'
  projection: string
  path: string[]
  kind: string | null
  reason: string | null
  message: string
}
```

Callers can use `instanceof SigilProjectionError` to distinguish projection failures from validation failures or programming errors.

## Metadata behavior

Metadata is projected only when the target format supports it:

| Metadata field | JSON Schema | OpenAPI | TypeScript |
|------|------|------|------|
| `name` | `title` | `title` | declaration name / type alias |
| `description` | `description` | `description` | JSDoc comment |
| `version` | `x-version` | `x-version` | `@version` JSDoc line |
| `tags` | `x-tags` | `x-tags` | `@tags` JSDoc line |

Metadata does not change validation behavior. Contracts without metadata project the same structural output minus the metadata fields.

## Deterministic output

Projections are deterministic for the same contract description:

- object property order follows the original contract definition
- union variant order is preserved
- metadata keys are ordered before structural keys in JSON Schema / OpenAPI output
- `describe()` returns fresh objects, so identity checks between calls are intentionally not stable

## Broad descriptor behavior

Broad contracts (e.g. `Sigil\`object\`` or `sigil(Object)`) are handled safely:

- JSON Schema: `{ type: 'object' }`
- TypeScript: `Record<string, unknown>`
- OpenAPI: `{ type: 'object' }`

Broad arrays without an element type:

- JSON Schema: `{ type: 'array' }`
- TypeScript: `unknown[]`
- OpenAPI: `{ type: 'array' }`

Broad descriptors do not crash projections and do not invent fields that were not declared.

## Unsupported behavior

Projections refuse to invent output for contract kinds they cannot represent accurately. Examples:

- `symbol` contracts throw `SigilProjectionError` because JSON Schema has no `symbol` type
- unsupported or unknown top-level kinds throw rather than emit empty schemas
- `toTypeScript()` throws for unsupported kinds instead of falling back to `unknown`

This is intentional. Silent fallback hides bugs. Structured errors let callers handle unsupported contracts explicitly.

## Current projection methods

### `toJSONSchema()`

Converts a contract description into a JSON Schema-like object.

```js
const User = sigil.exact({
  id: Number,
  name: String,
  role: oneOf('admin', 'user'),
});

User.toJSONSchema();
```

```js
{
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    role: { enum: ['admin', 'user'] },
  },
  required: ['id', 'name', 'role'],
  additionalProperties: false,
}
```

This projection supports primitives, arrays, objects, optional fields, exact mode, literal unions, primitive unions, mixed unions, named references, and metadata.

### `toTypeScript(name?)`

Emits a TypeScript type declaration string.

```js
const User = sigil.exact({
  id: Number,
  name: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});

User.toTypeScript('User');
```

```js
type User = {
  id: number
  name: string
  role: "admin" | "user"
  age?: number
}
```

This projection includes primitives, arrays, objects, exact objects, optional fields, literal unions, primitive unions, nested objects, named references, and metadata.

Broad constructors are projected safely:

- broad `Array` becomes `unknown[]`
- broad `Object` becomes `Record<string, unknown>`

This projection does not depend on the TypeScript compiler.

### `toOpenAPI()`

Returns an OpenAPI-compatible schema object derived from JSON Schema projection.

```js
User.toOpenAPI();
```

```js
{
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    role: { enum: ['admin', 'user'] },
  },
  required: ['id', 'name', 'role'],
  additionalProperties: false,
}
```

Current support is schema-level only.

It does not build full OpenAPI documents, route tables, parameters, or operation objects.

## Package boundary guidance

Current package: `@weipertda/sigiljs`

`@sigil/*` packages are future direction, not current packaging.

This repo already separates projection logic internally, but internal separation is not the same as consumer-facing package boundaries.

Do not split until:

- projection APIs have survived more real usage
- the exact output behavior is stable across multiple releases
- consumer migration stories are clear and documented

Preferred order if extraction is later approved:

1. `@sigil/json-schema`
2. `@sigil/ts`
3. `@sigil/openapi`
4. `@sigil/testing`
5. `@sigil/ai`
6. `@sigil/forms`
7. `@sigil/http`
