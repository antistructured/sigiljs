# Limitations / Experimental Release Review

**Block:** Release Candidate Dry Run  
**Pass:** 10 — Known Limitations / Experimental Review  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Goal

Ensure release-facing limitations and experimental surfaces remain explicit before a serious 0.x release-candidate dry run.

---

## Inspected

- `docs/known-limitations.md`
- `docs/experimental.md`
- `docs/stability.md`
- `README.md`
- `docs/internal/pre-1.0-experimental-surface-audit.md`
- `docs/internal/experimental-boundary-guard-report.md`

---

## Required Limitation Coverage

| Limitation | Status |
|---|---|
| TypeScript inference is conservative | documented |
| CLI remains experimental | documented |
| `.sigil` CLI loading may be Bun-specific | documented |
| `mock()` values are structurally valid but not semantically meaningful | documented |
| HTTP helpers are experimental | documented |
| Form constraints are experimental | documented |
| No `@sigil/*` package split yet | documented |
| No database helper / ORM behavior | documented via missing adapters and deferred `@sigil/db` posture |

---

## Experimental Surface Status

Current experimental surfaces remain clearly marked:

- `httpContract()`
- `contract.toFormConstraints()`
- `sigil` CLI
- `.sigil` text contract file format

No experimental API was promoted during this dry run.

---

## Release-Candidate Interpretation

These limitations do not block a serious 0.x release candidate because they are either:

- explicitly experimental surfaces,
- documented constraints of the current stable-core candidate,
- or intentionally deferred adapter/package work.

They do block a future 1.0.0 until real-world usage validates ergonomics and compatibility.

---

## Remaining 1.0 Blockers

- real-world stable-core ergonomics validation
- real CLI workflow usage and frozen output/exit contracts
- real HTTP helper framework/runtime usage
- real form/UI usage for `toFormConstraints()`
- final `compile()` 1.0 posture decision
- final `.sigil` syntax/loading compatibility policy

---

## Blockers

No hidden limitation or experimental-surface blocker found for the 0.x release-candidate dry run.
