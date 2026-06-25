# HTTP Extraction Readiness Report

**Package:** `@weipertda/sigiljs`
**Block:** HTTP Boundary Contracts
**Report date:** 2025

## Summary

This report documents the current state of `httpContract()` and its readiness for extraction to a hypothetical `@sigil/http` package.

**Decision: Not ready for extraction. Continue in core as experimental.**

The feature is functional and tested, but the surface is still experimental and has not been proven across multiple adapter styles or real-world usage patterns.

## What was completed in this block

### Task 1 — Audit
- Documented existing HTTP surface in `docs/internal/http-boundary-surface-audit.md`.
- Classified `httpContract()` as experimental, framework-neutral, and non-split.

### Task 2 — Model Design
- Documented HTTP boundary shape in `docs/internal/http-contract-model.md`.
- Defined `{ params, query, headers, body }` as the canonical request input shape.
- Defined `{ status, body }` as the canonical response shape.

### Task 3 — Stabilization Decision
- Decided to keep `httpContract()` as experimental export.
- Documented in `docs/internal/http-contract-stabilization-decision.md`.

### Task 4 — Request Boundary Helpers
- Added `method` and `path` metadata to the contract object.
- `parseRequest` now accepts structured `{ body, params, query, headers }` input.
- `params`, `query`, and `headers` are validated independently per contract.
- Missing parts are skipped (callers own required-field semantics).
- Tests cover all parts individually and together.

### Task 5 — Response Boundary Helpers
- `parseResponse` now accepts `{ status, body }` structured input.
- Flat body input is treated as status 200 (backward compat).
- `responses` option enables multi-status routing: `{ 200: ContractA, 400: ContractB }`.
- `safeParseResponse` added.
- `toOpenAPI()` reflects the multi-status `responses` map.

### Task 6 — HTTP OpenAPI Alignment
- `toPathItem()` added — returns OpenAPI path item `{ [path]: { [method]: operation } }`.
- `summary` and `operationId` metadata added to constructor and contract object.
- `toOpenAPI()` unchanged for backward compat.

### Task 7 — HTTP Boundary Tests
- `tests/http-boundary.test.js` created with 30 tests.
- Covers: null/undefined/empty inputs, invalid body/params/query/headers, cache behavior, response edge cases, multi-status routing, handler integration, contract shape, and framework neutrality.

### Task 8 — HTTP Examples
- `examples/http-request-contract.js` — updated to structured input shape, adds `toPathItem()`.
- `examples/http-response-contract.js` — updated with multi-status, `parseResponse`, `safeParseResponse`.
- `examples/http-full-route.js` — new: demonstrates all request parts and full OpenAPI projection.

### Task 9 — HTTP Docs
- `docs/projections/http.md` — fully rewritten to cover all new APIs.
- `docs/api.md` — `httpContract` entry rewritten with full signature table.
- `docs/experimental.md` — updated with full method listing.

## Current API surface

```js
httpContract({
  request,       // required
  response,      // required
  responses?,    // { [statusCode]: SigilContract }
  params?,
  query?,
  headers?,
  method?,
  path?,
  summary?,
  operationId?,
})
```

Returned object:

| Method | Status |
|--------|--------|
| `parseRequest(input)` | experimental |
| `safeParseRequest(input)` | experimental |
| `parseResponse(input)` | experimental |
| `safeParseResponse(input)` | experimental |
| `serializeResponse(body)` | experimental |
| `safeSerializeResponse(body)` | experimental |
| `toOpenAPI()` | experimental |
| `toPathItem()` | experimental |
| `handler(fn)` | experimental |

## Test coverage

| File | Tests |
|------|-------|
| `tests/http-contract.test.js` | 32 tests (phases 11, task 4, 5, 6) |
| `tests/http-boundary.test.js` | 30 tests (edge cases, framework neutrality) |

Total: **62 HTTP-specific tests**

## What would justify extraction to `@sigil/http`

- At least one real-world framework adapter pattern is proven (Express, Fastify, or Hono adapter that normalizes req/res into the `{ body, params, query, headers }` shape).
- The `responses` multi-status API has been stable across at least one minor release cycle.
- No breaking changes to the returned object shape are anticipated.
- OpenAPI projection is validated against a real OpenAPI 3.x schema validator.
- User demand for framework-specific sub-packages is confirmed.

## Non-goals (unchanged)

- No framework adapters in core.
- No network calls in tests or examples.
- No query-string parsing or header normalization.
- No package split.

## Remaining experimental gaps

- Route-level metadata (`method`, `path`) is stored but not used for routing or validation.
- Query/params/headers contracts treat all values as-is; string-to-number coercion for real query strings is an application responsibility.
- `toPathItem()` does not yet model OpenAPI `parameters` (path/query/header parameter schemas from `params`/`query`/`headers` contracts).
- `handler()` always calls `serializeResponse` on the primary contract; multi-status handler response routing is not yet implemented.

These gaps are documented here. They do not block the current experimental surface.
