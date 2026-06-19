# OpenAPI Projection

Projection turns a Sigil contract into another structural representation.

OpenAPI projection builds on the JSON Schema projection:

```txt
Sigil contract → describe() → JSON Schema → OpenAPI schema
```

For now, `toOpenAPI()` returns an OpenAPI-compatible schema object using `toJSONSchema()` as the base.

```js
import { oneOf, sigil } from 'sigil';

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

## Runtime enforcement and documentation from one contract

A Sigil can enforce runtime data and project the same shape into OpenAPI docs:

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

See:

- [`../../examples/http-request-contract.js`](../../examples/http-request-contract.js)
- [`../../examples/http-response-contract.js`](../../examples/http-response-contract.js)

## Package direction

OpenAPI projection currently lives in core while the projection model stabilizes.

Future direction:

```txt
@sigil/openapi
```

That package should consume `describe()` or the same stable projection model rather than parser internals.
