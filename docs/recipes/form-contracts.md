# Form Contracts

Define structure once. Project it everywhere.

## 1. Boundary problem

A form submit is unknown data from a user-controlled boundary. Enforce the contract object before using the values in application logic.

## 2. Sigil contract

```js
import { oneOf, optional, sigil } from 'sigil';

const SignupForm = sigil.exact({
  name: String,
  email: String,
  age: optional(Number),
  plan: oneOf('free', 'team', 'enterprise'),
});
```

## 3. Unknown input

```js
const unknownForm = Object.fromEntries(formData.entries());
```

## 4. Enforcement using parse/safeParse/assert

```js
const result = SignupForm.safeParse(unknownForm);

if (!result.success) {
  showFormError(result.error);
  return;
}
```

## 5. Trusted output

```js
await createSignup(result.data);
```

## 6. Optional projection

```js
const formProjection = SignupForm.toFormConstraints();
```
