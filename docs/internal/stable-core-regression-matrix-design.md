# Stable Core Regression Matrix Design

**Block:** Stable Core Regression Matrix  
**Pass:** 1 — Regression Matrix Design  
**Package baseline:** `@weipertda/sigiljs` v0.14.0  
**Target release theme:** Stable core regression matrix

---

## Goal

Turn the stable-core hardening decisions into an explicit regression safety net.

Core message:

```txt
The stable core should stay stable because regressions are explicitly tested, documented, and checked.
```

This design precedes new regression test files. It maps existing coverage, identifies focused matrix files to add, and documents boundaries that should not be over-specified.

---

## Stable Core Behaviors To Protect

### Define

Protect public contract construction through package-root exports:

- `sigil()` object-definition contracts
- `sigil.exact()` strict object contracts
- `Sigil` stable advanced template API
- `optional()` optional fields
- `union()` primitive branch unions
- `oneOf()` literal unions
- `realType()` runtime labels

Existing coverage:

- `tests/define-object.test.js`
- `tests/exact.test.js`
- `tests/literals.test.js`
- `tests/realType.test.js`
- `tests/contract-core.test.js`
- `tests/public-api-surface.test.js`

New focused regression file:

- `tests/regression-define-api.test.js`

Boundary:

- Use package public entry (`../src/index.js`) rather than parser internals.
- Do not assert parser token shapes.

---

### Enforce

Protect runtime validation and error/result shapes:

- `check()` boolean contract
- `assert()` throwing trusted-data path
- `parse()` throwing trusted-data path
- `safeParse()` discriminated result
- `SigilValidationError` stable fields and `toJSON()` shape
- nested paths and exact-object extra-key paths

Existing coverage:

- `tests/enforce-pillar.test.js`
- `tests/assert-errors.test.js`
- `tests/stable-core-error-shape.test.js`
- `tests/stable-core-safeparse-shape.test.js`
- `tests/validate.test.js`
- `tests/contract-core.test.js`

New focused regression file:

- `tests/regression-enforce-api.test.js`

Boundary:

- Assert public error shape, not internal issue arrays or compiler implementation.

---

### Transform

Protect transform and serialize semantics:

- field transforms via `pipe()` / `trim()` run during `parse()`
- contract transforms run during `parse()` and successful `safeParse()`
- transformed output is revalidated
- `serialize()` validates only and does not apply transforms
- input mutation behavior remains caller-visible only through returned values; do not over-specify object identity beyond current documented semantics

Existing coverage:

- `tests/transform-pillar.test.js`
- `tests/stable-core-transform-serialize.test.js`

New focused regression file:

- `tests/regression-transform-serialize.test.js`

Boundary:

- Do not invent bidirectional serialization semantics.
- Do not assert hidden transform pipeline internals.

---

### Project

Protect stable projection outputs:

- `describe()` deterministic structural object
- `toJSONSchema()` deterministic subset object
- `toTypeScript()` deterministic declaration string
- `toOpenAPI()` schema-level output
- metadata projection where documented
- unsupported projection errors where documented
- `toFormConstraints()` remains experimental

Existing coverage:

- `tests/describe-model.test.js`
- `tests/json-schema.test.js`
- `tests/typescript-projection.test.js`
- `tests/openapi-projection.test.js`
- `tests/projections/*.test.js`
- `tests/stable-core-projection-contracts.test.js`

New focused regression file:

- `tests/regression-projection-api.test.js`

Boundary:

- Lock representative output shape and ordering, not every internal branch of the projection implementation.
- Do not promote form constraints to stable.

---

### Prove

Protect stable Prove outputs:

- `mock()` returns deterministic structurally valid values
- `cases()` returns `{ valid, invalid }`
- generated valid cases pass
- generated invalid cases fail
- case entries include documented labels
- `test()` returns summary object with success boolean and counts
- semantic limitation of mocks remains documented

Existing coverage:

- `tests/testing-helpers.test.js`
- `tests/generate-valid.test.js`
- `tests/stable-core-prove-contracts.test.js`
- recipe smoke tests

New focused regression file:

- `tests/regression-prove-api.test.js`

Boundary:

- Do not assert human-realistic sample content.
- Assert structural validity and determinism only.

---

### Aliases / Exports

Protect public package-root surface:

- stable exports exist
- `Sigil` remains stable advanced API
- `S`, `T`, `real`, and `Real` remain legacy supported aliases
- `httpContract` remains exported but experimental
- internal helpers do not leak through the root export

Existing coverage:

- `tests/public-api.test.js`
- `tests/public-api-surface.test.js`
- `tests/stable-core-legacy-aliases.test.js`

New focused regression file:

- `tests/regression-public-exports.test.js`

Boundary:

- Do not expose internals to satisfy regression tests.
- Test policy, not implementation file layout.

---

### Type Declarations

Protect conservative declaration behavior:

- package exposes `index.d.ts`
- `sigil<T>()` explicit generic usage
- `parse()` return type
- `safeParse()` narrowing
- assertion narrowing where practical
- projection/Prove return types
- `Sigil` and legacy aliases declared
- experimental `httpContract` declared as experimental

Existing coverage:

- `tests/typescript-declarations/basic-usage.ts`
- `tests/typescript-declarations/projections.ts`
- `tests/typescript-declarations/prove.ts`
- `tests/typescript-declarations/experimental-http.ts`
- `tests/typescript-declarations/stable-core-shapes.ts`

New focused regression file:

- `tests/typescript-declarations/stable-core.ts`

Boundary:

- Keep declarations conservative.
- Do not require deep static inference from object definitions.

---

### Experimental Guards

Protect experimental containment:

- `httpContract()` remains experimental in docs/types
- `toFormConstraints()` remains experimental in docs/types
- CLI workflows remain experimental
- `.sigil` file format remains experimental
- no `@sigil/*` packages are claimed to exist

Existing coverage/docs:

- `docs/experimental.md`
- `docs/stability.md`
- `docs/known-limitations.md`
- `docs/cli.md`
- `docs/projections/http.md`
- `docs/projections/forms.md`
- `index.d.ts`

New report:

- `docs/internal/experimental-boundary-guard-report.md`

Optional tests:

- only if a public export/status invariant is cheaply testable without promoting an experimental API.

---

### Release Gates

Protect package/release invariants:

- `bun run lint`
- `bun test`
- `bun run check:types`
- `npm pack --dry-run`
- package name remains `@weipertda/sigiljs`
- version target advances to `0.15.0` for this block
- runtime dependencies remain zero
- bin remains `sigil`
- `index.d.ts` remains packed
- no package split occurs
- experimental status remains documented

Existing scripts:

- `lint`
- `test`
- `check:types`

Missing gate script:

- no `check:release` script currently exists; document as skipped/recommended unless trivial to add later.

New report:

- `docs/internal/stable-core-release-gate-matrix.md`

---

## New Regression Files Planned

- `tests/regression-define-api.test.js`
- `tests/regression-enforce-api.test.js`
- `tests/regression-transform-serialize.test.js`
- `tests/regression-projection-api.test.js`
- `tests/regression-prove-api.test.js`
- `tests/regression-public-exports.test.js`
- `tests/typescript-declarations/stable-core.ts`

## New Internal Docs Planned

- `docs/internal/api-docs-reconciliation-report.md`
- `docs/internal/stable-core-regression-matrix-design.md`
- `docs/internal/experimental-boundary-guard-report.md`
- `docs/internal/stable-core-release-gate-matrix.md`
- `docs/internal/stable-core-regression-matrix-report.md`

---

## What Not To Over-Specify

- Parser/tokenizer internal token shapes
- `src/core/*` implementation details
- internal projection helper function signatures
- exact generated mock content beyond deterministic structural validity
- every JSON Schema/OpenAPI branch; use representative stable shapes
- framework-specific HTTP behavior
- CLI output compatibility beyond experimental containment
- form UI integration semantics
- TypeScript deep inference not present in the declarations

---

## Acceptance Target

This block is complete when the regression matrix files exist, final verification passes, runtime dependencies remain zero, the package remains single-package `@weipertda/sigiljs`, and experimental edges remain clearly labeled.
