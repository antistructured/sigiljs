# HTTP Boundary Helpers

**Status: Experimental. May change before 1.0.0.**

SigilJS can describe HTTP request and response boundaries without depending on a web framework.

`httpContract()` lives in the core package as a dependency-free, framework-neutral helper while the API stabilizes.

## Quick example

```js
import { httpContract, oneOf, optional, sigil } from '@weipertda/sigiljs';

const LoginRequest = sigil.exact({ email: String, password: String });
const LoginResponse = sigil.exact({ token: String, role: oneOf('admin', 'user') });

const Login = httpContract({
  method: 'POST',
  path: '/auth/login',
  summary: 'Log in a user',
  operationId: 'login',
  request: LoginRequest,
  response: LoginResponse,
});
```

## Request parts

A request can contain any combination of `body`, `params`, `query`, and `headers`.
Each part is a Sigil contract. Missing parts are skipped automatically.

```js
const UpdateUser = httpContract({
  method: 'PATCH',
  path: '/users/:id',
  request: sigil.exact({ name: optional(String), email: optional(String) }),
  response: sigil.exact({ id: Number, name: String, email: String }),
  params:  sigil.exact({ id: String }),
  query:   sigil.exact({ dryRun: optional(String) }),
  headers: sigil.exact({ authorization: String ***```

Input shape for `parseRequest`:

```js
{
  params:  { id: 'user-42' },
  query:   { dryRun: 'false' },
  headers: { authorization: 'Bearer <token>' },
  body:    { name: 'Dana' },
}
```

### parseRequest / safeParseRequest

```js
const trusted = UpdateUser.parseRequest({
  params: { id: 'user-42' },
  headers: { authorization: 'Bearer <token>' },
  body: { name: 'Dana' },
});

trusted.params.id   // 'user-42'
trusted.body.name   // 'Dana'
```

`safeParseRequest` never throws:

```js
const result = UpdateUser.safeParseRequest(input);
if (!result.success) {
  console.error(result.error.message);
}
```

## Response boundary

### Single response contract

```js
const route = httpContract({ request: RequestContract, response: UserResponse });

const result = route.parseResponse({ status: 200, body: { id: 1, name: 'Alex' } });
result.status  // 200
result.body    // { id: 1, name: 'Alex' }
```

Flat body input (backward compat) is treated as status 200:

```js
route.parseResponse({ id: 1, name: 'Alex' })
// → { status: 200, body: { id: 1, name: 'Alex' } }
```

### Multi-status response map

Use the `responses` option to validate different body shapes per status code:

```js
const CreateUser = httpContract({
  request: CreateUserRequest,
  response: UserResponse,
  responses: {
    201: UserResponse,
    400: sigil.exact({ code: String, message: String }),
    422: sigil.exact({ field: String, issue: String }),
  },
});

const ok   = CreateUser.parseResponse({ status: 201, body: { id: 1, name: 'Alex' } });
const err  = CreateUser.parseResponse({ status: 400, body: { code: 'INVALID', message: '...' } });
```

Status codes not in the `responses` map fall back to the primary `response` contract.

### safeParseResponse

```js
const result = CreateUser.safeParseResponse({ status: 201, body: { id: 1, name: 'Alex' } });
if (result.success) {
  result.data.status  // 201
  result.data.body    // validated body
}
```

## Route metadata

`method`, `path`, `summary`, and `operationId` are metadata fields.
They are stored on the contract but not enforced as runtime data contracts.

```js
route.method      // 'PATCH'
route.path        // '/users/:id'
route.summary     // 'Update a user'
route.operationId // 'updateUser'
```

## Handler wrapper

`handler(fn)` validates the request before calling `fn`, then serializes the response:

```js
const handleLogin = Login.handler(async (request) => {
  // request.body, request.params, etc. are already validated
  return { token: 'tok_123', role: 'user' };
});

const response = await handleLogin({
  body: { email: 'dana@example.com', password: 'secret' },
});
```

This is intentionally framework-neutral. An adapter can call this helper inside Express, Fastify, Hono, or any other runtime.

## Safe helpers

```js
Login.safeParseRequest(input)   // { success, data } | { success, error }
Login.safeParseResponse(input)  // { success, data } | { success, error }
Login.safeSerializeResponse(body) // { success, data } | { success, error }
```

None of these throw. The error shape for multi-part request failures includes a `parts` array:

```js
error.parts  // [{ part: 'body', error: SigilValidationError }, ...]
```

## OpenAPI bridge

### toOpenAPI()

Returns an operation-level shape (requestBody + responses):

```js
Login.toOpenAPI()
// {
//   requestBody: { required: true, content: { 'application/json': { schema: ... } } },
//   responses: {
//     200: { description: 'Successful response', content: { 'application/json': { schema: ... } } }
//   }
// }
```

### toPathItem()

Returns an OpenAPI path item object, keyed by path and method:

```js
Login.toPathItem()
// {
//   '/auth/login': {
//     post: {
//       summary: 'Log in a user',
//       operationId: 'login',
//       requestBody: { ... },
//       responses: { 200: { ... } }
//     }
//   }
// }
```

When `method`/`path` are not provided, `toPathItem()` returns the flat operation object: the same shape as `toOpenAPI()` with any `summary` and `operationId` fields appended at the top level.

Known status code descriptions include: 200, 201, 204, 400, 401, 403, 404, 409, 422, 500. Other codes default to `"Response <code>"`.

## Framework adapter boundary

Do not add framework dependencies to core.

Future adapters should be thin wrappers that normalize framework-specific request/response objects into the plain `{ body, params, query, headers }` input shape:

```txt
Express req/res → { body: req.body, params: req.params, query: req.query, headers: req.headers }
                → httpContract.parseRequest(normalized)
                → handler fn
                → httpContract.serializeResponse(result)
```

Core owns contract semantics. Adapters translate; they do not validate.

## requestParts inspection

```js
route.requestParts  // frozen: { params?, query?, headers?, body }
```

Only parts that have a corresponding contract are included. `body` is always present because `request` is required. `params`, `query`, and `headers` appear only when their respective contracts are passed to `httpContract()`.

## Non-goals

`httpContract()` does not:

- depend on Express, Fastify, Hono, or any other framework
- parse raw query strings or URL-encoded bodies
- normalize HTTP headers
- handle cookies, sessions, or multipart
- route requests
- provide middleware
- route `handler()` responses through the `responses` map — `handler()` always serializes via the primary `response` contract

These are application or adapter responsibilities.
