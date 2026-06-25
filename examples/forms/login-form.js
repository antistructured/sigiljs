/**
 * Login Form — Full five-pillar example
 *
 * Define → Enforce → Transform → Project → Prove
 *
 * No framework required. No DOM required. No network calls.
 */
import { sigil } from '../../src/index.js';

// Define
const LoginForm = sigil.exact({
  email: String,
  password: String,
});

// Enforce — validate a login submission
const raw = { email: 'dana@example.com', password: 'correct-horse-battery-staple' };
const result = LoginForm.safeParse(raw);

if (result.success) {
  console.log('Login accepted:', result.data.email);
} else {
  console.error('Login rejected:', result.error.message);
}

// Transform — normalize email before enforcement
const withNormalizedEmail = LoginForm.transform((data) => ({
  ...data,
  email: data.email.toLowerCase().trim(),
}));

const normalizedResult = withNormalizedEmail.safeParse({
  email: '  Dana@Example.COM  ',
  password: 'my-password',
});
console.log('Normalized email:', normalizedResult.data?.email);

// Project — what form fields does this contract describe?
const constraints = LoginForm.toFormConstraints();
console.log('Form fields:');
for (const field of Object.values(constraints.fields)) {
  console.log(` ${field.label}: type=${field.type}, required=${field.required}`);
}

// Prove — generate valid test cases for the login form
const cases = LoginForm.cases();
console.log('Valid test cases:', cases.valid.length);
console.log('Invalid test cases:', cases.invalid.length);

const proofReport = LoginForm.test({
  valid: [
    { label: 'valid credentials', value: { email: 'alex@example.com', password: 'secret' } },
  ],
  invalid: [
    { label: 'missing password', value: { email: 'alex@example.com' }, expectedPath: ['password'] },
    { label: 'missing email', value: { password: 'secret' }, expectedPath: ['email'] },
  ],
});
console.log('Proof — all passed:', proofReport.success);
