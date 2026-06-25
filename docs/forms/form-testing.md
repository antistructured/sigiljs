# Form Testing

SigilJS can define the structure of form values once, then enforce, transform, project, and prove form behavior from the same contract.

The **Prove** pillar provides `mock()`, `cases()`, and `test()` — deterministic, offline tools for proving form contracts behave correctly.

---

## mock() — Generate valid form values

`mock()` generates a valid, deterministic form submission from the contract:

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const RegistrationForm = sigil.exact({
  name: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});

const mockValues = RegistrationForm.mock();
// { name: 'string', email: 'string', role: 'admin' }

// The mock always parses successfully
const result = RegistrationForm.safeParse(mockValues);
console.log(result.success); // true
```

Use a seed for deterministic output:

```js
const mock1 = RegistrationForm.mock({ seed: 42 });
const mock2 = RegistrationForm.mock({ seed: 42 });
// mock1 deep-equals mock2
```

---

## cases() — Generate valid and invalid test cases

`cases()` returns `{ valid: [...], invalid: [...] }` — structured test inputs covering typical valid and invalid boundary scenarios:

```js
const formCases = RegistrationForm.cases();

// Valid cases should all parse successfully
for (const c of formCases.valid) {
  const result = RegistrationForm.safeParse(c.value);
  console.log(c.label, '→', result.success); // true
}

// Invalid cases should all fail safeParse
for (const c of formCases.invalid) {
  const result = RegistrationForm.safeParse(c.value);
  console.log(c.label, '→', result.success); // false
}
```

---

## test() — Run a contract proof

`test()` accepts `{ valid, invalid }` case arrays and returns a summary report:

```js
const report = RegistrationForm.test({
  valid: [
    { label: 'complete form', value: { name: 'Alex', email: 'a@b.com', role: 'user' } },
    { label: 'with optional age', value: { name: 'Sam', email: 's@b.com', role: 'admin', age: 30 } },
  ],
  invalid: [
    { label: 'missing name', value: { email: 'a@b.com', role: 'user' }, expectedPath: ['name'] },
    { label: 'bad role', value: { name: 'Alex', email: 'a@b.com', role: 'owner' }, expectedPath: ['role'] },
  ],
});

console.log(report.success);         // true if all cases matched expectations
console.log(report.valid.passed);    // number of passing valid cases
console.log(report.invalid.passed);  // number of passing invalid cases
console.log(report.failures);        // any unexpected results
```

---

## Using cases() inside a Bun test

```js
import { test, expect, describe } from 'bun:test';
import { RegistrationForm } from './contracts.js';

describe('RegistrationForm contract', () => {
  const { valid, invalid } = RegistrationForm.cases();

  for (const c of valid) {
    test(`valid case: ${c.label}`, () => {
      expect(RegistrationForm.safeParse(c.value).success).toBe(true);
    });
  }

  for (const c of invalid) {
    test(`invalid case: ${c.label}`, () => {
      expect(RegistrationForm.safeParse(c.value).success).toBe(false);
    });
  }
});
```

---

## Testing form constraints projection

Test the `toFormConstraints()` projection directly:

```js
import { test, expect } from 'bun:test';

test('signup form has select field for role', () => {
  const { fields } = RegistrationForm.toFormConstraints();
  expect(fields.role.type).toBe('select');
  expect(fields.role.options).toEqual(['admin', 'user']);
});

test('age field is optional', () => {
  const { fields } = RegistrationForm.toFormConstraints();
  expect(fields.age.required).toBe(false);
});
```

---

## Non-goals

- These helpers do not require a browser or DOM.
- `mock()` does not generate semantically meaningful values (e.g. valid email addresses) — only type-correct values.
- `cases()` generates edge-case boundary inputs, not exhaustive fuzzing.
- No network calls are made by any of these helpers.
