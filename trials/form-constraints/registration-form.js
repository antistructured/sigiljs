import { oneOf, optional, sigil } from '../../src/index.js';

const RegistrationForm = sigil.exact({
  email: String,
  password: String,
  plan: oneOf('free', 'pro', 'enterprise'),
  referralCode: optional(String),
});

const submitted = { email: 'dana@example.com', password: 'secret-123', plan: 'pro' };
const valid = RegistrationForm.safeParse(submitted);
const invalid = RegistrationForm.safeParse({ email: 'dana@example.com', password: 123, plan: 'team' });
const constraints = RegistrationForm.toFormConstraints();
const mock = RegistrationForm.mock({ includeOptional: true });
const cases = RegistrationForm.cases({ includeOptional: true });
const report = RegistrationForm.test(cases);

if (!valid.success) throw valid.error;
if (invalid.success) throw new Error('expected invalid form submission');
if (!RegistrationForm.check(mock)) throw new Error('mock form should be valid');
if (!report.success) throw new Error('form generated cases should pass');

console.log(JSON.stringify({
  data: valid.data,
  invalidPath: invalid.error.path,
  fieldNames: Object.keys(constraints.fields),
  planOptions: constraints.fields.plan.options,
  mock,
  caseCounts: { valid: cases.valid.length, invalid: cases.invalid.length },
  report: report.success,
}, null, 2));
