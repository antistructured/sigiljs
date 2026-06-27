# Pre-1.0 Deprecation / Internalization Plan

**Package:** `@weipertda/sigiljs` v0.13.0  
**Pass:** 8 — Deprecation / Internalization Plan

---

## Purpose

Identify public, legacy, experimental, and accidental surfaces that need a keep/deprecate/remove/internalize decision before a future 1.0.

No APIs are removed in this pass.

---

## Classification Summary

| Surface | Current exposure | Classification | Recommendation |
|---------|------------------|----------------|----------------|
| `sigil` | public export | keep stable | make primary 1.0 object API |
| `sigil.exact` | public attached helper | keep stable | make primary strict object API |
| `Sigil` | public export | keep stable or document as supported legacy style | keep supported; prefer `sigil()` in docs |
| `S` | public alias | document as legacy / deprecation candidate | deprecate before 1.0 or keep legacy-only with clear docs |
| `T` | public alias | document as legacy / deprecation candidate | deprecate before 1.0 or keep legacy-only with clear docs |
| `real` | public alias | deprecation candidate | deprecate before 1.0 or remove before 1.0 if safe |
| `Real` | public alias | deprecation candidate | deprecate before 1.0 or remove before 1.0 if safe |
| `httpContract` | public export | keep experimental | do not stabilize before real-world usage |
| `toFormConstraints` | public contract method | keep experimental | do not stabilize before real UI/form usage |
| `sigil` CLI bin | package bin | keep experimental | keep exposed; do not stabilize yet |
| `.sigil` text format | CLI input | keep experimental | define compatibility policy before stabilization |
| `.sigil.js` module format | CLI input | keep experimental | document CWD-relative loading and `--export` behavior |
| internal projection helpers | source-only | keep internal only | never export from package root |
| internal parser/core helpers | source-only | keep internal only | never export from package root |
| internal testing helpers | source-only | keep internal only | do not promote as package API |
| runtime contract properties (`ast`, `raw`, `source`, `normalized`, `options`, `validator`) | object properties | keep internal only | do not document or type as stable public API |

---

## Deprecation Candidates

### `S` and `T`

Current state:

- Runtime aliases of `Sigil`.
- Covered by public surface tests.
- Declared as deprecated in `index.d.ts`.
- Public API docs call them legacy aliases.

Recommendation:

- Do not use in new docs or examples.
- Before 1.0, choose one:
  - keep as documented legacy aliases indefinitely, or
  - formally deprecate in docs and remove before 1.0 if compatibility risk is acceptable.

Conservative path:

- Keep aliases through 1.0 as legacy-only unless there is evidence they confuse users.

### `real` and `Real`

Current state:

- Runtime aliases of `realType`.
- Declared as deprecated in `index.d.ts`.
- Less visible in public docs than `S`/`T`.

Recommendation:

- Prefer `realType` exclusively in docs and examples.
- Decide before 1.0 whether to keep aliases as legacy-only or remove them before the stable line.

Conservative path:

- Keep aliases typed as deprecated for 0.x; remove only if a breaking cleanup release is intentionally planned before 1.0.

---

## Internalization Candidates

### Runtime contract internals

The following object properties should remain internal-only despite being visible at runtime:

- `ast`
- `raw`
- `source`
- `normalized`
- `options`
- `validator`

Plan:

- Do not add these to `SigilContract<T>`.
- Do not document them in public docs.
- If possible in a future hardening block, consider hiding or symbolizing internals before 1.0 — but only if it is low-risk.

### Projection internals

Keep these internal:

- JSON Schema projection implementation functions
- TypeScript projection implementation functions
- OpenAPI projection implementation functions
- form constraint projection implementation functions
- mock/cases projection helpers

Plan:

- Public access remains through contract methods only.
- No root exports for projection helper functions before 1.0.

### Parser / validation internals

Keep these internal:

- tokenization
- normalization
- registry/cache internals
- validation primitives
- parser AST helpers

Plan:

- Public access remains through contract constructors and contract instance methods.

---

## Keep Experimental

### `httpContract`

Keep exported but experimental.

Do not deprecate unless real-world usage shows the model is wrong. Do not stabilize until adapter usage proves it.

### `toFormConstraints`

Keep public as experimental.

Do not deprecate unless UI consumers show the shape is wrong or too framework-specific.

### CLI commands and file formats

Keep exposed as experimental.

Do not stabilize command names, output shapes, or `.sigil` file syntax before real usage.

---

## Keep Stable / Stable Candidate

Stable core candidates to keep:

- `sigil`
- `sigil.exact`
- `optional`
- `union`
- `oneOf`
- `pipe`
- `trim`
- `realType`
- `SigilValidationError`
- enforcement methods
- core projections
- structural Prove helpers
- lifecycle diffing

---

## Needs Decision Before 1.0

1. Whether `Sigil` is described as stable alternative syntax or legacy-but-supported syntax.
2. Whether `S` and `T` remain legacy aliases or are removed before 1.0.
3. Whether `real` and `Real` remain legacy aliases or are removed before 1.0.
4. Whether runtime contract internals should remain enumerable object properties.
5. Whether `compile()` is stable public API or advanced/low-level API.
6. Whether CLI remains exposed in the core package during 1.0 or is hidden/deferred.

---

## Non-actions In This Block

- No APIs removed.
- No aliases removed.
- No internal properties hidden.
- No package split.
- No runtime dependencies added.
