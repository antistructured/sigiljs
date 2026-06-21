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

Broad descriptions are handled honestly:

- broad `Array` without `element` projects as `{ type: 'array' }`
- broad `Object` without `properties` projects as `{ type: 'object' }`

Unsupported kinds throw structured projection errors instead of inventing misleading output.

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

### `diff(other)`

Compares two object contract descriptions and reports lifecycle changes.

Diff treats projection-visible description drift as the source of truth. It does not compare parser internals.

## Future projections

These concepts are part of the roadmap, not current shipped scope unless explicitly documented elsewhere:

- `toFormConstraints()`
- `toMarkdown()`
- `toOpenAI()`
- full OpenAPI document generation
- additional `@sigil/*` packages

## Projection error handling

Projection failures are explicit.

Some contract behavior cannot be represented perfectly in every projection. When a projection cannot safely represent a contract description, SigilJS throws a `SigilProjectionError` instead of crashing with a raw exception or emitting misleading output.

Projection errors include:

- `code`
- `projection`
- `path`
- `kind`
- `reason`
- `message`

Broad object behavior is explicit too:

- structured `object` descriptions project their known fields
- broad `object` descriptions without `properties` project as `{ type: 'object' }`
- broad `Array` descriptions without `element` project as `{ type: 'array' }`

## Design contract

Projection support is described by the same public description model used by runtime enforcement. Projection modules should:

1. accept a contract object or description object
2. read only `describe()` output
3. return fresh output each call
4. preserve contract metadata when the target format supports it
5. fail with structured `SigilProjectionError` when accuracy is impossible

This is the boundary future extraction should preserve.

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
