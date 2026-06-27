# Public Release Prep Report

**Block:** 0.18.x Public Release Prep  
**Pass:** 11 — Public Release Prep Report  
**Package:** `@weipertda/sigiljs`  
**Release target:** `0.18.0`  
**Release theme:** Public `0.x` release prep

---

## Executive Summary

SigilJS is prepared for a broader public `0.x` release line at `0.18.0`.

This release prep does **not** claim `1.0.0` stability. It positions the stable core for public feedback while keeping CLI workflows, `httpContract()`, and `toFormConstraints()` explicitly experimental.

---

## Release Positioning

Public positioning:

```txt
SigilJS is ready for broader public 0.x usage feedback, but this is not a 1.0.0 release.
```

Ready for:

- stable-core runtime contract usage
- JavaScript ESM consumers
- TypeScript consumers using bundled declarations and explicit generics
- public feedback on the stable core
- experimental use of CLI, HTTP, and form projection helpers with caveats

Not claiming:

- `1.0.0` compatibility guarantees
- frozen CLI output/flags/exit behavior
- stable HTTP helper semantics
- stable form constraint semantics
- package extraction
- framework/UI/ORM/provider adapters

---

## Package Metadata Status

Current package metadata:

```txt
name: @weipertda/sigiljs
version: 0.18.0
license: MIT
type: module
types: ./index.d.ts
main: ./src/index.js
exports["."].types: ./index.d.ts
exports["."].default: ./src/index.js
bin.sigil: ./src/playground.js
publish access: public
runtime dependencies: zero
```

Package version was bumped from `0.16.0` to `0.18.0` after Pass 0 selected `0.18.x` as the release prep target.

---

## Public Docs Status

Updated / reviewed public docs include:

- `README.md`
- `CHANGELOG.md`
- `docs/README.md`
- `docs/api.md`
- `docs/stability.md`
- `docs/known-limitations.md`
- `docs/experimental.md`
- `docs/quickstart.md`
- `docs/typescript.md`
- `docs/diff.md`

Public docs now consistently communicate:

- active version target `0.18.0`
- stable core is ready for broader public `0.x` feedback
- this is not `1.0.0`
- CLI, `httpContract()`, and `toFormConstraints()` remain experimental
- no package split has occurred
- trials and internal reports are not npm package content

---

## Changelog / Release Notes

`CHANGELOG.md` now includes a `0.18.0` entry covering:

- public `0.x` release prep
- package metadata updates
- README/docs polish
- npm package contents decision
- experimental-surface status
- known pre-1.0 blockers

Internal release notes were added at:

```txt
docs/internal/public-release-notes-0.18.x.md
```

`CHANGELOG.md` was added to the package allowlist so npm consumers can see release notes.

---

## Packaging Decision

Final package content policy:

| Content | Decision |
|---------|----------|
| `src/` | include |
| `index.d.ts` | include |
| `README.md` | include |
| `CHANGELOG.md` | include |
| `LICENSE` | include |
| public `docs/` | include |
| public `examples/` | include |
| `docs/internal/` | exclude |
| `trials/` | exclude |

Reasoning:

- public docs and examples help consumers adopt the package
- internal reports are release evidence, not public package documentation
- trials are repository validation evidence, not package content

---

## npm Pack Status

Pass 7 pack audit passed before `CHANGELOG.md` was added:

```txt
name: @weipertda/sigiljs
version: 0.18.0
files: 243
package size: 140,196 bytes
unpacked size: 501,939 bytes
```

After `CHANGELOG.md` was intentionally added in Pass 8, the Pass 10 release gate confirmed:

```txt
name: @weipertda/sigiljs
version: 0.18.0
filename: weipertda-sigiljs-0.18.0.tgz
total files: 244
package size: 141.8 kB
unpacked size: 506.4 kB
```

No `docs/internal/` or `trials/` files are intended to ship.

---

## Release Gate Script

Added:

```json
"check:release": "bun run lint && bun test && bun run check:types && npm pack --dry-run"
```

Pass 10 verification:

```txt
bun run check:release: pass
lint: pass
tests: 605 pass, 0 fail
types: pass
pack: pass
```

No dependency or new tool was added.

---

## Stable / Experimental Boundary

Stable core remains the public `0.x` focus:

- Define: `sigil()`, `sigil.exact()`, `Sigil`, `optional()`, `union()`, `oneOf()`
- Enforce: `parse()`, `safeParse()`, `assert()`, `check()`
- Transform: `transform()`, `pipe()`, `trim()`, `serialize()`
- Project: `describe()`, `toJSONSchema()`, `toTypeScript()`, `toOpenAPI()`
- Prove: `mock()`, `cases()`, `test()`, `diff()`
- Errors: `SigilValidationError`
- Utilities: `realType()`
- Types: bundled `index.d.ts`

Experimental surfaces remain:

- `sigil` CLI
- `.sigil` text contract format
- `httpContract()`
- `contract.toFormConstraints()`

No experimental API was promoted in this block.

---

## Remaining Pre-1.0 Work

Known remaining pre-1.0 blockers:

- real CLI field usage before CLI stabilization
- final `.sigil` loading/syntax compatibility policy
- real HTTP runtime/framework usage before stabilizing `httpContract()`
- real form/UI usage before stabilizing `toFormConstraints()`
- broader public usage feedback on the stable core
- final compatibility/deprecation decisions before `1.0.0`

---

## Files Changed In This Public Release Prep Pass Set

Primary files changed by Passes 0–11 include:

- `package.json`
- `CHANGELOG.md`
- `README.md`
- `docs/README.md`
- `docs/api.md`
- `docs/stability.md`
- `docs/known-limitations.md`
- `docs/experimental.md`
- `docs/internal/public-release-carry-forward-reconciliation.md`
- `docs/internal/public-release-scope-audit.md`
- `docs/internal/version-package-release-prep.md`
- `docs/internal/readme-public-release-polish.md`
- `docs/internal/docs-navigation-public-release-polish.md`
- `docs/internal/quickstart-first-run-review.md`
- `docs/internal/examples-trials-packaging-decision.md`
- `docs/internal/npm-package-final-release-audit.md`
- `docs/internal/public-release-notes-0.18.x.md`
- `docs/internal/public-limitations-release-review.md`
- `docs/internal/release-gate-script-decision.md`
- `docs/internal/public-release-prep-report.md`

---

## Blocker Assessment

No release-prep blocker remains after Pass 11.

Proceed to Pass 12 final verification summary.
