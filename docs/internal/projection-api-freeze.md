# Internal: Projection API Freeze

Freeze target: `@weipertda/sigiljs` 0.4.0
Scope: `describe()`, `toJSONSchema()`, `toTypeScript(name)`, `toOpenAPI()`

## Freeze rules

1. Projections consume `describe()` or stable contract descriptions.
2. Projections do not consume raw parser internals.
3. Unsupported projection behavior throws `SigilProjectionError`.
4. Broad object behavior is documented.
5. Metadata behavior is documented.
6. Output ordering is deterministic.

## Public surface

| Export | Method | Stable in 0.4.0 |
|------|------|------|
| contract | `describe()` | yes |
| contract | `toJSONSchema()` | yes |
| contract | `toTypeScript(name?)` | yes |
| contract | `toOpenAPI()` | yes |

## Input contract

All projection methods operate on a contract object created via `sigil()` or `Sigil`\`...\`.  
Projections read the public description returned by `describe()`. They do not read:

- parser AST nodes directly
- compiled validator functions
- internal cache references

This boundary allows future extraction to replace internal parser implementation without changing the projection contract.

## Output contract

`describe()` returns a fresh plain object on every call.

JSON Schema, TypeScript, and OpenAPI methods return fresh plain values on every call.

Callers may mutate projection outputs without affecting the source contract or subsequent calls.

`toOpenAPI()` returns a deep clone of `toJSONSchema()`. It does not share references with `toJSONSchema()`.

## Determinism

Projections are deterministic for the same contract description:

- object properties are emitted in declaration order
- union variants are emitted in declaration order
- literal order is preserved
- metadata keys are emitted before structural keys in JSON Schema / OpenAPI

`describe()` is intentionally not identity-stable across calls. Do not use `===` on two `describe()` results.

## Error contract

| Condition | Behavior |
|------|------|
| unsupported kind (e.g. `symbol`) | throws `SigilProjectionError` |
| unsupported kind in `toJSONSchema()` | throws `SigilProjectionError` with `reason: 'unsupported_kind'` |
| unsupported kind in `toTypeScript()` | throws `SigilProjectionError` with `reason: 'unsupported contract description'` |
| invalid input to projection | throws `SigilProjectionError` or `Error` with descriptive message |

No projection currently throws raw strings for expected projection failures.

Callers should treat any non-`SigilProjectionError` from a projection as a programming error.

## `SigilProjectionError` shape

```ts
{
  name: 'SigilProjectionError'
  code: 'SIGIL_PROJECTION_FAILED'
  projection: string
  path: string[]
  kind: string | null
  reason: string | null
  message: string
}
```

## Metadata behavior

Metadata is projected only when the target format supports it.

### JSON Schema / OpenAPI

| Metadata | Projected field |
|------|------|
| `name` | `title` |
| `description` | `description` |
| `version` | `x-version` |
| `tags` | `x-tags` |

`x-tags` is always projected as an array copy.

Metadata keys are inserted before structural keys by `applyProjectionMetadata()` and `metadataFirst()`.

### TypeScript

| Metadata | Projected field |
|------|------|
| `name` | type alias name |
| `description` | JSDoc line |
| `version` | `@version` JSDoc line |
| `tags` | `@tags` JSDoc line |

If no metadata is present, no JSDoc comment is emitted.

## Broad descriptor behavior

Broad contracts without element or property detail are handled safely.

| Contract | JSON Schema | TypeScript | OpenAPI |
|------|------|------|------|
| `sigil(String)` | `{ type: 'string' }` | `string` | `{ type: 'string' }` |
| `sigil(Number)` | `{ type: 'number' }` | `number` | `{ type: 'number' }` |
| `sigil(Boolean)` | `{ type: 'boolean' }` | `boolean` | `{ type: 'boolean' }` |
| `sigil(Object)` | `{ type: 'object' }` | `Record<string, unknown>` | `{ type: 'object' }` |
| `sigil(Array)` | `{ type: 'array' }` | `unknown[]` | `{ type: 'array' }` |
| `Sigil\`string\`` | `{ type: 'string' }` | `string` | `{ type: 'string' }` |
| `Sigil\`string | number\`` | `{ type: ['string', 'number'] }` | `string | number` | `{ type: ['string', 'number'] }` |
| `Sigil\`symbol\`` | throws `SigilProjectionError` | throws `SigilProjectionError` | throws `SigilProjectionError` |

## Supported contract kinds

| Kind | JSON Schema | TypeScript | OpenAPI |
|------|------|------|------|
| `string` | `{ type: 'string' }` | `string` | same as JSON Schema |
| `number` | `{ type: 'number' }` | `number` | same |
| `boolean` | `{ type: 'boolean' }` | `boolean` | same |
| `null` | `{ type: 'null' }` | `null` | same |
| `bigint` | `{ type: 'integer' }` | `bigint` | same |
| `any` | `{}` | `any` | same |
| `unknown` | `{}` | `unknown` | same |
| `never` | `{ not: {} }` | `never` | same |
| `literal` | `{ const: value }` | JSON literal | same |
| `union` | `{ enum: [...] }`, `{ type: [...] }`, or `{ anyOf: [...] }` | `A | B` | same as JSON Schema |
| `array` | `{ type: 'array', items: ... }` | `T[]` or `Array<T>` | same as JSON Schema |
| `object` | `{ type: 'object', properties: ... }` | `{ key: type }` | same as JSON Schema |
| `reference` | `{ $ref: '#/$defs/Name' }` | resolved name | same as JSON Schema |
| `symbol` | throws | throws | throws |

## Unsupported behavior policy

Projections must not invent output for contract kinds they cannot represent accurately.

If a projection cannot represent a kind safely, it throws `SigilProjectionError` with:
- `projection`: the projection name (e.g. `'json-schema'`, `'typescript'`, `'openapi'`)
- `reason`: stable machine-readable reason
- `kind`: the unsupported kind name if determinable
- `path`: the property path within the contract where the unsupported kind was found
- `message`: human-readable explanation

This rule prevents silent data loss and makes projection failures actionable.

## Test coverage

These behaviors are currently covered by tests:

| Behavior | Test file |
|------|------|
| JSON Schema snapshot matrix | `tests/projections/json-schema.snapshot.test.js` |
| TypeScript snapshot matrix | `tests/projections/typescript.snapshot.test.js` |
| OpenAPI snapshot matrix | `tests/projections/openapi.snapshot.test.js` |
| projection compatibility across `describe`, JSON Schema, TypeScript, OpenAPI | `tests/projections/projection-compatibility.test.js` |
| deterministic output on repeated calls | `tests/projections/projection-compatibility.test.js` |
- `describe()`, `toJSONSchema()`, `toTypeScript()`, `toOpenAPI()` all return equal values on repeated calls

| JSON Schema unsupported kind throws structured error | `tests/projections/projection-errors.test.js` |
| TypeScript unsupported kind throws structured error | `tests/projections/projection-errors.test.js` |
| Broad `Object` does not crash JSON Schema | `tests/projections/projection-errors.test.js` |
| Broad `Object` does not crash TypeScript | `tests/projections/projection-errors.test.js` |
| Structured error fields are stable | `tests/projections/projection-errors.test.js` |
