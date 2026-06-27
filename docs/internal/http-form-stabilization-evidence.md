# HTTP / Form Stabilization Evidence

**Block:** Ergonomics Fix Pack  
**Pass:** 6 — HTTP / Form Evidence Notes  
**Package:** `@weipertda/sigiljs`  
**Observed version:** `0.16.0`

---

## Decision

Both surfaces remain experimental:

- `httpContract()` remains experimental.
- `contract.toFormConstraints()` remains experimental.

This pass documents the evidence needed before either surface can be considered for stabilization. It does not add framework adapters, UI adapters, projection targets, or new API behavior.

---

## `httpContract()`

### Current value

`httpContract()` is useful when a route needs more structure than direct body parsing:

- body/params/query/headers request-part validation
- multi-status response validation through `responses`
- framework-neutral handler wrapping
- OpenAPI operation projection
- path-keyed OpenAPI shape through `toPathItem()`

Real-world usage trial evidence showed direct stable contracts are sufficient for simple handlers, while `httpContract()` is useful for more complex route boundaries.

### Known friction

Evidence-backed friction from the HTTP runtime trial:

- `toPathItem()` can surprise users because it returns a path-keyed object when `method` and `path` exist.
- missing request parts are skipped, which is useful for partial route inputs but makes requiredness expectations less obvious.
- aggregated request-part errors require application code to inspect `error.parts`.
- direct stable contracts are enough for simple route handlers, so `httpContract()` is optional convenience rather than required stable core.

### Missing real-world evidence

Before stabilization, SigilJS needs field evidence for:

- route handlers with params/query/headers/body in real services
- multi-status response validation in real route code
- whether skipping missing request parts is intuitive enough to freeze
- whether `error.parts` is enough for framework error handling
- whether users expect `toPathItem()` to return a direct method-keyed path item or the current path-keyed object
- whether `handler(fn)` should remain core or stay experimental until adapter packages exist

### Framework/runtime evidence needed

Minimum useful evidence should include at least:

- one Bun-native HTTP workflow
- one Node-compatible framework workflow represented through plain objects
- one route with params/query/headers/body
- one route with multiple status responses
- one error-handling path that reports aggregated request-part errors
- one OpenAPI path assembly workflow using `toOpenAPI()` and `toPathItem()`

No framework dependency should be added to core for this evidence.

### Minimum stabilization criteria

Before stabilizing `httpContract()`, decide and document:

- final `parseRequest()` missing-part semantics
- final `safeParseRequest()` error shape for multi-part failures
- final `parseResponse()` flat-body backward-compat posture
- final `toOpenAPI()` vs `toPathItem()` return-shape contract
- final `handler(fn)` response-routing limitation
- command/docs examples using real framework-normalized input
- TypeScript declaration posture for request/response helpers

### Reasons to keep experimental

- helper behavior is useful but not necessary for stable core adoption
- framework adapter expectations are not proven
- `toPathItem()` naming/shape still needs user feedback
- request-part missingness semantics could still change before 1.0

---

## `toFormConstraints()`

### Current value

`toFormConstraints()` projects object contracts into plain field metadata:

- `fields` map
- field `name`
- path arrays
- `required` flags
- generic field `type`
- labels derived from field keys
- literal-union options
- nested object and array metadata

The form trial showed `safeParse()` plus field paths maps naturally to form submission handling.

### Known friction

Evidence-backed friction from the form constraint trial:

- current metadata is useful but intentionally minimal
- UI adapters still need widgets, help text, autocomplete, semantic formats, min/max rules, and custom messages
- nested field flattening is application-owned
- field-level validation messages are not projected into constraints
- `mock()` output is structural and not realistic enough for form previews

### Missing field metadata evidence

Before stabilization, SigilJS needs evidence for:

- whether `{ fields }` remains the right top-level shape
- whether labels should be metadata-driven or key-derived only
- whether semantic formats belong in core or app metadata
- whether min/max/length/custom messages should be projected
- whether nested fields should remain nested or expose a flattened index
- whether array item constraints need richer shape for UI rendering

### UI adapter evidence needed

Minimum useful evidence should include at least:

- one framework-free form renderer using the current constraints
- one adapter-shaped example for a real UI framework without adding it to core
- nested object fields rendered and submitted back through `safeParse()`
- literal-union select fields rendered and validated
- failure mapping from `safeParse()` errors back to UI fields
- user/app metadata merged with projected constraints outside core

### Minimum stabilization criteria

Before stabilizing `toFormConstraints()`, decide and document:

- final `{ fields }` wrapper shape
- final nested object/array representation
- final label derivation/metadata override policy
- final semantics for options and mixed unions
- whether validation messages are projected or application-owned
- how custom UI metadata should compose with SigilJS output

### Reasons to keep experimental

- useful projection, but adapter needs differ sharply by UI framework
- current metadata is intentionally structural, not semantic
- no real UI adapter evidence exists yet
- adding UI semantics prematurely would expand the public API surface

---

## Non-Goals

This pass does not:

- stabilize `httpContract()`
- stabilize `toFormConstraints()`
- add HTTP middleware
- add form component adapters
- add metadata APIs
- add semantic validation constraints
- add runtime dependencies
- split packages

---

## Recommendation

Keep both HTTP and form surfaces experimental.

Proceed with either:

- a public 0.x release that clearly labels them experimental, or
- a later Experimental Surface Field Trial focused on HTTP/form evidence.
