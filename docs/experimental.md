# Experimental APIs

This page lists APIs in `@weipertda/sigiljs` that are currently experimental.

Experimental APIs are intentionally exported and tested, but their surface may change before 1.0.0.  
Do not rely on them for long-term stability unless you are prepared to update with minor releases.

**Current experimental APIs (0.4.0):**

- `httpContract({ request, response, responses?, params?, query?, headers?, method?, path?, summary?, operationId? })` — framework-neutral HTTP boundary helper
  - `parseRequest({ body?, params?, query?, headers? })` — validates each request part
  - `safeParseRequest(input)` — non-throwing variant
  - `parseResponse({ status, body } | body)` — validates response body with status routing
  - `safeParseResponse(input)` — non-throwing variant
  - `serializeResponse(body)` / `safeSerializeResponse(body)` — serializes response
  - `toOpenAPI()` — returns operation-level shape (requestBody + responses)
  - `toPathItem()` — returns OpenAPI path item shape keyed by path and method
  - `handler(fn)` — framework-neutral handler wrapper
- `contract.toFormConstraints()` — basic form metadata projection
- **`sigil` CLI** — Bun-native, dependency-free CLI for contract workflows
  - `check` / `parse` / `safe-parse` — validate JSON against a contract
  - `describe` / `json-schema` / `types` / `openapi` / `form` — projection commands
  - `mock` / `cases` / `test` — Prove pillar commands
  - `diff` — compare two contract files
  - Supports `.sigil` text files and `.sigil.js` JS module files
  - `--export <name>` for named exports, `--out <path>` for file output

These APIs are documented in:
- `docs/projections/http.md`
- `docs/projections/forms.md`
- `docs/api.md`

Stable APIs are documented in:
- `docs/api.md`
- `docs/sigils.md`
- `docs/projections.md`
