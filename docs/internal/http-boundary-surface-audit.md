# HTTP Boundary Surface Audit

Inspected paths:

- `src/index.js`
- `src/http.js`
- `docs/api.md`
- `docs/experimental.md`
- `docs/projections/http.md`
- `docs/boundaries/api.md`
- `README.md`
- `tests/http-contract.test.js`
- `examples/http-request-contract.js`
- `examples/http-response-contract.js`

## Current package name

- Current package: `@weipertda/sigiljs`
- No `@sigil/http` or HTTP scoped package exists
- HTTP boundary behavior lives inside core exports/docs

## HTTP examples

Current HTTP examples:

- `examples/http-request-contract.js`
- `examples/http-response-contract.js`

These examples:

- import from `../src/index.js`
- use deterministic values
- do not make network calls
- do not depend on Express, Fastify, Hono, or other framework runtimes
- demonstrate request parsing, response serialization, and OpenAPI projection

There is no query/params/headers-specific example yet for this task block.

## HTTP docs

Current HTTP docs:

- `docs/projections/http.md` — primary helper docs
- `docs/boundaries/api.md` — boundary overview for APIs
- `docs/api.md` — public API docs including `httpContract`
- `docs/experimental.md` — lists `httpContract` as experimental

`docs/projections/http.md` currently mentions future hypothetical packages:
`@sigil/http`, `@sigil/http/express`, `@sigil/http/fastify`, `@sigil/http/hono`.

## HTTP public APIs

Public HTTP API:

- `httpContract({ request, response })`

Status:
- exported from `src/index.js`
- documented in `docs/api.md` and `docs/experimental.md`
- classified as experimental
- framework-neutral by implementation

Surface currently does not expose separate request/query/header/param helpers.

## HTTP experimental APIs

Experimental API status:

- `httpContract({ request, response })`

Not present:
- no `request()` helper
- no `response()` helper
- no query/params/headers boundary helper
- no route middleware helper

Documentation coverage:
- experimental note exists in `docs/experimental.md`
- detailed behavior docs exist in `docs/projections/http.md`
- boundary orientation exists in `docs/boundaries/api.md`

## OpenAPI alignment

Current OpenAPI alignment:

- `contract.toOpenAPI()` is stable for individual contracts
- `httpContract.toOpenAPI()` projects request/response pairs with `requestBody` and `200` response shape
- Tests assert expected OpenAPI structure in `tests/http-contract.test.js`

Gap:
- route-level metadata, params, query, headers, status codes beyond `200`, and summary metadata are not modeled by `httpContract()` today.

## Framework-specific behavior

Framework coupling:

- none in `src/http.js`
- tests validate length and call signatures, not framework objects
- examples do not import frameworks

Current admissibility boundary:
- core owns contract semantics
- framework adapters would translate framework req/res objects into plain contract calls

## Query/params/headers readiness

Query/params/headers state:

- no dedicated API yet
- no dedicated examples yet
- no dedicated tests yet
- no dedicated docs pages yet

These are candidate work for later tasks in this block and should not be added in Task 1 unless requested.

## Testing status

Current HTTP tests:

- `tests/http-contract.test.js` covers:
  - object creation
  - request parsing
  - response serialize
  - safe parse/serialize
  - OpenAPI projection
  - handler wrapper
  - framework neutrality
  - missing contract validation

Public API surface tests also verify `httpContract` exists and is callable.

## Recommended scope for this block

Recommended work:

- Task 1: document current surface and classify APIs
- add/expand request examples: query/params/headers if scope allows later
- add/expand response examples: status-code variations if scope allows later
- expand tests for new boundary helpers when added
- keep framework adapters out of core
- preserve single-package rule

Do not add:
- framework-specific adapters
- network calls in examples/tests
- provider SDKs
- provider-specific HTTP helper abstractions

This audit supports moving Task 2 through Task 10 with an honest baseline.
