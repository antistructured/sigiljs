# Form Contracts

SigilJS can define the structure of form values once, then enforce, transform, project, and prove form behavior from the same contract.

Forms are one of the most common places where untrusted user data enters an application. A Sigil contract turns that untrusted input into trusted runtime data before any business logic sees it.

---

## Why forms need runtime contracts

Form submissions arrive as plain objects. Fields may be missing, the wrong type, out of range, or contain values your application never expected. Browser validation helps but is not a security boundary — it runs in user-controlled code.

A runtime contract validates the submission on the server (or in a trusted runtime context) independently of the browser. The same contract also provides metadata for the form UI, test fixtures, and documentation.

---

## Define a form contract

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const SignupForm = sigil.exact({
  name: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});
```

Use `sigil.exact()` for form contracts so unexpected fields (extra keys) are rejected at the boundary.

---

## Enforce form values

### parse() — throws on invalid input

```js
const trusted = SignupForm.parse(formValues);
// trusted.name, trusted.email, trusted.role are now verified
```

### safeParse() — never throws

```js
const result = SignupForm.safeParse(formValues);

if (!result.success) {
  console.error(result.error.message);
  console.log('Failed field path:', result.error.path);
} else {
  await createUser(result.data);
}
```

`safeParse()` is the recommended form submission handler — it gives you the error without throwing.

---

## Transform form values

Chain a transform to normalize values before enforcement:

```js
const NormalizedSignup = SignupForm.transform((data) => ({
  ...data,
  email: data.email.toLowerCase().trim(),
  name: data.name.trim(),
}));

const result = NormalizedSignup.safeParse(rawFormValues);
```

The transform runs on the validated data — so transforms see a trusted, typed value.

---

## Required and optional fields

Required fields must be present and match their type.  
Optional fields can be absent or `undefined` — the constraint is not enforced if missing.

```js
const ProfileForm = sigil.exact({
  displayName: String,    // required
  bio: optional(String),  // optional
});
```

---

## Literal unions as select options

`oneOf(...)` defines an enum-like field that maps to a `<select>` in form UIs:

```js
const Form = sigil.exact({
  plan: oneOf('free', 'pro', 'enterprise'),
});

// Validates that plan is one of those values
Form.parse({ plan: 'pro' }); // ok
Form.parse({ plan: 'ultimate' }); // throws
```

---

## Nested objects

Use nested `sigil.exact()` for address blocks, profile sections, or grouped settings:

```js
const ShippingAddress = sigil.exact({
  street: String,
  city: String,
  country: oneOf('US', 'CA', 'GB'),
});

const CheckoutForm = sigil.exact({
  email: String,
  shippingAddress: ShippingAddress,
});

// Validates deeply — error paths include the nested field name
CheckoutForm.safeParse({ email: 'x@x.com', shippingAddress: { street: '1 Main', city: 'NY', country: 'ZZ' } });
// → error: path=['shippingAddress', 'country']
```

---

## Project form constraints

`toFormConstraints()` derives plain field metadata from the same contract — no extra definitions needed.

```js
const constraints = SignupForm.toFormConstraints();
// {
//   fields: {
//     name:  { name: 'name', path: ['name'], type: 'text',   required: true,  label: 'Name' },
//     email: { name: 'email', ...              type: 'text',   required: true,  label: 'Email' },
//     role:  { name: 'role', ...               type: 'select', required: true,  label: 'Role', options: ['admin', 'user'] },
//     age:   { name: 'age',  ...               type: 'number', required: false, label: 'Age' },
//   }
// }
```

This is experimental — see [Form Constraints](./form-constraints.md) for the full projection API.

---

## Limits and non-goals

SigilJS does not:
- render form elements or HTML
- provide React, Vue, Svelte, or Solid components
- replace browser-native validation (it is a server/runtime layer)
- parse `FormData` — convert it to a plain object first (`Object.fromEntries(formData)`)
- handle file uploads, multipart, or CSRF tokens

These are application or adapter responsibilities.
