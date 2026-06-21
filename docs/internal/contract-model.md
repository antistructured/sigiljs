# Internal Contract Model

`describe()` is the stable projection source for SigilJS.

Projection and lifecycle helpers should consume the public description model returned by `contract.describe()` or another already-projected stable model derived from it. They should not read parser-specific AST fields such as `ast` or `normalized`.

## Projection source policy

Current contract methods and their projection source:

| Method                | Source model                                      | Notes                                                                 |
| --------------------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| `describe()`          | Stable description generated from normalized core | The bridge between runtime contracts and all projections.             |
| `toJSONSchema()`      | `sigil.describe()`                                | Converts description nodes into JSON Schema-like objects.             |
| `toTypeScript(name)`  | `sigil.describe()`                                | Emits a TypeScript type declaration string; no TypeScript dependency. |
| `toOpenAPI()`         | `sigil.toJSONSchema()`                            | Returns a fresh OpenAPI-compatible schema clone.                      |
| `toFormConstraints()` | `sigil.describe()`                                | Experimental form metadata from object descriptions.                  |
| `mock()`              | `sigil.describe()`                                | Deterministic valid sample data from descriptions.                    |
| `cases()`             | `sigil.describe()`                                | Deterministic valid/invalid cases from descriptions.                  |
| `diff(other)`         | `sigil.describe()` and `other.describe()`         | Object lifecycle comparison from descriptions.                        |

`toMarkdown()` is not currently implemented. If added, it must consume `describe()` rather than parser internals.

## Top-level description shape

`describe()` returns a fresh plain JavaScript object each time. Callers may mutate the returned object without mutating contract internals.

All description nodes have a `kind` field. Some nodes include additional fields.

```js
contract.describe();
// { kind: 'string' }
```

## Primitive contracts

Current primitive-like descriptions:

```js
{
  kind: 'string';
}
{
  kind: 'number';
}
{
  kind: 'boolean';
}
{
  kind: 'bigint';
}
{
  kind: 'symbol';
}
{
  kind: 'array';
}
{
  kind: 'object';
}
{
  kind: 'any';
}
{
  kind: 'unknown';
}
{
  kind: 'never';
}
```

Notes:

- Bare `Array` from object-definition syntax currently describes as `{ kind: 'array' }` without an `element`.
- Bare `Object` from object-definition syntax currently describes as `{ kind: 'object' }` without `properties`.
- Template/object schemas with explicit array/object structure include the fields below.

## Literal contracts

Literal contracts describe the exact literal value:

```js
{ kind: 'literal', value: 'admin' }
{ kind: 'literal', value: 1 }
{ kind: 'literal', value: true }
{ kind: 'literal', value: null }
```

## Array contracts

Typed arrays include an `element` description:

```js
{
  kind: 'array',
  element: { kind: 'string' },
}
```

## Object contracts

Object contracts include exact-mode state and ordered property descriptions:

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
    {
      key: 'name',
      required: false,
      contract: { kind: 'string' },
    },
  ],
}
```

Fields:

- `exact`: `true` when extra object keys are rejected, otherwise `false`.
- `properties`: ordered array of field descriptions.
- `properties[].key`: object property name.
- `properties[].required`: `true` for required fields, `false` for optional fields.
- `properties[].contract`: nested contract description for that property.

## Union contracts

Unions include ordered variant descriptions:

```js
{
  kind: 'union',
  variants: [{ kind: 'string' }, { kind: 'number' }],
}
```

Literal unions use the same shape:

```js
{
  kind: 'union',
  variants: [
    { kind: 'literal', value: 'admin' },
    { kind: 'literal', value: 'user' },
  ],
}
```

## Named sigil references

Named sigils describe as stable references rather than exposing parser internals:

```js
{
  kind: 'reference',
  name: 'Email',
}
```

Projection packages should resolve or emit references from this public shape. They should not inspect identifier AST nodes.

## Contract metadata

Contract metadata is optional. When present, it appears under the top-level `metadata` key:

```js
{
  kind: 'object',
  exact: false,
  properties: [],
  metadata: {
    name: 'User',
    version: '1.2.0',
    description: 'Trusted user boundary object.',
    tags: ['api', 'user'],
  },
}
```

Supported metadata fields:

- `name`
- `version`
- `description`
- `tags`

`version` is contract metadata. It is preserved for projections and lifecycle diffs, but it does not imply package publishing, remote lookup, registry sync, semantic-version solving, or migration execution.

`tags` is cloned on each `describe()` call so callers cannot mutate contract metadata.

## Transform metadata

Transform metadata is optional. It records counts and paths only; it never exposes transform function bodies.

```js
{
  kind: 'object',
  exact: false,
  properties: [],
  metadata: {
    transforms: {
      contract: 1,
      fields: [
        { path: ['name'], count: 1 },
        { path: ['nested', 'title'], count: 2 },
      ],
    },
  },
}
```

Fields:

- `metadata.transforms.contract`: number of contract-level transforms.
- `metadata.transforms.fields`: field-level transform summaries.
- `metadata.transforms.fields[].path`: property path to the transformed field.
- `metadata.transforms.fields[].count`: number of transforms attached to the field.

## Projection coverage expectations

The stable model must represent:

- primitive contracts
- literal contracts
- array contracts
- object contracts
- optional fields
- unions
- exact mode
- named sigils
- contract metadata
- transform metadata

## JSON Schema projection policy

`toJSONSchema()` consumes the stable description model through `src/projections/json-schema.js`.

Supported JSON Schema projections include primitives, `bigint` as `{ type: 'integer' }`, `null`, typed arrays, broad `Array` descriptions as `{ type: 'array' }`, broad `Object` descriptions as `{ type: 'object' }`, objects, optional fields, exact mode as `additionalProperties: false`, literal values, literal unions as `enum`, primitive unions as JSON Schema type arrays, mixed unions as `anyOf`, nested objects, named references, and contract metadata.

Documented fallbacks:

- `any` / `unknown` project to `{}` because they intentionally accept unconstrained JSON values.
- Broad array descriptions without an `element` project to `{ type: 'array' }` rather than inventing item constraints.
- Broad object descriptions without `properties` project to `{ type: 'object' }` rather than inventing property constraints.

Unsupported kinds throw clear errors instead of silently emitting misleading schemas. For example, `symbol` currently throws `JSON Schema projection does not support contract kind: symbol`.

## TypeScript projection policy

`toTypeScript(name)` consumes the stable description model through `src/projections/typescript.js` and emits strings only. It has no TypeScript compiler or runtime dependency.

Supported TypeScript projections include primitives, broad arrays as `unknown[]`, broad objects as `Record<string, unknown>`, typed arrays, objects, optional fields using `?:`, unions using `|`, string/number/boolean/null literals, nested objects with stable indentation, named references, and metadata-derived names.

Naming rules:

- An explicit `toTypeScript('Name')` argument controls the top-level declaration name.
- If no explicit name is provided, `metadata.name` is used when available.
- Named references use the referenced contract's `metadata.name` when available, otherwise the registry/reference name.

The emitted type is structural documentation/codegen only. It does not claim runtime safety by itself; runtime enforcement still comes from Sigil contract methods such as `parse()`, `safeParse()`, `assert()`, and `check()`.

## OpenAPI projection policy

`toOpenAPI()` consumes the stable description model through `src/projections/openapi.js` and currently returns an OpenAPI-compatible schema object. It builds on JSON Schema projection behavior rather than maintaining a separate parser or schema generator.

Current OpenAPI support is schema-only. It covers objects, required and optional fields, arrays, literal unions, nested objects, exact mode as `additionalProperties: false`, and metadata such as `description`. It does not build a full OpenAPI document, route table, path item, operation object, parameter list, status-code map, or HTTP framework adapter.

Unsupported contract kinds follow JSON Schema projection behavior. The OpenAPI projection should not silently emit schemas that imply unsupported runtime semantics.

Current tests cover these shapes in:

- `tests/describe-model.test.js`
- `tests/json-schema.test.js`
- `tests/typescript-projection.test.js`
- `tests/openapi-projection.test.js`
- `tests/forms-projection.test.js`
- `tests/testing-helpers.test.js`
- `tests/contract-diff.test.js`
- `tests/projection-consistency.test.js`

## Package split relevance

Future packages such as `@sigil/json-schema`, `@sigil/ts`, and `@sigil/openapi` should accept a Sigil contract or a plain description object. Their implementation boundary should be:

```txt
contract -> describe() -> projection package
```

They should not import parser, tokenizer, compiler, normalize, partial-evaluation, or validator internals.
