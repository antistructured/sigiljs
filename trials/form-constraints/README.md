# Form Constraint Trial

Form validation and experimental constraint projection trials.

## Run

```bash
bun run trials/form-constraints/registration-form.js
bun run trials/form-constraints/settings-form.js
```

## What this validates

- `safeParse()` submitted form values
- path-aware form errors
- experimental `toFormConstraints()`
- structurally valid mock form values
- invalid generated submissions through `cases()`
- proof reports through `test()`

No UI framework dependency is required. `toFormConstraints()` remains experimental.
