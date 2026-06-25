# Forms Extraction Readiness Report

**Package:** `@weipertda/sigiljs`  
**Block:** Form Constraint Contracts

---

## 1. Current package name

`@weipertda/sigiljs` — single package, no split.

---

## 2. Form examples

| File | Description |
|------|-------------|
| `examples/forms/basic-form.js` | `safeParse` + `toFormConstraints` basics |
| `examples/forms/registration-form.js` | Multi-field form with literal union |
| `examples/forms/form-safe-parse.js` | Error handling and field paths |
| `examples/forms/form-errors.js` | Path-aware error extraction |
| `examples/forms/form-mock.js` | `mock()` for form test data |
| `examples/forms/form-cases.js` | `cases()` for boundary testing |
| `examples/forms/form-contract-test.js` | `test()` for contract proof |
| `examples/forms/login-form.js` | Full five-pillar example |
| `examples/forms/checkout-form.js` | Nested address object |
| `examples/forms/settings-form.js` | Boolean toggles + preferences |
| `examples/forms/ai-generated-form-values.js` | Validating AI-generated form data |

All examples are offline, deterministic, Bun-runnable, and framework-neutral.

---

## 3. Form public APIs

`toFormConstraints()` is not independently exported from `src/index.js`. It is a method on every contract object:

```js
import { sigil } from '@weipertda/sigiljs';
const contract = sigil.exact({ name: String });
contract.toFormConstraints(); // available on any contract
```

---

## 4. Form experimental APIs

| API | Status |
|-----|--------|
| `contract.toFormConstraints()` | experimental |
| `{ fields }` wrapper shape | experimental |
| `name`, `path`, `label` per field | experimental |
| nested object `type: 'object'` | experimental |
| array `type: 'array'` | experimental |

None of the form surface is stable.

---

## 5. UI framework dependency status

**None.** `src/projections/forms.js` has no imports. Pure plain-object logic only.

---

## 6. toFormConstraints readiness

The implementation is clean and well-tested. The current shape (`{ fields: { ... } }` with `name`, `path`, `type`, `required`, `label`) is a meaningful improvement over the pre-block flat map.

The API is not ready for stabilization because:
- No real-world usage data validates the shape
- The `items` shape for arrays is minimal (only `{ type }` from the element kind)
- Metadata (`withMetadata`) is not yet used for label overrides
- No `@sigil/forms` adapter pattern has been proven

---

## 7. Testing status

| File | Tests |
|------|-------|
| `tests/forms-projection.test.js` | 5 (updated to new shape) |
| `tests/form-constraints.test.js` | 30 (new — comprehensive) |

Total form projection tests: **35**

---

## 8. Extraction blockers

| Blocker | Severity |
|---------|----------|
| No proven adapter pattern for any framework | medium |
| `items` shape for arrays is minimal | low |
| Metadata label override not implemented | low |
| No version bump from pre-block flat shape | none (experimental) |

---

## 9. Recommended future package shape

If `@sigil/forms` is eventually extracted, the recommended shape would be:

```js
// @sigil/forms (hypothetical future package)
import { toFormConstraints } from '@sigil/forms';
import { sigil } from '@weipertda/sigiljs';

const Form = sigil.exact({ name: String });
toFormConstraints(Form); // same output, separate package
```

Adapters would live in separate packages:
- `@sigil/forms-react` — React hook bindings
- `@sigil/forms-vue` — Vue composable bindings
- `@sigil/forms-svelte` — Svelte store bindings

None of these should be in core.

---

## 10. Recommendation

**Stay single package. Do not extract `@sigil/forms` yet.**

The form constraint projection is experimental and needs real usage before becoming a standalone package. The current implementation is clean and useful as a method on contract objects. The extraction would only be justified when:

1. Multiple real-world framework adapter patterns have been validated
2. The `{ fields }` shape has been stable across at least one minor release cycle
3. User demand confirms the shape is appropriate
4. A clear API boundary for a standalone package has been designed
