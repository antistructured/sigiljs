# HTTP Containment Report

**Block:** HTTP Experimental Containment + Release Verification  
**Package:** `@weipertda/sigiljs`  
**Report date:** 2025

---

## Summary

The HTTP boundary surface is contained, verified, and safe to ship as experimental.

No accidental stable promotions. No framework coupling. No runtime dependencies. No unexpected exports. Documentation is consistent. Tests pass.

**Decision: HTTP surface is release-ready as experimental.**

---

## Task results

### Task 1 — HTTP Public Surface Audit ✅

Audit created at `docs/internal/http-public-surface-audit.md`.

Findings:
- Only one HTTP export: `httpContract` from `src/index.js`
- All returned-object methods are object properties, not independent exports
- All internal helpers are module-private (`assertSigilContract`, `safe`, `openAPIFor`, etc.)
- No accidental exports found
- No framework dependencies
- Package `exports` field maps only `"."` — no sub-path HTTP exports

### Task 2 — Experimental Status Enforcement ✅

All experimental markers are in place:
- `docs/api.md`: `**Status:** experimental` heading + table row
- `docs/experimental.md`: full method listing with experimental notice
- `docs/projections/http.md`: `**Status: Experimental. May change before 1.0.0.**` at top
- `src/http.js`: `@experimental` JSDoc tag added to the exported function

No HTTP API is marked stable. No HTTP API is on the stable import path.

### Task 3 — HTTP API Consistency Review ✅

Issues found and fixed:
- `docs/projections/http.md` line 202: clarified the `toPathItem()` fallback behavior when method/path are absent (exact wording corrected)
- `docs/projections/http.md` Non-goals: added note that `handler()` serializes via primary `response` contract, not the `responses` map
- `docs/projections/http.md` `requestParts` section: clarified that `body` is always present; `params`/`query`/`headers` are conditional
- `docs/internal/http-contract-stabilization-decision.md`: addendum added documenting the API expansion from the subsequent block

No behavioral inconsistencies found in the implementation.

### Task 4 — HTTP Test Integrity Review ✅

Tests verified:
- 62 HTTP tests across 2 files: `tests/http-contract.test.js` (32), `tests/http-boundary.test.js` (30)
- No duplicate `describe` blocks
- No stale test assertions
- All tests exercise real implementation via Bun test runner
- `parseRequest.length === 0` still holds (default param)
- `safeParseRequest.length === 1` and `serializeResponse.length === 1` verified

Minor observation: The first describe block in `tests/http-contract.test.js` is named `'Phase 11 Request Boundary Helpers'` — a legacy name from an earlier block. Not a bug; left as-is to avoid unnecessary churn.

### Task 5 — HTTP Docs Consistency Review ✅

Issues found and fixed:
- Public docs (`docs/projections/http.md`, `docs/api.md`, `docs/experimental.md`) all use structured `{ body, params, query, headers }` input shape correctly
- No stale `parseRequest(body)` flat-input pattern in public docs
- No references to hypothetical future packages (`@sigil/http`, `@sigil/http/express`) in public docs
- Internal docs reference `@sigil/http` only in the extraction readiness report (correctly framed as hypothetical)
- `docs/internal/http-contract-stabilization-decision.md` updated with addendum

### Task 6 — README Exposure Check ✅

README HTTP exposure is correct and minimal:
- One docs link: `[HTTP Boundary Helpers](docs/projections/http.md)` in the documentation index
- Not in the main usage section, quickstart, or feature highlights
- No `httpContract` code examples in README body

Cleanup applied: removed two pre-existing duplicate docs links (duplicate `[AI Structured Output Contracts]` and duplicate `[Boundary Contract Recipes]`).

### Task 7 — Release Gate Verification ✅

| Gate | Result |
|------|--------|
| `bun test` | 413 pass, 0 fail |
| `bun run lint` | exit 0 (clean) |
| HTTP tests | 62 pass, 0 fail |
| Runtime exports audit | `httpContract` only; no leaked internals |
| Stable surface unchanged | Confirmed — no HTTP API promoted to stable |
| Runtime dependencies | 0 |
| Framework coupling | None |

---

## Current HTTP API surface (final state)

```js
// Only top-level export
import { httpContract } from '@weipertda/sigiljs';

// All options are passed to httpContract()
const route = httpContract({
  request,       // SigilContract — required
  response,      // SigilContract — required
  responses?,    // { [statusCode]: SigilContract }
  params?,       // SigilContract
  query?,        // SigilContract
  headers?,      // SigilContract
  method?,       // string
  path?,         // string
  summary?,      // string
  operationId?,  // string
});

// Methods on the returned object
route.parseRequest(input)         // throws
route.safeParseRequest(input)     // { success, data } | { success, error }
route.parseResponse(input)        // { status, body } — throws
route.safeParseResponse(input)    // { success, data } | { success, error }
route.serializeResponse(body)     // throws
route.safeSerializeResponse(body) // { success, data } | { success, error }
route.toOpenAPI()                 // operation-level OpenAPI shape
route.toPathItem()                // path item OpenAPI shape
route.handler(fn)                 // framework-neutral handler wrapper

// Properties
route.kind          // 'sigil.httpContract'
route.request       // SigilContract
route.response      // SigilContract
route.requestParts  // frozen object
route.responses?    // { [statusCode]: SigilContract }
route.method?       // string
route.path?         // string
route.summary?      // string
route.operationId?  // string
```

**All of the above is experimental. None is stable.**

---

## Known gaps (documented, not blocking)

1. `handler()` does not route response serialization through the `responses` map — it always uses the primary `response` contract. Documented in `docs/projections/http.md` Non-goals.
2. `toPathItem()` does not emit OpenAPI `parameters` for `params`/`query`/`headers` contracts. Documented in extraction readiness report.
3. Multi-status `handler()` response routing is not implemented — callers who need status-aware handler behavior should call `parseResponse` manually.
4. `requestParts` includes `body` unconditionally — the `?` on `body` in the type notation is inaccurate.

These gaps do not block the experimental release. They are documented and will be addressed if/when the API moves toward stabilization.

---

## Files modified in this block

| File | Change |
|------|--------|
| `docs/internal/http-public-surface-audit.md` | Created — Task 1 audit |
| `src/http.js` | Added `@experimental` JSDoc tag |
| `docs/projections/http.md` | Clarified `toPathItem` fallback, `requestParts`, Non-goals |
| `docs/internal/http-contract-stabilization-decision.md` | Added addendum for API expansion |
| `README.md` | Removed two duplicate docs links |
| `docs/internal/http-containment-report.md` | Created — this report |
