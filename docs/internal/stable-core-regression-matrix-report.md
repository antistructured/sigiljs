# Stable Core Regression Matrix Report

**Block:** Stable Core Regression Matrix  
**Pass:** 11 — Regression Matrix Report  
**Package:** `@weipertda/sigiljs` v0.15.0  
**Release theme:** Stable core regression matrix

---

## 1. Current Package Name

```txt
@weipertda/sigiljs
```

No package rename occurred.

---

## 2. Current Version

```txt
0.15.0
```

The block target is the stable core regression matrix release.

---

## 3. Regression Categories Covered

The matrix covers:

1. Define
2. Enforce
3. Transform / Serialize
4. Project
5. Prove
6. Aliases / exports
7. Type declarations
8. Experimental guards
9. Release gates

Focused regression files added:

```txt
tests/regression-define-api.test.js
tests/regression-enforce-api.test.js
tests/regression-transform-serialize.test.js
tests/regression-projection-api.test.js
tests/regression-prove-api.test.js
tests/regression-public-exports.test.js
tests/typescript-declarations/stable-core.ts
```

Supporting reports added:

```txt
docs/internal/api-docs-reconciliation-report.md
docs/internal/stable-core-regression-matrix-design.md
docs/internal/experimental-boundary-guard-report.md
docs/internal/stable-core-release-gate-matrix.md
docs/internal/stable-core-regression-matrix-report.md
```

---

## 4. Define Regression Status

Status: **covered**

File:

```txt
tests/regression-define-api.test.js
```

Protected behaviors:

- `sigil()` object definition
- `sigil.exact()` strict object definition
- `Sigil` stable advanced template API
- `optional()` optional fields
- `union()` branch acceptance/rejection
- `oneOf()` literal acceptance/rejection
- `realType()` common runtime labels
- public imports from `src/index.js`

No experimental Define APIs were promoted.

---

## 5. Enforce Regression Status

Status: **covered**

File:

```txt
tests/regression-enforce-api.test.js
```

Protected behaviors:

- `check(valid)` returns `true`
- `check(invalid)` returns `false`
- `parse(valid)` returns data
- `parse(invalid)` throws `SigilValidationError`
- `assert(valid)` accepts data
- `assert(invalid)` throws `SigilValidationError`
- `safeParse(valid)` returns `{ success: true, data }`
- `safeParse(invalid)` returns `{ success: false, error }`
- `safeParse()` does not throw on ordinary validation failures
- nested error path stability
- exact-object extra-key path stability

`SigilValidationError` and `safeParse()` shapes are protected through public behavior.

---

## 6. Transform / Serialize Regression Status

Status: **covered**

File:

```txt
tests/regression-transform-serialize.test.js
```

Protected behaviors:

- field-level transforms through `parse()`
- contract-level transforms through `parse()`
- transformed output revalidation
- `safeParse()` success data contains transformed output
- `serialize()` validates but does not apply field or contract transforms
- `serialize()` throws on invalid outbound data
- nested object transform behavior where documented

No new transform or serialization feature was introduced.

---

## 7. Projection Regression Status

Status: **covered**

File:

```txt
tests/regression-projection-api.test.js
```

Protected behaviors:

- deterministic fresh `describe()` output
- deterministic `toJSONSchema()` subset output
- deterministic `toTypeScript()` string output
- deterministic schema-level `toOpenAPI()` output
- metadata projection behavior
- documented unsupported projection error fields
- `toFormConstraints()` remains an experimental smoke, not stable-core promotion

The matrix protects representative stable projection contracts without over-specifying every projection implementation branch.

---

## 8. Prove Regression Status

Status: **covered**

File:

```txt
tests/regression-prove-api.test.js
```

Protected behaviors:

- `mock()` returns deterministic data accepted by the contract
- optional-field mock behavior
- `cases()` returns `{ valid, invalid }`
- generated valid cases pass
- generated invalid cases fail
- case labels exist
- `expectedPath` exists when practical
- `test()` returns stable report shape with success boolean and counts
- custom mismatch reports do not throw

The semantic limitation remains documented: `mock()` output is structurally valid, not domain-realistic.

---

## 9. Alias / Export Regression Status

Status: **covered**

File:

```txt
tests/regression-public-exports.test.js
```

Protected behaviors:

- documented root export list
- stable exports exist with callable shapes
- `Sigil` remains stable advanced template API
- `S` and `T` remain legacy supported aliases of `Sigil`
- `real` and `Real` remain legacy supported aliases of `realType`
- `httpContract` remains exported as experimental
- internal helpers are not exported from the package root

No internal exports were added to satisfy tests.

---

## 10. Type Declaration Regression Status

Status: **covered**

File:

```txt
tests/typescript-declarations/stable-core.ts
```

Protected declaration behavior:

- explicit `sigil<T>()` / `sigil.exact<T>()` generic usage
- `Sigil` template API declarations
- `safeParse()` narrowing
- `parse()` return type
- `assert()` narrowing with explicit contract annotation
- projection return types
- `mock()`, `cases()`, and `test()` return types
- `S`, `T`, `real`, and `Real` declarations
- experimental `httpContract()` declaration surface

Declarations remain conservative and do not claim deep object-definition inference.

---

## 11. Experimental Guard Status

Status: **covered**

Report:

```txt
docs/internal/experimental-boundary-guard-report.md
```

Guarded surfaces:

- `httpContract()`
- `toFormConstraints()`
- `sigil` CLI workflows
- `.sigil` text file format

Actions taken:

- added explicit experimental warning to `docs/cli.md`
- added explicit experimental warning to `docs/cli/contract-files.md`

Confirmed:

- HTTP helpers remain experimental
- form constraints remain experimental
- CLI remains experimental
- `.sigil` text format remains experimental
- no `@sigil/*` packages are claimed to exist
- TypeScript declarations retain `@experimental` markers

---

## 12. Release Gate Status

Status: **documented; final execution in Pass 12**

Report:

```txt
docs/internal/stable-core-release-gate-matrix.md
```

Required gates:

```txt
bun run lint
bun test
bun run check:types
npm pack --dry-run
```

Additional invariant checks:

- package remains `@weipertda/sigiljs`
- version is `0.15.0`
- runtime dependencies remain zero
- bin remains `sigil`
- `index.d.ts` remains declared and packed
- no package split occurred
- experimental APIs remain labeled

`check:release` does not currently exist and should be reported as skipped.

---

## 13. Remaining Blockers

No blocker prevents completing this regression matrix block.

Remaining pre-1.0 blockers are intentionally outside this block:

- real-world usage validation for stable-core ergonomics
- real-world usage validation for CLI workflows
- real framework/runtime usage for `httpContract()`
- real UI/form usage for `toFormConstraints()`
- final `compile()` pre-1.0 posture decision
- no package extraction until usage justifies it

---

## 14. Recommendation

Stable core regression matrix is in place.

Do not cut 1.0 yet until real-world usage confirms stable core ergonomics and experimental edges remain contained.

Proceed next to **Release Candidate Dry Run** if Pass 12 verification lands cleanly.

If Pass 12 or early usage reveals ergonomics concerns, do **Real-World Usage Trial** first.

---

## Architecture Compliance

Confirmed by scope and package metadata:

- no feature expansion
- no package split
- no runtime dependency added
- package remains `@weipertda/sigiljs`
- brand remains SigilJS
- experimental APIs remain experimental
- stable core is protected through public behavior tests and release gates
