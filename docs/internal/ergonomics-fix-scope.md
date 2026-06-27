# Ergonomics Fix Scope

**Block:** Ergonomics Fix Pack  
**Pass:** 1 — Ergonomics Fix Scope Audit  
**Package:** `@weipertda/sigiljs`  
**Observed version:** `0.16.0`  
**Suggested target:** `0.18.0`  
**Theme:** evidence-backed ergonomics and documentation polish

---

## Goal

Apply only the rough-edge fixes proven by the Real-World Usage Trial.

This block is not a feature expansion block. It should improve posture, policy, docs, examples, and narrow regression/type alignment without expanding the public API surface.

Core rule:

```txt
Fix the rough edges proven by usage. Do not invent new ones.
```

---

## Evidence Sources

This scope is bounded by findings from:

- `docs/internal/usage-friction-log.md`
- `docs/internal/real-world-usage-trial-report.md`
- `docs/internal/docs-recipes-gap-review.md`
- `docs/internal/pre-1.0-change-list.md`
- `docs/known-limitations.md`
- `docs/stability.md`
- `README.md`
- `package.json`

---

## In-Scope Friction Items

### Stable core docs/examples

- Clarify `compile()` public posture before 1.0.
- Improve TypeScript generic usage docs/examples:
  - `sigil<T>()`
  - `sigil.exact<T>()`
  - `safeParse()` narrowing
  - `parse()` return type
  - `mock()` return type
  - `cases()` result shape
  - projection return types
  - conservative inference limits
- Improve `diff()` docs/examples:
  - `A.diff(B)` direction
  - added/removed/changed fields
  - migration review usage
  - API contract review usage
  - known limitations

### Experimental-surface policy/docs

- Document CLI compatibility policy while keeping CLI experimental.
- Clarify `.sigil.js` as the preferred practical CLI contract format.
- Clarify `.sigil` text-format limitations.
- Clarify CLI command/output/exit-code compatibility posture before 1.0.
- Document HTTP/form evidence still needed before stabilization.
- Clarify `httpContract()` remains experimental.
- Clarify `toFormConstraints()` remains experimental.

### Docs/examples consistency

- Fix stale or misleading docs discovered during the Real-World Usage Trial.
- Ensure public docs use actual CLI commands (`json-schema`, `types`, `openapi`, `form`) rather than a non-existent `project` command.
- Ensure public docs do not imply nonexistent packages or helpers.
- Keep README concise and not overloaded.

---

## Out-of-Scope Items

The following are explicitly out of scope for this block:

- New `compile()` implementation.
- Deep TypeScript inference.
- Source conversion to TypeScript.
- New public APIs.
- New projection targets.
- New CLI commands.
- HTTP framework adapters.
- Form UI adapters.
- Database helpers such as `dbContract()`.
- AI helpers such as `aiContract()` or provider SDK adapters.
- Package extraction / package split.
- 1.0 release.
- Stabilizing CLI, `httpContract()`, or `toFormConstraints()`.

---

## Stable-Core Fixes Allowed

Allowed stable-core work is documentation and regression-alignment only:

- explain existing `compile()` posture
- document existing TypeScript declaration behavior
- document existing `diff()` behavior
- add or update type smoke tests if examples need protection
- add or update narrow regression tests only if documented behavior lacks coverage

No stable-core runtime behavior should change unless a clear bug is discovered during verification.

---

## Experimental-Surface Fixes Allowed

Allowed experimental-surface work:

- document CLI compatibility policy
- clarify `.sigil.js` and `.sigil` support expectations
- clarify output/exit/CWD compatibility caveats
- document evidence needed for HTTP/form stabilization
- patch public docs if wording overpromotes experimental APIs

Not allowed:

- stabilization claims
- new commands
- adapters
- shape changes
- new helper packages

---

## Docs/Examples Fixes Allowed

Allowed docs/examples work:

- `docs/typescript.md` or equivalent TypeScript guide
- `docs/diff.md` or equivalent diff guide
- docs index links for discoverability
- focused example files that use existing APIs
- trial README updates when they clarify existing trial findings
- internal reports for each pass

Examples must remain runnable/offline if they are code examples, and must not add runtime dependencies.

---

## Explicitly Deferred

- Deep object-definition inference in `index.d.ts`.
- Semantic validation constraints like numeric ranges or date semantics.
- Semantic mock data generation.
- `dbContract()` / ORM behavior.
- AI provider-specific helpers.
- Framework-specific HTTP or form integrations.
- Package split into `@sigil/*` packages.
- Stabilizing CLI, HTTP, or forms before deeper field evidence exists.

---

## Feature Creep Definition

A change counts as feature creep in this block if it:

- adds a new export
- adds a new method to contract objects
- adds a new CLI command or flag
- changes runtime behavior without a failing regression proving the need
- creates a framework/provider/database adapter
- converts source to TypeScript
- adds a runtime dependency
- marks an experimental surface stable
- expands README marketing instead of fixing specific evidence-backed friction

---

## Acceptance Boundary

This block is complete when it documents and improves the known ergonomics friction while preserving project invariants:

- package remains `@weipertda/sigiljs`
- zero runtime dependencies remain
- no package split occurs
- CLI remains experimental
- `httpContract()` remains experimental
- `toFormConstraints()` remains experimental
- TypeScript and `diff()` usage are easier to understand
- final lint, tests, type check, and pack dry run pass
