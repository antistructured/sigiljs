# Release Candidate Notes

**Package:** `@weipertda/sigiljs`  
**Recommended npm version:** `0.16.0`  
**Theme:** Release candidate dry run for the hardened stable core

---

## Release Theme

This candidate validates SigilJS as a package artifact, not just as a repository.

The stable core has been hardened, protected by a regression matrix, and exercised through release-style smoke checks:

```txt
install → import → use → run examples → run CLI → type-check → pack → inspect docs → verify limitations
```

This is not a 1.0.0 release.

---

## Stable Core Status

Stable core candidate pillars remain:

- Define
- Enforce
- Transform
- Project
- Prove

The stable core remains dependency-free, package-local, and available from `@weipertda/sigiljs`.

Primary stable APIs include:

- `sigil()` and `sigil.exact()`
- `Sigil` advanced tagged-template API
- `optional()`, `union()`, `oneOf()`
- `pipe()`, `trim()`
- `parse()`, `safeParse()`, `assert()`, `check()`
- `transform()`, `serialize()`
- `describe()`, `toJSONSchema()`, `toTypeScript()`, `toOpenAPI()`
- `mock()`, `cases()`, `test()`, `diff()`
- `realType()`
- `SigilValidationError`

---

## Regression Matrix Status

Stable core regression coverage is complete from the prior block and remains part of the release-candidate baseline.

This dry run adds package-level confidence around:

- public import surface
- packaged CLI availability
- TypeScript consumer usage
- examples/recipes execution
- docs and limitation clarity

---

## TypeScript Declaration Status

TypeScript declarations ship via:

```json
"types": "./index.d.ts"
```

The declarations are conservative and consumer-oriented. They support explicit generics and public API consumption, but do not yet infer every object-definition shape automatically.

---

## Recipes Status

Release-facing recipes are deterministic and offline.

Smoke coverage confirms:

- recipe tests pass
- direct recipe files run
- no live SDK calls are required
- no external services are required
- recipe docs use current package import guidance

---

## CLI Status

The `sigil` CLI is packaged and smoke-tested from a tarball install.

It remains experimental.

Validated packaged commands include:

- `sigil --help`
- `sigil describe ./contract.sigil.js`
- `sigil json-schema ./contract.sigil.js`
- `sigil mock ./contract.sigil.js`

Known posture:

- CLI is Bun-shebanged
- `.sigil` text-file loading may be Bun-specific
- commands, flags, output formats, and exit contracts are not frozen for 1.0

---

## Experimental Surfaces

The following remain experimental:

- `httpContract()`
- `contract.toFormConstraints()`
- `sigil` CLI
- `.sigil` text contract file format

No experimental API is promoted by this release candidate.

---

## Known Limitations

Known limitations remain documented:

- TypeScript inference is conservative
- `mock()` is structural, not semantic
- no framework-specific HTTP adapters
- no UI form adapters
- no ORM/database helper behavior
- no AI provider SDK helpers
- no `@sigil/*` package split exists

---

## Verification Results

Dry-run verification performed during this block:

- package metadata audit: pass
- `npm pack --dry-run --json`: pass
- fresh consumer tarball install: pass
- public import smoke test: pass
- packaged CLI smoke: pass
- TypeScript declaration checks: pass
- packed TypeScript consumer smoke: pass
- recipes/examples smoke: pass
- public docs release review: pass
- limitations/experimental review: pass

Final full-suite verification is recorded in `docs/internal/release-candidate-dry-run-report.md` and the final block summary.

---

## Recommended npm Version

Recommended target:

```txt
0.16.0
```

This version should be treated as a serious 0.x release candidate dry run for the hardened stable core.

Do not cut `1.0.0` yet.

---

## Suggested Release Notes

- added release candidate scope audit
- added package metadata release audit
- added npm pack artifact audit
- added fresh consumer install smoke test report
- added public import smoke tests
- added packaged CLI smoke report
- added TypeScript consumer smoke report
- added examples/recipes smoke report
- added docs release review
- added limitations/experimental release review
- added release candidate notes
- added release candidate dry run report
- refreshed release-facing docs for current package/import guidance

---

## Recommendation

Ready for a serious 0.x release candidate.

Do not cut 1.0 yet.

Proceed next to a Real-World Usage Trial to validate ergonomics across real application workflows.
