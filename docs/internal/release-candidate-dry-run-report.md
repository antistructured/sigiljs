# Release Candidate Dry Run Report

**Block:** Release Candidate Dry Run  
**Package:** `@weipertda/sigiljs`  
**Version:** `0.16.0`  
**Theme:** Release candidate dry run for the hardened stable core

---

## 1. Current Package Name

```txt
@weipertda/sigiljs
```

Package name remains unchanged.

---

## 2. Current Version

```txt
0.16.0
```

This is a 0.x release-candidate dry-run target. It is not `1.0.0`.

---

## 3. Package Metadata Status

Status: **pass**

Findings:

- `name` is `@weipertda/sigiljs`
- `version` is `0.16.0`
- package remains ESM (`"type": "module"`)
- `types` points to `./index.d.ts`
- `exports["."].types` points to `./index.d.ts`
- `bin.sigil` points to `./src/playground.js`
- `files` allowlist includes source, docs, examples, declarations, README, and license
- runtime dependencies remain zero

Report: `docs/internal/package-release-audit.md`

---

## 4. Pack Artifact Status

Status: **pass**

`npm pack --dry-run --json` confirmed:

- `index.d.ts` is included
- `README.md` is included
- `LICENSE` is included
- `package.json` is included
- `src/` is included
- CLI bin target `src/playground.js` is included
- `docs/` and `examples/` are included
- no tarballs or temp files are included

Report: `docs/internal/npm-pack-artifact-audit.md`

---

## 5. Fresh Install Smoke Status

Status: **pass**

A fresh temporary consumer project installed the packed tarball and executed a Node ESM consumer file importing:

```js
import { sigil, oneOf, optional } from '@weipertda/sigiljs';
```

Validated flow:

- create exact contract
- run `safeParse()`
- project `toJSONSchema()`
- generate `mock()`
- run `check()` on mock output

Report: `docs/internal/fresh-consumer-install-smoke.md`

---

## 6. Public Import Smoke Status

Status: **pass**

Added `tests/package-public-imports.test.js` covering:

- `sigil`
- `Sigil`
- `optional`
- `union`
- `oneOf`
- `realType`
- `httpContract` as an exported experimental helper
- legacy aliases: `S`, `T`, `real`, `Real`
- absence of known internal helper exports from the root API

---

## 7. CLI Packaged Smoke Status

Status: **pass**

A fresh temporary consumer installed the packed tarball and ran the packaged `sigil` bin:

```bash
./node_modules/.bin/sigil --help
./node_modules/.bin/sigil describe ./contract.sigil.js
./node_modules/.bin/sigil json-schema ./contract.sigil.js
./node_modules/.bin/sigil mock ./contract.sigil.js
```

The CLI works when installed as a package, using `.sigil.js` modules that import `@weipertda/sigiljs` by package name.

The CLI remains experimental.

Report: `docs/internal/cli-packaged-usage-smoke.md`

---

## 8. TypeScript Consumer Smoke Status

Status: **pass**

Verified:

- `bun run check:types`
- temporary packed TypeScript consumer install
- public API imports
- explicit `sigil<T>()` / `sigil.exact<T>()`
- `safeParse()` narrowing
- projection return types
- `mock()` / `cases()` / `test()` types
- experimental `httpContract()` declarations

Conservative TypeScript inference remains documented.

Report: `docs/internal/typescript-consumer-smoke.md`

---

## 9. Examples / Recipes Smoke Status

Status: **pass**

Verified:

- `bun test tests/recipe-smoke.test.js`: 31 pass, 0 fail
- direct runnable recipe examples execute
- no stale recipe imports found
- no live SDK calls or external services required
- deterministic recipe posture remains intact

Report: `docs/internal/examples-recipes-smoke.md`

---

## 10. Docs Release Review Status

Status: **pass**

Verified:

- install commands are correct
- public docs use `@weipertda/sigiljs`
- public docs do not claim available `@sigil/*` packages
- stale AI helper guidance was removed in favor of `toJSONSchema()`
- CLI experimental status is clear
- TypeScript declarations are documented
- known limitations are linked
- recipes are discoverable

Report: `docs/internal/docs-release-review.md`

---

## 11. Known Limitations Status

Status: **pass**

Limitations remain explicit:

- TypeScript inference is conservative
- CLI remains experimental
- `.sigil` text-file loading may be Bun-specific
- `mock()` values are structural, not semantic
- HTTP helpers are experimental
- form constraints are experimental
- no `@sigil/*` package split exists
- no database helper / ORM behavior exists

Report: `docs/internal/limitations-experimental-release-review.md`

---

## 12. Runtime Dependency Status

Status: **pass**

Runtime dependencies remain zero:

```json
"dependencies": {}
```

No runtime dependency was added in this block.

---

## 13. Remaining Blockers

No blocker was found for a serious 0.x release candidate dry run.

Remaining blockers before a future 1.0.0:

- real-world stable-core ergonomics validation
- real CLI workflow usage and frozen output/exit contracts
- real HTTP helper framework/runtime usage
- real form/UI usage for `toFormConstraints()`
- final `compile()` 1.0 posture decision
- final `.sigil` syntax/loading compatibility policy

---

## 14. Recommendation

Ready for a serious 0.x release candidate.

Do not cut 1.0 yet.

Proceed next to Real-World Usage Trial to validate ergonomics across real application workflows.

---

## Package Split Confirmation

No package split occurred.

The package remains:

```txt
@weipertda/sigiljs
```

No `@sigil/*` packages were created.

---

## Experimental API Confirmation

Experimental APIs remain experimental:

- `httpContract()`
- `contract.toFormConstraints()`
- `sigil` CLI
- `.sigil` text contract file format

No experimental API was promoted to stable during this dry run.
