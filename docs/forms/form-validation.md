# Form Validation

SigilJS can define the structure of form values once, then enforce, transform, project, and prove form behavior from the same contract.

Form submissions are untrusted data. `parse()` and `safeParse()` enforce the contract before your application logic sees the values.

---

## Using safeParse() for form submissions

`safeParse()` never throws. It returns `{ success: true, data }` or `{ success: false, error }`:

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const SignupForm = sigil.exact({
  name: String,
  email: String,
  plan: oneOf('free', 'pro', 'enterprise'),
  referral: optional(String),
});

const result = SignupForm.safeParse(formValues);

if (!result.success) {
  // Show validation error to the user
  const field = result.error.path?.at(-1) ?? 'form';
  showFieldError(field, result.error.message);
  return;
}

// result.data is now trusted and fully typed
await createAccount(result.data);
```

---

## Error path

`SigilValidationError.path` is an array of keys that points to the failing field:

```js
const result = SignupForm.safeParse({ name: 'Alex', plan: 'ultimate' });
// result.error.path → ['plan']
// result.error.message → 'Expected property "plan" to be "free" | "pro" | "enterprise", got ultimate'
```

---

## Using parse() — for trusted environments

`parse()` throws `SigilValidationError` on invalid input. Use it when you want the error to propagate as an exception:

```js
try {
  const trusted = SignupForm.parse(formValues);
  await createAccount(trusted);
} catch (err) {
  if (err instanceof SigilValidationError) {
    res.status(400).json({ error: err.message, field: err.path?.at(-1) });
  }
}
```

---

## FormData integration

Convert browser `FormData` to a plain object before parsing:

```js
const raw = Object.fromEntries(formData.entries());
const result = SignupForm.safeParse(raw);
```

Note: `FormData` coerces all values to strings. Use a transform to coerce numeric fields:

```js
const FormWithCoercion = SignupForm.transform((data) => ({
  ...data,
  age: data.age !== undefined ? Number(data.age) : data.age,
}));
```

---

## Exact mode for forms

Use `sigil.exact()` so extra form fields (e.g. hidden fields added by the UI) do not silently pass validation:

```js
const LoginForm = sigil.exact({ email: String, password: String });

// This will fail with exact mode — extra field rejected
LoginForm.parse({ email: 'x@x.com', password: 's', csrfToken: 'abc' });
```

Strip framework-added fields before parsing, or use a transform to exclude them explicitly.

---

## Nested form validation

Nested object contracts validate deeply, and error paths include the full field path:

```js
const ShippingAddress = sigil.exact({ city: String, country: oneOf('US', 'CA') });
const CheckoutForm = sigil.exact({ email: String, address: ShippingAddress });

const result = CheckoutForm.safeParse({
  email: 'x@x.com',
  address: { city: 'Portland', country: 'AU' }, // invalid country
});

result.error.path // → ['address', 'country']
```

---

## Limits and non-goals

SigilJS does not:
- render form elements
- provide React/Vue/Svelte/Solid components
- replace browser validation (it's a server/runtime layer)
- parse raw `FormData` strings automatically
- handle file uploads or multipart data
