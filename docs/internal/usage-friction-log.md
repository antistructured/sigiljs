# Usage Friction Log

**Block:** Real-World Usage Trial  
**Pass:** 10 — Friction Log + API Ergonomics Review  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Stable Core Friction

| Finding | Classification | Notes |
|--------|----------------|-------|
| `diff()` output is useful but not immediately self-explanatory in app logs or migration reviews. | should fix before 1.0 | Improve docs/examples; no API change required yet. |
| `mock()` is structural, not semantic. | can defer | Already documented; keep limitation prominent. |
| Users need guidance on generated TypeScript declarations vs `index.d.ts` generics. | should fix before 1.0 | Docs/examples issue. |

---

## TypeScript Friction

| Finding | Classification | Notes |
|--------|----------------|-------|
| No deep inference without explicit generics. | can defer | Acceptable if docs show `sigil<T>()` clearly. |
| Projection return types are broad `Record<string, unknown>`. | can defer | Conservative but usable. |
| More real TS examples are needed. | should fix before 1.0 | Docs/examples issue, not source rewrite. |

---

## CLI Friction

| Finding | Classification | Notes |
|--------|----------------|-------|
| No `project <target>` command; actual commands are `json-schema`, `types`, `openapi`, `form`. | should fix before 1.0 | Ensure all docs use actual command names. |
| `.sigil` text loading is Bun-specific. | keep experimental | Use `.sigil.js` as recommended workaround. |
| CWD-relative `.sigil.js` loading can surprise users. | keep experimental | Needs compatibility policy before stabilization. |
| CLI output shapes and exit codes are not frozen. | blocker before 1.0 | Must define compatibility policy before stable CLI. |
| `diff` CLI output needs examples. | should fix before 1.0 | Docs improvement. |

---

## HTTP Friction

| Finding | Classification | Notes |
|--------|----------------|-------|
| `toPathItem()` name is misleading because output is path-keyed, not direct method-keyed path item. | keep experimental | Clarify docs or consider API naming before stabilization. |
| Missing request parts are skipped by `httpContract()`. | keep experimental | Semantics need clarity before stabilization. |
| Aggregated request-part errors require app inspection of `error.parts`. | needs real-world user feedback | May be sufficient; needs framework usage. |
| Direct stable contracts are enough for simple routes. | do not fix yet | Evidence against adding more helpers. |
| `docs/projections/http.md` has corrupted example snippets. | should fix before 1.0 | Patch docs in Pass 11. |

---

## Form Friction

| Finding | Classification | Notes |
|--------|----------------|-------|
| Constraint metadata lacks UI semantics like widgets, help text, formats, min/max, and custom messages. | keep experimental | Application/UI adapter concern. |
| Nested constraints require app-level flattening. | needs real-world user feedback | Needs framework adapter evidence. |
| `mock()` values are not realistic for form previews. | can defer | Existing structural mock limitation. |

---

## Database Friction

| Finding | Classification | Notes |
|--------|----------------|-------|
| Cannot express "at least one optional update field". | can defer | Known limitation; application logic owns it. |
| Date/time semantics are string-level. | can defer | Avoid adding semantic validators in this block. |
| `diff()` needs docs for migration-style review. | should fix before 1.0 | Docs/example improvement. |

---

## AI Friction

| Finding | Classification | Notes |
|--------|----------------|-------|
| Provider-specific JSON Schema dialects are not normalized. | can defer | Adapter concern; no provider helpers now. |
| Repair-loop policy is application-owned. | do not fix yet | Avoid prompt/retry framework in core. |
| Numeric semantics like confidence `0..1` are not encoded. | can defer | Future semantic constraint topic, not 1.0 blocker. |

---

## Docs Friction

| Finding | Classification | Notes |
|--------|----------------|-------|
| HTTP docs contain corrupted request-parts snippet. | should fix before 1.0 | Patch immediately. |
| Need more TS generic examples. | should fix before 1.0 | Add docs or recipes later. |
| Need clearer `diff()` interpretation docs. | should fix before 1.0 | Stable-core docs gap. |
| Need CLI caveat consistency. | should fix before 1.0 | Especially command names and `.sigil.js` recommendation. |

---

## High-Priority Changes

1. Fix corrupted HTTP docs snippet.
2. Clarify `toPathItem()` returned shape in docs.
3. Add or improve docs explaining `diff()` direction/output.
4. Add clearer TypeScript explicit-generic examples.
5. Keep CLI caveats consistent and avoid non-existent `project` subcommand language.

---

## Low-Priority Changes

1. Consider richer projection types later.
2. Consider optional semantic mock generation later.
3. Consider UI adapter guidance after real framework trials.
4. Consider provider-specific AI adapter packages only if usage justifies them.

---

## Do Not Fix Yet

- Do not add `dbContract()`.
- Do not add `aiContract()`.
- Do not add provider SDK helpers.
- Do not add UI framework adapters.
- Do not add HTTP framework middleware.
- Do not add package splits.
- Do not stabilize CLI, HTTP helpers, or form constraints in this block.

---

## Evidence Needed

Before 1.0:

- final `compile()` public posture review
- stable CLI compatibility policy if CLI is included in 1.0 guarantees
- deeper framework-neutral or framework-specific HTTP usage evidence
- UI/form adapter evidence for `toFormConstraints()`
- user feedback on TypeScript explicit-generic ergonomics

---

## Summary

The stable core has no usage-trial blocker. Most friction is documentation, examples, or experimental-surface compatibility policy.

Recommended next block: **Ergonomics Fix Pack**, focused on docs/examples and small clarity fixes, not new features.
