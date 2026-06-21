# Internal: httpContract Boundary Review

Review date: 2026-06-20
Package: `@weipertda/sigiljs` 0.4.0

## Findings

| Question | Answer |
|---|---|
| Is `httpContract()` exported? | Yes. Exported from `src/index.js` via `src/http.js`. |
| Is it documented? | Yes. `docs/projections/http.md` and `docs/api.md`. |
| Does it have tests? | Yes. `tests/http-contract.test.js` (6 tests). |
| Does it depend on any framework? | No. Explicitly framework-neutral. |
| Does it support request contracts? | Yes. `request` field required. |
| Does it support response contracts? | Yes. `response` field required. |
| Does it use `parse`/`safeParse`/`assert` internally? | Yes. Uses `request.parse()`, `request.safeParse()`, `response.serialize()`. |
| Is its output shape stable? | Yes. Object shape is frozen and verified in tests: `kind`, `request`, `response`, `parseRequest`, `safeParseRequest`, `serializeResponse`, `safeSerializeResponse`, `toOpenAPI()`, `handler()`. |

## Decision

**Status: Experimental (0.4.0)**

Rationale:
- `httpContract()` is intentionally exported and tested.
- It has no framework dependencies and cleanly wraps existing contract methods.
- Its output shape is stable and deterministic.

However, the extraction readiness report classified this as Blocker D: "httpContract() is present, but it has not been validated as a stable public boundary."

For 0.4.0, the conservative choice is to keep it **experimental** rather than promote it to stable. This preserves API flexibility while still making the helper available to users.

## Boundary contract

Inputs:
- `request`: Sigil contract object (required, must have `kind`, `parse`, `safeParse`, `toOpenAPI`)
- `response`: Sigil contract object (required, must have `kind`, `parse`, `safeParse`, `toOpenAPI`)

Output:
- frozen object with `kind: 'sigil.httpContract'`
- `parseRequest(body)` → validates request body, throws `SigilValidationError` on invalid input
- `safeParseRequest(body)` → validates request body, returns `{ success, data? | error? }`
- `serializeResponse(body)` → validates response body, throws `SigilValidationError` on invalid input
- `safeSerializeResponse(body)` → validates response body, returns `{ success, data? | error? }`
- `toOpenAPI()` → returns OpenAPI-like operation schema
- `handler(fn)` → async wrapper: `parseRequest` → `fn` → `serializeResponse`

Error behavior:
- Invalid request/response contracts throw at construction time: `'httpContract request must be a Sigil contract'` or `'httpContract response must be a Sigil contract'`
- Invalid input data throws `SigilValidationError` via the underlying contract methods

## Future extraction

`@sigil/http` is listed as a future package boundary in `docs/projections.md` and `docs/projections/http.md`.

This is explicitly **not** current packaging. The helper lives in `@weipertda/sigiljs` core while the API stabilizes.

If `httpContract()` is promoted to stable in a future release, extraction to `@sigil/http` can be evaluated at that time with real usage data.

## README impact

`README.md` does not feature `httpContract()` in the primary code examples. It appears only in `docs/examples.md` as a secondary example reference. No change needed to keep it off the hero path.
