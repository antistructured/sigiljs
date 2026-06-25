# Form Submission Recipe

**Boundary:** User form values → application logic

SigilJS validates form values before your application sees them. The same contract also projects into form field metadata.

---

## Problem

Form submissions arrive as unknown plain objects. Required fields may be missing, values may have wrong types, and enum fields may contain invalid values.

---

## Contract

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const RegistrationForm = sigil.exact({
  name: String,
  email: String,
  plan: oneOf('free', 'pro', 'enterprise'),
  referral: optional(String),
});
```

---

## Boundary

```
Browser form submit (unknown plain object)
↓ RegistrationForm.safeParse()   ← trust boundary
↓ trusted form data
→ application logic
```

---

## Implementation

```js
function handleRegistration(formValues) {
  const result = RegistrationForm.safeParse(formValues);

  if (!result.success) {
    return {
      ok: false,
      field: result.error.path?.at(-1) ?? 'unknown',
      message: result.error.message,
    };
  }

  return {
    ok: true,
    data: result.data,
  };
}
```

---

## Validation

```js
// Valid submission
const ok = handleRegistration({ name: 'Alex', email: 'a@x.com', plan: 'pro' });
// { ok: true, data: { name: 'Alex', email: 'a@x.com', plan: 'pro' } }

// Missing required field
const bad1 = handleRegistration({ name: 'Alex', plan: 'pro' });
// { ok: false, field: 'email', message: '...' }

// Invalid plan
const bad2 = handleRegistration({ name: 'Alex', email: 'a@x.com', plan: 'ultimate' });
// { ok: false, field: 'plan', message: '...' }

// Extra field rejected (exact mode)
const bad3 = handleRegistration({ name: 'Alex', email: 'a@x.com', plan: 'free', isAdmin: true });
// { ok: false, field: ... }
```

---

## Projection (experimental)

`toFormConstraints()` projects field metadata for form UI hints:

```js
const constraints = RegistrationForm.toFormConstraints();
// {
//   fields: {
//     name:     { name: 'name', type: 'text', required: true, label: 'Name' },
//     email:    { name: 'email', type: 'text', required: true, label: 'Email' },
//     plan:     { name: 'plan', type: 'select', required: true, options: ['free','pro','enterprise'] },
//     referral: { name: 'referral', type: 'text', required: false, label: 'Referral' },
//   }
// }
```

`toFormConstraints()` is experimental — see [`docs/projections/forms.md`](../projections/forms.md).

---

## Prove

```js
const fixture = RegistrationForm.mock({ seed: 1 });
const { valid, invalid } = RegistrationForm.cases();
const report = RegistrationForm.test(RegistrationForm.cases());
```

---

## Run it

```bash
bun run examples/recipes/form-submission.js
```

---

## Limits

- No browser DOM or `FormData` is required — convert `FormData` to a plain object first: `Object.fromEntries(formData.entries())`.
- No React/Vue/Svelte/Solid required.
- `toFormConstraints()` is experimental and the shape may change before 1.0.0.
- String coercion from `FormData` (all values are strings) must be handled by the application before parsing.
