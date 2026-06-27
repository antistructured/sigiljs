# Package Metadata Release Audit

**Block:** Release Candidate Dry Run  
**Pass:** 2 — Package Metadata Release Audit  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Goal

Audit package metadata for release-candidate coherence without cutting `1.0.0`, renaming the package, splitting packages, or adding runtime dependencies.

---

## Metadata Summary

| Field | Current value | Status |
|------|---------------|--------|
| `name` | `@weipertda/sigiljs` | correct |
| `version` | `0.16.0` | dry-run target |
| `description` | `Executable data contracts for JavaScript runtime boundaries.` | accurate |
| `license` | `MIT` | present; `LICENSE` exists |
| `type` | `module` | correct for ESM package |
| `main` | `./src/index.js` | correct |
| `exports["."].default` | `./src/index.js` | correct |
| `types` | `./index.d.ts` | correct |
| `exports["."].types` | `./index.d.ts` | correct |
| `bin.sigil` | `./src/playground.js` | correct; CLI remains experimental |
| `files` | `bin`, `docs`, `examples`, `index.d.ts`, `LICENSE`, `README.md`, `src` | coherent |
| `dependencies` | absent / zero runtime dependencies | correct |
| `devDependencies` | `typescript`, `zod` | acceptable dev-only tooling |
| `engines.node` | `>=18` | reasonable package floor |
| `engines.bun` | `>=1` | aligns with Bun-first workflows |

---

## Repository Metadata

Current repository metadata:

```txt
repository: git+https://github.com/antistructured/sigiljs.git
bugs: https://github.com/antistructured/sigiljs/issues
homepage: https://github.com/antistructured/sigiljs#readme
```

Status: coherent if this remains the intended upstream repository.

---

## Scripts

Current scripts:

```txt
format: prettier --write src/
lint: eslint src/
test: bun test
check:types: tsc --noEmit -p tests/typescript-declarations/tsconfig.json
bench: bun run bench/validate-user.js
```

Status: coherent for current release checks.

No `check:release` script exists. This is not a blocker for the dry run; final verification should report it as skipped.

---

## Files Allowlist

The package allowlist includes:

- source code
- bundled declarations
- README and license
- docs
- examples
- bin directory

This intentionally includes internal release/audit docs because `docs` is shipped as a whole. If package size or public package polish becomes a concern, a future packaging cleanup can split public docs from internal release docs. That cleanup is not required for this dry run.

---

## Fixes Made

- advanced active package/public version markers from `0.15.0` to `0.16.0`
- left historical internal reports at their original versions
- did not add runtime dependencies
- did not rename package
- did not create package splits
- did not mark any experimental API stable

---

## Blockers

No metadata blocker found for a serious 0.x release-candidate dry run.

Non-blocking follow-up:

- consider adding `check:release` in a future release automation block
- consider a future package-files cleanup if shipping `docs/internal/` is undesirable
