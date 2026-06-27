# Form Constraint Trial

**Block:** Real-World Usage Trial  
**Pass:** 7 — Form Constraint Trial  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Trial Files

- `trials/form-constraints/registration-form.js`
- `trials/form-constraints/settings-form.js`
- `trials/form-constraints/README.md`

---

## Commands Run

```bash
bun run trials/form-constraints/registration-form.js
bun run trials/form-constraints/settings-form.js
```

Result: **pass**

---

## Coverage

The trial exercised:

- `safeParse()` submitted form values
- path-aware errors for invalid submissions
- experimental `toFormConstraints()`
- `mock()` valid form values
- `cases()` invalid generated submissions
- `test()` proof reports
- nested form paths
- literal options for select-like fields

---

## Findings

### What Felt Good

- `safeParse()` maps naturally to form submission handling.
- Error paths are sufficient for field-level error routing.
- `toFormConstraints()` provides useful field names, paths, required flags, nested fields, and literal options.
- No UI framework is needed to validate the core workflow.

### Friction

- Constraint metadata is useful but minimal; a UI adapter would still need labels, widgets, help text, autocomplete, min/max length, and semantic formats from application metadata.
- Nested object constraints are inspectable, but UI flattening is left entirely to the application.
- `mock()` output is structurally valid but not realistic for form previews.
- Field-level validation messages are not projected into constraints; applications still derive messages from validation errors.

---

## Experimental Status

`toFormConstraints()` should remain experimental. It is useful as a generic projection, but real UI adapter usage is still needed before freezing the shape.

---

## Blocker Assessment

No stable-core blocker found.

Form constraints are promising but should not be stabilized before real UI/framework adapter evidence.
