# Stable Core Release Gate Matrix

**Block:** Stable Core Regression Matrix  
**Pass:** 10 — Release Gate Matrix  
**Package target:** `@weipertda/sigiljs` v0.15.0

---

## Goal

Document the release gates that should be run before publishing or tagging the Stable Core Regression Matrix release.

This pass documents the gates and package invariants. The final execution of all gates is performed in Pass 12.

---

## Required Gates

| Gate | Command / check | Expected result | Status in this pass |
|------|-----------------|-----------------|---------------------|
| Lint | `bun run lint` | exits 0 | documented; final run in Pass 12 |
| Tests | `bun test` | exits 0; all tests pass | documented; final run in Pass 12 |
| Types | `bun run check:types` | exits 0 | documented; Pass 8 narrow run passed; final run in Pass 12 |
| Pack dry run | `npm pack --dry-run` | exits 0; package contents include expected files | documented; final run in Pass 12 |
| Runtime dependencies | inspect `package.json.dependencies` | absent or empty | currently zero runtime dependencies |
| Package name | inspect `package.json.name` | `@weipertda/sigiljs` | currently correct |
| Version | inspect `package.json.version` | `0.15.0` | currently correct |
| Bin | inspect `package.json.bin` | `{ "sigil": "./src/playground.js" }` | currently correct |
| Types metadata | inspect `types`, `exports["."].types`, `files` | `index.d.ts` declared and packed | currently correct |
| Experimental status | inspect docs + declarations | HTTP/form/CLI remain experimental | Pass 9 verified |
| No package split | inspect package/docs | no `@sigil/*` package created or claimed | currently correct |
| Regression files | inspect tests | focused stable-core regression files exist | Passes 2–8 added |

---

## Package Invariants

Current package metadata:

```txt
name: @weipertda/sigiljs
version: 0.15.0
bin: sigil -> ./src/playground.js
types: ./index.d.ts
runtime dependencies: zero
```

Required `files` inclusion:

```txt
index.d.ts
README.md
LICENSE
src
docs
examples
bin
```

The bundled declaration file must remain included through both:

```txt
package.json#types = ./index.d.ts
package.json#exports["."].types = ./index.d.ts
package.json#files includes index.d.ts
```

---

## Regression Test Files Expected

Stable-core regression matrix files:

```txt
tests/regression-define-api.test.js
tests/regression-enforce-api.test.js
tests/regression-transform-serialize.test.js
tests/regression-projection-api.test.js
tests/regression-prove-api.test.js
tests/regression-public-exports.test.js
tests/typescript-declarations/stable-core.ts
```

Supporting reports:

```txt
docs/internal/api-docs-reconciliation-report.md
docs/internal/stable-core-regression-matrix-design.md
docs/internal/experimental-boundary-guard-report.md
docs/internal/stable-core-release-gate-matrix.md
docs/internal/stable-core-regression-matrix-report.md
```

The final report is created in Pass 11.

---

## Experimental Status Gate

Before release, confirm all of the following remain true:

- `httpContract()` is listed as experimental in public docs.
- `toFormConstraints()` is listed as experimental in public docs.
- CLI docs warn that commands/flags/output may change before 1.0.0.
- `.sigil` text file format docs warn that compatibility may change before 1.0.0.
- `index.d.ts` includes `@experimental` markers for HTTP/form surfaces.
- README does not present HTTP helpers or form constraints as stable quickstart APIs.
- No `@sigil/*` packages are added or documented as existing.

---

## Pack Gate Expectations

`npm pack --dry-run` should confirm:

- package name remains `@weipertda/sigiljs`
- package version is `0.15.0`
- `index.d.ts` is included
- `src/index.js` and runtime source files are included
- docs and examples remain included
- no package-split artifacts are introduced

---

## `check:release` Status

No `check:release` script currently exists.

This is not a failure for this block. Pass 12 should report `check:release` as skipped unless a future block adds the script.

Future recommendation:

```json
{
  "scripts": {
    "check:release": "bun run lint && bun test && bun run check:types && npm pack --dry-run"
  }
}
```

Do not add this script in the current block unless explicitly requested or as part of a future release automation block.

---

## Recommendation

Use this matrix as the manual release gate for v0.15.0.

The block is release-safety work, not feature expansion. If all Pass 12 gates pass, proceed to either:

- Release Candidate Dry Run, if ergonomics look clean; or
- Real-World Usage Trial, if the regression matrix exposes adoption concerns.
