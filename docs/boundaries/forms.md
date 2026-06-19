# Form boundaries

Form inputs arrive as plain objects or form values from a UI framework.
The fields may be missing, empty, or typed incorrectly.
A contract turns those submissions into trusted data before business logic sees them.

Use `parse()` for normal submissions and `safeParse()` when you need
to return field-level validation feedback to a UI layer.

Use exact contracts for forms so an extra or unexpected field cannot
slip through unchanged.

## Recommended style

```js
const SignupForm = sigil.exact({
  name: String,
  email: String,
  password: String,
  age: optional(Number),
});
```

## Submit handler

```js
const raw = Object.fromEntries(formData.entries());
const signup = SignupForm.parse(raw);
```

## Validation feedback

```js
const result = SignupForm.safeParse(raw);

if (!result.success) {
  return {
    ok: false,
    fieldError: result.error.path.at(-1),
  };
}
```

Form boundaries are useful for:

- contact forms
- account creation
- preference updates
- admin mutation buttons
- CSV import rows mapped into object fields
