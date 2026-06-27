# Public Release Carry-Forward Reconciliation

**Block:** 0.18.x Public Release Prep  
**Pass:** 0 — Carry-Forward Reconciliation  
**Package:** `@weipertda/sigiljs`  
**Observed package version:** `0.16.0`

---

## Decision

**Chosen option:** Option A — release prep target is `0.18.x` and package metadata should be bumped accordingly.

Target version for this release prep block:

```txt
0.18.0
```

Rationale:

- `package.json` currently reports `0.16.0`.
- The Ergonomics Fix Pack final verification reported `0.16.0` as observed state, not as the next target.
- The Ergonomics Fix Pack report listed `0.18.0` as the suggested target.
- The milestone state names the next planned block as `0.18.x Public Release Prep`.
- No inspected release report indicates that `0.16.x` should remain the public release line.

No package version change is made in this pass. The version bump belongs to Pass 2 after this decision is documented.

---

## Carry-Forward Verification

| Item | Status |
|------|--------|
| package name | `@weipertda/sigiljs` |
| observed package version | `0.16.0` |
| selected release target | `0.18.0` |
| zero runtime dependencies | preserved in `package.json` |
| package split | none observed |
| CLI bin | `sigil -> ./src/playground.js` |
| `compile()` posture docs | present |
| CLI compatibility policy docs | present |
| TypeScript guide | present |
| `diff()` guide | present |
| HTTP/form evidence docs | present |

---

## Verifier-Warning File Review

The six files called out from the previous no-op patch verifier warnings were inspected directly.

| File | Review result |
|------|---------------|
| `docs/cli.md` | Already marks CLI experimental and Bun-first; uses direct projection commands; no stale `project <target>` wording found. |
| `docs/experimental.md` | Already lists CLI, `httpContract()`, and `toFormConstraints()` as experimental; only stale item is version label `0.16.0`, to update with package metadata in Pass 2. |
| `docs/cli/contract-files.md` | Already marks CLI contract-file loading experimental; prefers `.sigil.js` for real projects; no stale CLI stabilization claim found. |
| `docs/api.md` | Already documents `compile()` as a contract method and root `compile` as absent; only stale item is version label `0.16.0`, to update with package metadata in Pass 2. |
| `docs/database/persistence-diffs.md` | Already uses `Next.diff(Previous)` and `property.added` / `property.removed`. |
| `trials/database-boundary/README.md` | Already points readers to `Next.diff(Previous)` and `docs/diff.md`. |

Conclusion: the no-op warnings reflected content that was already present, not missed changes. Version labels that mention `0.16.0` are release-prep metadata work, not carry-forward blockers.

---

## Reconciliation Fixes

No public-doc patch was required in this pass.

This report records the version target decision and verifies the warning files before release prep proceeds.

---

## Blockers

None.

Public release prep may proceed with target `0.18.0`.
