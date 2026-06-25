/**
 * Form Cases — Generate valid and invalid form cases with cases()
 *
 * Shows how cases() produces structured test inputs for a form contract,
 * including both valid and invalid boundary cases.
 *
 * No framework required. No network calls.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

const SignupForm = sigil.exact({
  username: String,
  email: String,
  plan: oneOf('free', 'pro', 'enterprise'),
  referral: optional(String),
});

// Generate test cases — returns { valid: [...], invalid: [...] }
const formCases = SignupForm.cases();
console.log('Valid cases:', formCases.valid.length);
console.log('Invalid cases:', formCases.invalid.length);

// Valid cases parse successfully
for (const c of formCases.valid.slice(0, 3)) {
  const r = SignupForm.safeParse(c.value);
  console.log(`Valid case "${c.label}": success=${r.success}`, r.success ? `| plan=${r.data.plan}` : '');
}

// Invalid cases fail safeParse
for (const c of formCases.invalid.slice(0, 3)) {
  const r = SignupForm.safeParse(c.value);
  console.log(`Invalid case "${c.label}": success=${r.success}`);
}
