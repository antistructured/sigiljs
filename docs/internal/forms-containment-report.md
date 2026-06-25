# Forms Containment Report

**Block:** Form Constraint Contracts  
**Package:** `@weipertda/sigiljs`

---

## Summary

The form constraint surface is contained, verified, and safe to ship as experimental. All 11 tasks are complete. Tests pass. Lint is clean. Pack is clean. No framework dependencies. No DOM dependencies. No package split.

**Decision: Form surface is release-ready as experimental.**

---

## 1. Current package name

`@weipertda/sigiljs` — unchanged. No split.

---

## 2. Form API status

All form surface is **experimental**. No form API is stable.

---

## 3. Public form exports

`toFormConstraints()` is not an independent export. It is a method on every contract object returned by `sigil()` / `sigil.exact()` / `Sigil`.

No new top-level exports were added in this block.

---

## 4. Experimental form methods

| Method | Status |
|--------|--------|
| `contract.toFormConstraints()` | experimental |

Marked experimental in:
- `src/projections/forms.js` — `@experimental` JSDoc
- `docs/api.md` — `**Status:** experimental`
- `docs/projections/forms.md` — top-level status notice
- `docs/experimental.md` — listed

---

## 5. UI framework dependency status

**None.** `src/projections/forms.js` has zero imports. Pure plain-object logic.

---

## 6. DOM dependency status

**None.** No `document`, `window`, `FormData`, or browser-only API is used anywhere in the form surface.

---

## 7. Projection support level

| Feature | Status |
|---------|--------|
| `string` → `text` | ✅ |
| `number` → `number` | ✅ |
| `boolean` → `checkbox` | ✅ |
| all-literal union → `select` with `options` | ✅ |
| mixed union → `accepts` array | ✅ |
| nested object → `type: object`, `fields` | ✅ |
| array → `type: array`, `items` | ✅ |
| `name`, `path`, `label` per field | ✅ |
| `required: true/false` | ✅ |
| fresh result per call | ✅ |
| non-object → `{ fields: {} }` | ✅ |

---

## 8. Test coverage summary

| File | Tests |
|------|-------|
| `tests/forms-projection.test.js` | 5 (updated to new shape) |
| `tests/form-constraints.test.js` | 30 (new) |

Total form projection tests: **35**

---

## 9. Docs consistency summary

| File | Status |
|------|--------|
| `docs/projections/forms.md` | Rewritten — removed stale `@sigil/forms` ref, updated shape |
| `docs/forms/form-contracts.md` | Created |
| `docs/forms/form-constraints.md` | Created |
| `docs/forms/form-validation.md` | Created |
| `docs/forms/form-testing.md` | Created |
| `docs/api.md` | `toFormConstraints()` section updated with full signature |
| `docs/experimental.md` | unchanged (already listed) |
| `README.md` | 5 new docs links added |

---

## 10. Release readiness

| Gate | Result |
|------|--------|
| `bun test` | **443 pass, 0 fail** |
| `bun run lint` | **exit 0 (clean)** |
| `npm pack --dry-run` | **clean, 206 files, 476.6 KB unpacked** |
| Runtime dependencies | **0** |
| UI framework coupling | **None** |
| DOM coupling | **None** |
| New top-level exports | **None** |
| Accidental stable promotion | **None** |

---

## 11. Recommendation

**Form helpers remain experimental. Stay single package. Do not extract `@sigil/forms` yet.**

Proceed to **Database Boundary Contracts** as the next block.

---

## Files created or modified in this block

| File | Change |
|------|--------|
| `docs/internal/form-surface-audit.md` | Created |
| `docs/internal/form-constraint-model.md` | Created |
| `docs/internal/form-constraint-stabilization-decision.md` | Created |
| `docs/internal/forms-extraction-readiness.md` | Created |
| `docs/internal/forms-containment-report.md` | Created (this file) |
| `src/projections/forms.js` | Rewritten — added `{ fields }` wrapper, `name`, `path`, `label`, nested objects, arrays, `@experimental` JSDoc |
| `tests/forms-projection.test.js` | Updated — migrated to new `{ fields }` shape |
| `tests/form-constraints.test.js` | Created — 30 comprehensive tests |
| `examples/forms/basic-form.js` | Created |
| `examples/forms/registration-form.js` | Created |
| `examples/forms/form-safe-parse.js` | Created |
| `examples/forms/form-errors.js` | Created |
| `examples/forms/form-mock.js` | Created |
| `examples/forms/form-cases.js` | Created |
| `examples/forms/form-contract-test.js` | Created |
| `examples/forms/login-form.js` | Created |
| `examples/forms/checkout-form.js` | Created |
| `examples/forms/settings-form.js` | Created |
| `examples/forms/ai-generated-form-values.js` | Created |
| `docs/projections/forms.md` | Rewritten |
| `docs/forms/form-contracts.md` | Created |
| `docs/forms/form-constraints.md` | Created |
| `docs/forms/form-validation.md` | Created |
| `docs/forms/form-testing.md` | Created |
| `docs/api.md` | `toFormConstraints()` section expanded |
| `README.md` | 5 new docs links added |
