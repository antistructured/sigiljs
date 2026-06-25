/**
 * Form Submission Recipe — examples/recipes/form-submission.js
 *
 * Shows form value validation + form constraint projection.
 * No browser DOM. No framework. Plain objects only.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

// ── Contract ──────────────────────────────────────────────────────────────

const RegistrationForm = sigil.exact({
  name: String,
  email: String,
  plan: oneOf('free', 'pro', 'enterprise'),
  referral: optional(String),
});

// ── Handler ───────────────────────────────────────────────────────────────

function handleRegistration(formValues) {
  const result = RegistrationForm.safeParse(formValues);

  if (!result.success) {
    return {
      ok: false,
      field: result.error.path?.at(-1) ?? 'unknown',
      message: result.error.message,
    };
  }

  return { ok: true, data: result.data };
}

// ── Enforce ───────────────────────────────────────────────────────────────

const ok = handleRegistration({
  name: 'Alex',
  email: 'alex@example.com',
  plan: 'pro',
});
console.log('Valid submission:', ok.ok, '| data:', ok.data);

const missingEmail = handleRegistration({ name: 'Alex', plan: 'pro' });
console.log('Missing email:', missingEmail.ok, '| field:', missingEmail.field);

const badPlan = handleRegistration({
  name: 'Alex',
  email: 'alex@example.com',
  plan: 'ultimate',
});
console.log('Bad plan:', badPlan.ok, '| field:', badPlan.field);

const extraField = handleRegistration({
  name: 'Alex',
  email: 'alex@example.com',
  plan: 'free',
  isAdmin: true,
});
console.log('Extra field:', extraField.ok);

// ── Project (experimental) ────────────────────────────────────────────────

const constraints = RegistrationForm.toFormConstraints();
console.log('\nForm field types:');
for (const [key, field] of Object.entries(constraints.fields)) {
  const opts = field.options ? ` options=[${field.options.join('|')}]` : '';
  console.log(` ${key}: type=${field.type}${opts}, required=${field.required}`);
}

// ── Prove ─────────────────────────────────────────────────────────────────

const fixture = RegistrationForm.mock({ seed: 1 });
console.log('\nMock fixture:', fixture);

const { valid, invalid } = RegistrationForm.cases();
console.log('Valid cases:', valid.length, '| Invalid cases:', invalid.length);

const report = RegistrationForm.test(RegistrationForm.cases());
console.log('Contract proof success:', report.success);
