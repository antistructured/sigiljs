# Form Surface Audit

**Block:** Form Constraint Contracts  
**Task:** 1 — Form Surface Audit  
**Package:** `@weipertda/sigiljs`

---

## Summary

A meaningful form surface already exists. `toFormConstraints()` is implemented, exported on all contract objects, documented as experimental, and covered by tests. The block must expand — not replace — this surface.

---

## Current form helpers

### `toFormConstraints()` — on every contract object

**Location:** `src/projections/forms.js` → `projectFormConstraints(description, options)`  
**Wired in:** `src/sigil.js:114` as `toFormConstraints: (options) => projectFormConstraints(sigil.describe(), options)`

**Current output shape (flat, no wrapper):**

```js
{
  name: { required: true, type: 'text' },
  age:  { required: false, type: 'number' },
  role: { required: true, type: 'select', options: ['admin', 'user'] },
}
```

**Current type mappings:**
| Sigil kind | Output type |
|------------|-------------|
| `string` | `text` |
| `number` / `bigint` | `number` |
| `boolean` | `checkbox` |
| all-literal union | `select` with `options` |
| mixed union | `text` (first accepted), `accepts: [...]` |
| literal (single) | `select` with `options: [value]` |
| anything else | `text` (fallback) |

**Missing vs block spec:**
- No `name` field on each field entry (only key in parent object)
- No `path` field (e.g. `['name']`)
- No `label` field
- No `{ fields: { ... } }` wrapper object — current output is flat
- No nested object support (nested objects currently map to `text` fallback)
- No array support
- No `metadata` field preservation

---

## Current form examples

No `examples/forms/` directory exists. No form-specific example files found.  
Boundary form recipes are in:
- `docs/boundaries/forms.md` — shows `safeParse` with `FormData.entries()`, not `toFormConstraints`
- `docs/recipes/form-contracts.md` — shows `safeParse` + optional `toFormConstraints()` call

---

## Current form docs

| File | Status | Contents |
|------|--------|----------|
| `docs/projections/forms.md` | exists | Examples, type mapping table, runtime-first flow |
| `docs/boundaries/forms.md` | exists | `safeParse`-first form boundary recipes |
| `docs/recipes/form-contracts.md` | exists | 6-step recipe with `safeParse` and optional projection |

`docs/projections/forms.md` references `@sigil/forms` as a future package (lines 7–12). This is a stale forward-looking note in a public doc that should be reviewed.

---

## Current exports

`toFormConstraints()` is **not** independently exported from `src/index.js`.  
It is a **method on every contract object** returned by `sigil()` / `sigil.exact()` / `Sigil`.  
It does not appear in the `export { ... }` statements in `src/index.js`.

It is accessible as:
```js
import { sigil } from '@weipertda/sigiljs';
const contract = sigil({ name: String });
contract.toFormConstraints(); // experimental method
```

---

## Whether `toFormConstraints()` exists

**Yes.** Implemented in `src/projections/forms.js`, wired via `src/sigil.js`.

---

## Whether `toFormConstraints()` is exported

Not as a named top-level export. It is a method on the returned contract object (same pattern as `parse`, `safeParse`, `toOpenAPI`, etc.).

---

## Whether it is documented

**Yes:**
- `docs/projections/forms.md` — projection docs
- `docs/api.md` lines 220, 490–510 — API reference table and section
- `docs/experimental.md` line 19 — experimental listing

---

## Whether it has tests

**Yes:**
- `tests/forms-projection.test.js` — 5 tests covering basic fields, booleans, literal unions, mixed unions, non-object fallback, and fresh-map-per-call
- `tests/public-api-surface.test.js` — presence and callable
- `tests/contract-core.test.js` — presence check
- `tests/public-api.test.js` — presence + no-throw check

---

## Whether it depends on a UI framework or DOM API

**No.** `src/projections/forms.js` has no imports at all — pure plain-object logic consuming the description model. No `document`, no `window`, no framework imports.

---

## Recommended scope for this block

Based on this audit, the block should:

1. **Expand `toFormConstraints()` output shape** to add `name`, `path`, and optionally `label` to each field entry, and add a `{ fields: { ... } }` wrapper to match the block spec's recommended model.
2. **Add nested object support** — currently maps to `text` fallback; should produce `{ type: 'object', fields: { ... } }`.
3. **Add array support** — produce `{ type: 'array', items: { ... } }`.
4. **Create `examples/forms/`** with the required form validation and testing examples.
5. **Create `docs/forms/`** with the required doc pages.
6. **Migrate existing tests** to the new output shape (the flat map is superseded by `{ fields }` wrapper; existing test expectations will need updating).
7. **Remove stale `@sigil/forms` forward reference** from `docs/projections/forms.md`.

**Do not:** add any UI framework, DOM dependency, HTML generation, or JSX output.
