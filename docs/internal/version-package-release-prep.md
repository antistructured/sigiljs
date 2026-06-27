# Version + Package Metadata Release Prep

**Block:** 0.18.x Public Release Prep  
**Pass:** 2 — Version + Package Metadata Prep  
**Package:** `@weipertda/sigiljs`  
**Release target:** `0.18.0`

---

## Version Decision Applied

Pass 0 selected:

```txt
0.18.0
```

`package.json` was updated from `0.16.0` to `0.18.0`.

---

## Package Metadata Review

| Field | Status |
|-------|--------|
| `name` | `@weipertda/sigiljs` — unchanged |
| `version` | `0.18.0` — updated |
| `description` | coherent: executable data contracts for JavaScript runtime boundaries |
| `types` | `./index.d.ts` present |
| `exports["."].types` | `./index.d.ts` present |
| `exports["."].default` | `./src/index.js` present |
| `main` | `./src/index.js` present |
| `bin.sigil` | `./src/playground.js` present |
| `files` | includes source, docs, examples, declarations, README, LICENSE |
| `license` | MIT, with `LICENSE` file present |
| `repository` | GitHub repository URL present |
| `bugs` | GitHub issues URL present |
| `homepage` | GitHub README URL present |
| `publishConfig.access` | public |
| `sideEffects` | false |
| `type` | module |
| `dependencies` | absent / zero runtime dependencies |
| `devDependencies` | TypeScript and Zod only |

---

## Public Version Labels Updated

Updated active public docs from `0.16.0` to `0.18.0`:

- `docs/api.md`
- `docs/stability.md`
- `docs/known-limitations.md`
- `docs/experimental.md`

Historical internal reports retain their original observed versions to preserve audit history.

---

## Runtime Dependency Status

Runtime dependencies remain zero.

```txt
dependencies: not present
```

No runtime dependency was added.

---

## Package Split Status

No package split occurred.

Package remains:

```txt
@weipertda/sigiljs
```

No `@sigil/*` package was created.

---

## Notes

`CHANGELOG.md` exists but currently only contains older entries. The `0.18.0` entry is intentionally deferred to Pass 8: Release Notes + Changelog Prep.

`check:release` is not added in this pass. It is intentionally deferred to Pass 10: Release Gate Script Decision.

---

## Blocker Assessment

No package metadata blocker remains for the selected `0.18.0` release target.
