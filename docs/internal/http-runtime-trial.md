# HTTP Runtime Trial

**Block:** Real-World Usage Trial  
**Pass:** 6 — HTTP Runtime Trial  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Trial Files

- `trials/http-runtime/create-user-route.js`
- `trials/http-runtime/update-user-route.js`
- `trials/http-runtime/README.md`

---

## Commands Run

```bash
bun run trials/http-runtime/create-user-route.js
bun run trials/http-runtime/update-user-route.js
```

Result: **pass**

---

## Coverage

The trial exercised stable direct contract usage:

- request body `safeParse()`
- response body `parse()`
- error response contract validation
- OpenAPI projection from contracts

The trial also exercised experimental `httpContract()` usage:

- `parseRequest()`
- `safeParseRequest()`
- `parseResponse()`
- `safeParseResponse()`
- `toOpenAPI()`
- `toPathItem()`
- multi-status `responses` map
- params/query/headers/body request parts

---

## Findings

### What Felt Good

- Direct stable contract usage is enough for simple route handlers.
- `safeParse()` for request bodies and `parse()` for response bodies produces an understandable framework-neutral pattern.
- `httpContract()` is useful when a route has params/query/headers/body and multiple response statuses.
- `responses` maps make error response validation clearer than ad hoc response parsing.
- OpenAPI projection is useful for route documentation.

### Friction

- `toPathItem()` output was surprising in the trial: it returns a path-keyed object rather than a direct `{ post: ... }` path-item shape. The name may be misleading, or docs need to clarify the returned shape.
- `httpContract()` skips missing request parts, so requiredness of `params`, `query`, and `headers` is not obvious from helper behavior alone.
- Error aggregation for invalid request parts is useful, but nested errors require application code to inspect `error.parts`.
- Direct stable contracts were sufficient for the simplest route, so `httpContract()` still feels like an optional experimental convenience rather than required core API.
- `docs/projections/http.md` appears to contain corrupted/redacted snippets in the request-parts example and should be fixed in the docs gap pass.

---

## Blocker Assessment

No stable-core blocker found.

`httpContract()` should remain experimental. Before stabilization, it needs clearer semantics for missing request parts, `toPathItem()` shape, and framework adapter expectations.
