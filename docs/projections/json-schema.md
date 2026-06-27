# JSON Schema Projection

Projection turns a Sigil contract into another structural representation.

SigilJS contracts are executable data contracts. They can validate runtime data directly, and they can also project their structure into formats that other tools understand.

JSON Schema is the first serious projection.

```js
import { oneOf, sigil } from '@weipertda/sigiljs';

const User = sigil.exact({
  id: Number,
  name: String,
  role: oneOf('admin', 'user'),
});

User.toJSONSchema();
```

returns:

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

## Supported projections

`toJSONSchema()` currently supports:

- `string`
- `number`
- `boolean`
- `null`
- arrays
- objects
- required fields
- optional fields
- exact mode via `additionalProperties: false`
- literal unions as `enum`
- primitive unions as JSON Schema `type` arrays
- mixed unions as `anyOf`
- named references as `$ref` values

## Exact mode

Exact Sigil contracts reject unknown keys at runtime. In JSON Schema projection, exact mode is represented as:

```js
{
  additionalProperties: false,
}
```

Loose contracts omit `additionalProperties`, matching runtime behavior where extra keys are allowed.

## Why this uses `describe()`

`toJSONSchema()` is built from the public contract description model returned by `describe()`.

That keeps projection logic separate from parser internals:

```txt
Sigil contract → describe() → JSON Schema
```

This is the projection pattern future packages could follow if package extraction is justified later:

```txt
@sigil/json-schema  (does not exist yet)
@sigil/ts           (does not exist yet)
@sigil/openapi      (does not exist yet)
```

For now, JSON Schema projection lives inside core until the public API stabilizes.

## Projection errors

Some runtime contract behavior cannot always be represented perfectly in every projection.

When a projection cannot safely represent a contract description, SigilJS throws a `SigilProjectionError` instead of silently emitting a misleading schema or crashing with a raw `TypeError`.

Projection errors include:

- `code`
- `projection`
- `path`
- `kind`
- `reason`
- `message`

**Broad object behavior**

Broad `object` descriptions are common and remain projectable.

- Structured objects project their known fields.
- Broad `object` descriptions without `properties` project as `{ type: 'object' }` instead of inventing property constraints.
- Broad `Array` descriptions without an `element` project as `{ type: 'array' }` instead of inventing item constraints.
