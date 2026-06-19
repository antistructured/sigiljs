# API boundaries

APIs receive request bodies and response bodies from clients and upstream services. Both sides are untrusted until validated.

At the request boundary, use a contract to describe the shape you accept, then call `parse()` or `safeParse()` on the incoming body. At the response boundary, describe the shape your code needs and assert the upstream result before using it.

Returning a result to a client with `serialize()` keeps the response inside the contract boundary.

Use API boundaries for:

- incoming JSON or form bodies
- authenticated request payloads
- upstream service response contracts
- versioned API envelope objects
- library-safe request builders

## Recommended style

Use exact contracts for API embodiments so unexpected keys fail fast.

```js
const LoginRequest = Sigil.exact`
  email: string
  password: string
`;

const httpRequest = await req.json();
const loginInput = LoginRequest.parse(httpRequest);
```

## Quick example

```js
const ApiResponse = Sigil.exact`
  status: number
  body?: object
`;

const response = await fetch('/api/health').then((r) => r.json());
const framed = ApiResponse.assert(response);
```

The response is unknown until `ApiResponse.assert(response)` succeeds.
