# OpenAPI Projection

Projection turns a Sigil contract into another structural representation.

OpenAPI projection currently builds on the JSON Schema projection:

```txt
Sigil contract → describe() → JSON Schema → OpenAPI-compatible schema
```

For now, `toOpenAPI()` returns an OpenAPI-compatible **schema object** using `toJSONSchema()` as the base. It does not build a full OpenAPI document and does not create route definitions.

```js
import { oneOf, sigil } from '@weipertda/sigiljs';

const User = sigil.exact({
  id: Number,
  name: String,
  role: oneOf('admin', 'user'),
});

User.toOpenAPI();
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

## Current support level

`toOpenAPI()` is schema-only. It supports the same stable contract-description subset as the JSON Schema projection where that output is OpenAPI-compatible:

- object schemas
- required fields
- optional fields omitted from `required`
- arrays
- literal unions as `enum`
- nested objects
- exact mode as `additionalProperties: false`
- metadata `name` / `description` / `version` / `tags` as `title` / `description` / `x-version` / `x-tags`

Unsupported kinds follow JSON Schema projection behavior. For example, kinds that cannot be represented honestly throw rather than emitting a misleading schema.

## Runtime enforcement and documentation from one contract

A Sigil can enforce runtime data and project the same shape into OpenAPI request/response docs:

```js
const CreateUserRequest = sigil.exact({
  email: String,
  name: String,
});

const trusted = CreateUserRequest.parse(input);

const requestBody = {
  required: true,
  content: {
    'application/json': {
      schema: CreateUserRequest.toOpenAPI(),
    },
  },
};
```

This is intentionally just the schema portion. Route paths, operations, parameters, status codes, and framework adapters are out of scope for the current projection.

The framework-neutral `httpContract()` helper can compose request/response schema objects for simple docs, but it is not a full OpenAPI document builder.

## Package direction

OpenAPI projection currently lives in core while the projection model stabilizes.

Future direction:

```txt
@sigil/openapi
```

That package should consume `describe()` or the same stable projection model rather than parser internals. It should only grow full document/route helpers after the schema projection boundary is stable.
