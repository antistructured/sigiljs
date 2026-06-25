# HTTP Public Surface Audit

**Block:** HTTP Experimental Containment + Release Verification  
**Task:** 1 — HTTP Public Surface Audit  
**Package:** `@weipertda/sigiljs`

---

## Export chain

```
src/index.js
  └─ export { httpContract } from './http.js'
```

**`httpContract` is the only HTTP-related named export.**

No other HTTP symbol is exported from `src/index.js`. The methods returned by calling `httpContract()` (`parseRequest`, `safeParseRequest`, `parseResponse`, `safeParseResponse`, `serializeResponse`, `safeSerializeResponse`, `toOpenAPI`, `toPathItem`, `handler`) are properties of the returned object — they are not independently exported and cannot be imported directly. The internal helpers (`assertSigilContract`, `safe`, `openAPIFor`, `normalizeResponseInput`, `responseSchemaEntry`, `statusDescription`) are module-private functions with no export.

---

## What is public

| Symbol | Kind | Exported from | Status |
|--------|------|---------------|--------|
| `httpContract` | function | `src/index.js` | experimental |
| `httpContract(...).parseRequest` | method on returned object | not independently exported | experimental |
| `httpContract(...).safeParseRequest` | method on returned object | not independently exported | experimental |
| `httpContract(...).parseResponse` | method on returned object | not independently exported | experimental |
| `httpContract(...).safeParseResponse` | method on returned object | not independently exported | experimental |
| `httpContract(...).serializeResponse` | method on returned object | not independently exported | experimental |
| `httpContract(...).safeSerializeResponse` | method on returned object | not independently exported | experimental |
| `httpContract(...).toOpenAPI` | method on returned object | not independently exported | experimental |
| `httpContract(...).toPathItem` | method on returned object | not independently exported | experimental |
| `httpContract(...).handler` | method on returned object | not independently exported | experimental |
| `httpContract(...).kind` | string property | not independently exported | experimental |
| `httpContract(...).request` | contract reference | not independently exported | experimental |
| `httpContract(...).response` | contract reference | not independently exported | experimental |
| `httpContract(...).requestParts` | frozen object | not independently exported | experimental |
| `httpContract(...).responses` | object (when provided) | not independently exported | experimental |
| `httpContract(...).method` | string (when provided) | not independently exported | experimental |
| `httpContract(...).path` | string (when provided) | not independently exported | experimental |
| `httpContract(...).summary` | string (when provided) | not independently exported | experimental |
| `httpContract(...).operationId` | string (when provided) | not independently exported | experimental |

---

## What is experimental

All HTTP surface is experimental. No HTTP API is stable.

Explicitly marked experimental in:
- `docs/api.md` — table row and section heading
- `docs/experimental.md` — enumerated method listing
- `docs/projections/http.md` — top-level status notice

---

## What is internal (not exported, not documented as public API)

| Symbol | Location | Description |
|--------|----------|-------------|
| `assertSigilContract` | `src/http.js` (module scope) | Guard that throws if a value is not a Sigil contract |
| `safe` | `src/http.js` (module scope) | Wraps a function call in try/catch, returns `{ success, data/error }` |
| `openAPIFor` | `src/http.js` (module scope) | Builds OpenAPI operation object from a contract |
| `normalizeResponseInput` | `src/http.js` (module scope) | Normalizes flat body or `{ status, body }` input |
| `responseSchemaEntry` | `src/http.js` (module scope) | Builds a single OpenAPI responses map entry |
| `statusDescription` | `src/http.js` (module scope) | Maps numeric status codes to description strings |

---

## What is example-only

The following files demonstrate HTTP boundary usage but are not part of the package API:

| File | Description |
|------|-------------|
| `examples/http-request-contract.js` | Full request contract with `toPathItem`, `toOpenAPI`, `safeParseRequest` |
| `examples/http-response-contract.js` | Multi-status response, `parseResponse`, handler pattern |
| `examples/http-full-route.js` | All request parts (body, params, query, headers), full OpenAPI path item |

These examples import from `../src/index.js` (local source). They are not published separately and are not importable by package consumers.

---

## What is not supported

The following are explicitly out of scope and not implemented:

- Framework-specific adapters (Express, Fastify, Hono)
- Middleware helpers
- Raw query-string parsing
- Header normalization or cookie handling
- Route matching / routing logic
- Multipart / form-data parsing
- WebSocket or streaming boundary contracts
- Server runtime behavior
- `@sigil/http`, `@sigil/core`, or any sub-package

---

## Accidental export check

No accidental exports found.

The only HTTP export is `httpContract` from `src/index.js`. There are no wildcard re-exports (`export * from`) in `src/index.js` that could leak internal helpers. There is no barrel file inside `src/http/` that could accidentally expose method implementations.

Package `exports` field in `package.json` maps only `"."` to the root export. No sub-path exports exist.

---

## Documentation coverage

| Surface | `docs/api.md` | `docs/experimental.md` | `docs/projections/http.md` |
|---------|:---:|:---:|:---:|
| `httpContract()` signature | ✅ | ✅ | ✅ |
| `parseRequest` / `safeParseRequest` | ✅ | ✅ | ✅ |
| `parseResponse` / `safeParseResponse` | ✅ | ✅ | ✅ |
| `serializeResponse` / `safeSerializeResponse` | ✅ | ✅ | ✅ |
| `toOpenAPI` | ✅ | ✅ | ✅ |
| `toPathItem` | ✅ | ✅ | ✅ |
| `handler` | ✅ | ✅ | ✅ |
| `responses` map | ✅ | partial | ✅ |
| `method` / `path` / `summary` / `operationId` | ✅ | partial | ✅ |
| Experimental status notice | ✅ | ✅ | ✅ |

---

## Test coverage

| File | Tests | Scope |
|------|-------|-------|
| `tests/http-contract.test.js` | 32 | Core contract shape, request/response parsing, OpenAPI, toPathItem |
| `tests/http-boundary.test.js` | 30 | Edge cases: null/empty inputs, invalid parts, cache, multi-status, handler, framework neutrality |
| `tests/public-api-surface.test.js` | includes | Asserts `httpContract` exists and is callable |

Total HTTP-specific tests: **62**

---

## README exposure

`README.md` contains one reference to HTTP:

```
- [HTTP Boundary Helpers](docs/projections/http.md)
```

This is a docs link in the documentation index. `httpContract` is not featured in the main README usage section, quick-start, or code examples. This is the correct level of exposure for an experimental API.

---

## Findings

1. **No accidental stable APIs.** All HTTP surface is experimental and clearly labelled.
2. **No accidental exports.** Only `httpContract` is exported; internals are module-private.
3. **No runtime dependencies.** `package.json` has empty `dependencies` object.
4. **No framework coupling.** Implementation operates on plain objects only.
5. **Documentation is consistent.** All three doc surfaces agree on experimental status.
6. **Test coverage is solid.** 62 tests across two focused test files.
7. **Examples are offline.** All three examples import from local source and make no network calls.

---

## Recommendations for remaining tasks

- Task 2: Verify experimental markers are present in all correct locations — no action currently needed based on this audit, but verify the `docs/api.md` import example doesn't use stable-looking import paths.
- Task 3: Check for API consistency issues — the `toOpenAPI()` vs `toPathItem()` distinction and the `summary` field not appearing in `toOpenAPI()` output should be verified against the docs.
- Task 4: Run full test suite with coverage focus on HTTP files.
- Task 5: Docs consistency — ensure `docs/projections/http.md` examples use the correct structured `{ body }` input shape (not the legacy flat body).
- Task 6: README exposure is minimal and appropriate — no change needed.
- Task 7: Release gate — verify 0 test failures, clean lint, no accidental stable promotion.
