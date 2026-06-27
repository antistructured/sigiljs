# Real-World Usage Trial Report

**Block:** Real-World Usage Trial  
**Pass:** 12 — Usage Trial Report  
**Package:** `@weipertda/sigiljs`  
**Current version:** `0.16.0`  
**Suggested target:** `0.17.0`  
**Release theme:** Real-world usage trial

---

## 1. Current Package Name

```txt
@weipertda/sigiljs
```

No package rename occurred.

---

## 2. Current Version

```txt
0.16.0
```

The suggested next target remains `0.17.0` for the usage-trial release theme.

---

## 3. Trial Workspaces Created

```txt
trials/
├── stable-core/
├── typescript-consumer/
├── cli-workflow/
├── http-runtime/
├── form-constraints/
├── database-boundary/
└── ai-output/
```

Trial workspaces are kept because they are reusable runnable validation artifacts.

---

## 4. Stable Core Ergonomics Status

Status: **pass**

Stable APIs exercised without needing experimental APIs:

- `sigil.exact()`
- `optional()`
- `union()`
- `oneOf()`
- `realType()`
- `parse()`
- `safeParse()`
- `assert()`
- `check()`
- `describe()`
- `toJSONSchema()`
- `toTypeScript()`
- `toOpenAPI()`
- `mock()`
- `cases()`
- `test()`
- `diff()`

Finding: stable core feels ready for broader real-world usage.

---

## 5. TypeScript Consumer Status

Status: **pass**

`bun run check:types` includes the TypeScript trial files.

Findings:

- explicit generics are usable
- `safeParse()` narrowing works
- conservative inference is acceptable if documented clearly
- more TypeScript examples are needed before 1.0

---

## 6. CLI Workflow Status

Status: **pass, experimental**

Trial exercised:

- `.sigil.js` loading
- `.sigil` text loading smoke under Bun
- `describe`
- `json-schema`
- `types`
- `openapi`
- `form`
- `check`
- `parse`
- `safe-parse`
- `mock`
- `cases`
- `test`
- `diff`
- `--export`
- `--out`

Finding: CLI is useful but should remain experimental pending output/exit/CWD/`.sigil` compatibility policy.

---

## 7. HTTP Runtime Status

Status: **pass, experimental helper retained**

Findings:

- direct stable contract usage is enough for simple route handlers
- `httpContract()` helps with request parts, status maps, and OpenAPI projection
- `toPathItem()` shape and missing request-part behavior need clearer stabilization decisions

Recommendation: keep `httpContract()` experimental.

---

## 8. Form Constraint Status

Status: **pass, experimental projection retained**

Findings:

- `safeParse()` and path-aware errors map naturally to form handling
- `toFormConstraints()` is useful for fields/options/paths
- UI-specific metadata and flattening remain adapter/application concerns

Recommendation: keep `toFormConstraints()` experimental.

---

## 9. Database Boundary Status

Status: **pass**

Findings:

- direct contracts are enough for read/write boundaries
- app ownership of IDs, timestamps, uniqueness, persistence, and partial-update business rules is clear
- no `dbContract()` helper is needed

Recommendation: keep database helpers deferred.

---

## 10. AI Output Status

Status: **pass**

Findings:

- `toJSONSchema()` + `safeParse()` is sufficient for provider-neutral structured-output validation
- provider SDK helpers remain unnecessary
- repair loops should stay application-owned

Recommendation: keep AI provider helpers deferred.

---

## 11. Friction Summary

High-priority friction:

1. Improve `diff()` interpretation docs.
2. Improve TypeScript explicit-generic docs.
3. Define CLI compatibility policy before stable CLI.
4. Clarify HTTP `toPathItem()` shape and missing request-part semantics.
5. Keep form constraints experimental pending UI adapter evidence.

No stable-core blocker was found.

---

## 12. Docs / Recipes Gap Summary

Small fixes applied:

- fixed corrupted HTTP header examples in `docs/projections/http.md`
- fixed matching HTTP example in `docs/api.md`

Future docs work:

- TypeScript consumer guide
- `diff()` interpretation guide
- CLI compatibility caveats
- HTTP `toPathItem()` explanation
- form adapter expectations
- AI repair-loop recipe language

---

## 13. 1.0 Readiness Impact

Positive impact:

- stable core passed realistic usage trials
- TypeScript declarations are usable in consumer-shaped code
- database and AI helper deferrals are validated by usage evidence

Remaining before 1.0:

- final `compile()` posture
- final CLI compatibility policy if CLI is included in 1.0 guarantees
- continued experimental status for HTTP and form helpers unless deeper field trials justify stabilization
- docs improvements for TypeScript and `diff()` ergonomics

---

## 14. Recommendation

Stable core is ready for broader real-world usage, but do not cut `1.0.0` yet.

Keep CLI, HTTP helpers, and form constraints experimental.

Proceed next to **Ergonomics Fix Pack** because the main findings are docs/examples/API-clarity work rather than new features.

---

## Package Split Confirmation

No package split occurred.

No `@sigil/*` packages were created.

---

## Runtime Dependency Confirmation

No runtime dependencies were added to SigilJS.

---

## Experimental API Confirmation

Experimental APIs remain experimental:

- `sigil` CLI
- `.sigil` text loading
- `httpContract()`
- `toFormConstraints()`
