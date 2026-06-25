# httpContract() Stabilization Decision

Current surface: experimental export of `httpContract({ request, response })`
Stabilization goal: decide future status without expanding the API surface

## Decision

Keep `httpContract()` exported as **experimental**.
Do not make it stable in this block.
Do not remove it.
Do not add new exported HTTP helpers yet.

## Rationale

- The implementation is small and framework-neutral.
- Tests already cover request parsing, response serialization, safe helpers, OpenAPI projection, handler wrapping, framework neutrality, and contract validation.
- The current API is usable for plain-object request/response boundaries without any framework runtime.
- Making it stable now would lock in behavior before route metadata, query/params/headers, status semantics, and error contracts are fully explored.

## Recommended API shape to preserve

```js
const route = httpContract({
  request: RequestContract,
  response: ResponseContract,
});
```

Returned object:

```js
route.parseRequest(input)
route.safeParseRequest(input)
route.parseResponse(input)
route.safeSerializeResponse(input)
route.toOpenAPI()
route.handler(fn)
```

This remains the full public surface for now.
Do not add `route.params`, `route.query`, `route.headers`, `route.method`, or `route.path` runtime behavior in this block.

## Use this as the current recommended path

For HTTP boundaries before any future expansion:

```js
import { httpContract, sigil } from '@weipertda/sigiljs';

const LoginRequest = sigil.exact({
  email: String,
  password: String,
});

const LoginResponse = sigil.exact({
  token: String,
  role: oneOf('admin', 'user'),
  expiresIn: optional(Number),
});

const Login = httpContract({
  request: LoginRequest,
  response: LoginResponse,
});
```

If you need request-side validation now:
`Login.parseRequest(body)`
`Login.safeParseRequest(body)`

If you need response-side validation now:
`Login.parseResponse(body)`
`Login.safeParseResponse(body)`

If you need response serialization:
`Login.serializeResponse(result)`
`Login.safeSerializeResponse(result)`

If you need docs:
`Login.toOpenAPI()`

If you need a framework-neutral handler:
`Login.handler(async (request) => result)`

## What would justify promoting to stable

- route metadata helpers are documented and tested
- query/params/headers model is finalized or explicitly deferred
- response status semantics are finalized
- no breaking changes to the returned object shape for at least one minor release cycle
- docs/examples/tests show real-world framework-neutral usage across multiple adapter styles

## What would justify adding new exported helpers

- a clear need for `httpRequest()` / `httpResponse()` builders that is not achievable with plain contract composition
- user demand for query/params/headers constructors
- stable JSON Schema subset for HTTP-specific projections that cannot be expressed with existing `toOpenAPI()`

Until then, keep the surface minimal and experimental.

## docs/api.md / docs/experimental.md / README.md

Marking guidance:

- `docs/api.md`: keep `httpContract` in the experimental table and method reference.
- `docs/experimental.md`: keep it listed as framework-neutral HTTP boundary helper.
- `README.md`: do not feature it as the primary HTTP story unless the public docs later make HTTP boundaries a main section.

Current state:
- `docs/api.md` already marks `httpContract` experimental.
- `docs/experimental.md` already lists `httpContract({ request, response })`.
- `README.md` does not feature `httpContract` prominently.
- `docs/projections/http.md` documents the helper in detail as experimental.

---

## Addendum — HTTP Boundary Contracts block (subsequent)

The subsequent block (HTTP Boundary Contracts) expanded the API surface beyond this decision. The following were added, all remaining experimental:

- `method`, `path` as metadata fields on the returned contract object (read-only, no runtime validation)
- `params`, `query`, `headers` as optional request-part contracts
- `responses` map: `{ [statusCode]: SigilContract }` for multi-status response routing
- `parseResponse({ status, body })` structured input and status-based routing
- `safeParseResponse`, `serializeResponse`, `safeSerializeResponse`
- `toPathItem()` — OpenAPI path item projection
- `summary`, `operationId` as optional metadata

The decision to keep `httpContract()` as experimental (not stable) still stands.
The surface remains additive on a single returned object with no new top-level exports.

No doc changes are required as part of this decision alone.
