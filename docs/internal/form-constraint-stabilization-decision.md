# toFormConstraints() Stabilization Decision

**Block:** Form Constraint Contracts  
**Task:** 3 — toFormConstraints() Stabilization Decision

---

## Decision: Option A — Keep experimental

`toFormConstraints()` will be kept as an experimental method on all contract objects.

It will not be:
- stabilized (too early — shape changes are happening in this block)
- moved to internal only (it is already public and useful)
- deferred (already implemented)

---

## Rationale

- Forms vary too much across frameworks and apps to freeze the projection API now.
- The output shape is changing in this block (adding `{ fields }` wrapper, `name`, `path`, `label`, nested objects, arrays) — making it stable before these changes are proven would be premature.
- The existing experimental status in `docs/api.md` and `docs/experimental.md` is correct and should remain.
- The method is useful enough to keep public and tested.

---

## Recommended API shape

```js
contract.toFormConstraints()
```

Returns:

```js
{
  fields: {
    [fieldName]: {
      name:     string,
      path:     string[],
      type:     'text' | 'number' | 'checkbox' | 'select' | 'object' | 'array',
      required: boolean,
      label:    string,
      options?: (string | number)[],   // for 'select' type
      accepts?: string[],              // for mixed unions
      fields?:  { ... },              // for 'object' type
      items?:   FieldConstraint,       // for 'array' type
    },
    ...
  }
}
```

Non-object contracts return `{ fields: {} }`.

---

## Marking

Mark as `@experimental` in:
- `src/projections/forms.js` — JSDoc on `projectFormConstraints`
- `docs/api.md` — already marked; update signature example after Task 4
- `docs/experimental.md` — already listed; update method description after Task 4
- `docs/projections/forms.md` — already has status notice; update after Task 4

---

## What would justify stabilization

- The `{ fields }` wrapper shape, `name`, `path`, `label`, nested, and array behavior have been proven across multiple real usage patterns.
- At least one minor release cycle with no breaking changes to the returned object shape.
- No outstanding open questions about how nested objects or optional arrays should be represented.
- User demand confirms the shape is appropriate for real form-building scenarios.

---

## What would justify adding new exported helpers

- A clear need for a `formContract()` builder (analogous to `httpContract()`) that combines a contract with submit handler and field-level error projection.
- User demand for a `toHTMLInputProps()` or `toReactFormProps()` style projection — but these would live in separate adapter packages, not core.

Until then, keep the surface minimal and method-only.
