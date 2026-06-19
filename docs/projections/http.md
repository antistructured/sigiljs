# HTTP Boundary Helpers

SigilJS can describe HTTP boundaries without depending on a web framework.

Future direction:

```txt
@sigil/http
@sigil/http/express
@sigil/http/fastify
@sigil/http/hono
```

For now, `httpContract()` lives in core as a dependency-free helper while the API stabilizes.

## Framework-neutral contract

```js
import { httpContract, sigil } from 'sigil';

const LoginRequest = sigil.exact({
  email: String,
  password: String,
});

const LoginResponse = sigil.exact({
  token: String,
});

const Login = httpContract({
  request: LoginRequest,
  response: LoginResponse,
});
```

The returned object has no Express, Fastify, Hono, Request, or Response dependency. It works on plain JavaScript values:

```js
const request = Login.parseRequest(body);
const response = Login.serializeResponse(result);
```

## Handler wrapper

`handler(fn)` validates the request before calling `fn`, then validates/serializes the response:

```js
const handleLogin = Login.handler(async (request) => {
  return {
    token: await issueToken(request.email),
  };
});

const response = await handleLogin(inputBody);
```

This is intentionally framework-neutral. A future adapter can call this helper inside Express, Fastify, Hono, or another server runtime.

## Safe helpers

```js
const parsed = Login.safeParseRequest(body);
const serialized = Login.safeSerializeResponse(responseBody);
```

Both return result objects and never throw:

```js
{
  success: (true, data);
}
{
  success: (false, error);
}
```

## OpenAPI bridge

`httpContract()` builds HTTP docs from existing contract projections:

```js
Login.toOpenAPI();
```

returns an operation-like object:

```js
{
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: LoginRequest.toOpenAPI(),
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: LoginResponse.toOpenAPI(),
        },
      },
    },
  },
}
```

## Adapter boundary

Do not add framework dependencies to core.

Future adapters can be thin wrappers:

```txt
Express req/res → httpContract.parseRequest(body) → handler → serializeResponse(result)
Fastify request/reply → same contract methods
Hono context → same contract methods
```

Core owns the contract semantics. Adapters should only translate framework-specific request/response objects.
