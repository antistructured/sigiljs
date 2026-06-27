# API Docs Reconciliation Report

**Block:** Stable Core Regression Matrix  
**Pass:** 0 — API Docs Reconciliation  
**Package:** `@weipertda/sigiljs` v0.14.0 baseline

---

## Goal

Verify and reconcile `docs/api.md` after the Stable Core Hardening block, specifically because one prior `docs/api.md` patch attempt failed with ambiguous hunk matching.

---

## Files Inspected

- `docs/api.md`
- `docs/stability.md`
- `docs/internal/stable-core-hardening-report.md`
- `index.d.ts`

The reconciliation was checked against the hardened stable-core decisions from the previous block.

---

## Reconciled Items

`docs/api.md` already contained the major stable-core hardening updates:

- `sigil()` documented as preferred primary API
- `Sigil` documented as stable advanced template API
- `safeParse()` detailed section documents `{ success: true, data } | { success: false, error }`
- `parse()` transform behavior documented
- `serialize()` no-transform behavior documented
- `transform()` behavior documented
- `toJSONSchema()` deterministic subset output documented
- `toOpenAPI()` schema-level output documented
- `toFormConstraints()` marked experimental
- `mock()`, `cases()`, and `test()` detailed sections documented
- `httpContract()` marked experimental
- `SigilValidationError` stable shape documented

Small stale/missing items were corrected:

- added `real` and `Real` to the public import example
- added `real` and `Real` to the public exports table as legacy aliases of `realType`
- expanded `SigilValidationError` export table shape to include `name`
- changed contract-method table `safeParse()` wording to exact branch shape
- added `test(cases?)` to the contract-method table

---

## Still Missing

No required stable-core API documentation item remains missing from `docs/api.md` for this pass.

`compile()` remains documented as stable in `docs/api.md` and as needing final pre-1.0 posture confirmation in `docs/stability.md` / the hardening report. This is not changed in this pass because the current block is regression-safety, not API reclassification.

---

## Blockers

None.

The previous ambiguous patch issue is resolved by applying targeted exact replacements with count checks rather than broad fuzzy patches.
