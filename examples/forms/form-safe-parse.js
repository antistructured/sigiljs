/**
 * Form Safe Parse — Error handling example
 *
 * Shows how safeParse() handles invalid form data without throwing,
 * and how to extract field-level error context for UI feedback.
 *
 * No framework required. No DOM required. No network calls.
 */
import { optional, oneOf, sigil } from '../../src/index.js';

const ProfileForm = sigil.exact({
  username: String,
  email: String,
  plan: oneOf('free', 'pro', 'enterprise'),
  bio: optional(String),
});

// Missing required field
const missingEmail = { username: 'dana', plan: 'free' };
const r1 = ProfileForm.safeParse(missingEmail);
console.log('Missing email success:', r1.success); // false
if (!r1.success) {
  console.log('Error:', r1.error.message);
  if (r1.error.path?.length) {
    console.log('Field path:', r1.error.path.join('.'));
  }
}

// Invalid enum value
const badPlan = { username: 'dana', email: 'dana@example.com', plan: 'ultimate' };
const r2 = ProfileForm.safeParse(badPlan);
console.log('Bad plan success:', r2.success); // false

// Extra field (exact mode rejects unknown keys)
const extraField = {
  username: 'dana',
  email: 'dana@example.com',
  plan: 'pro',
  unexpectedField: 'hello',
};
const r3 = ProfileForm.safeParse(extraField);
console.log('Extra field success:', r3.success); // false

// Fully valid submission
const valid = { username: 'dana', email: 'dana@example.com', plan: 'pro' };
const r4 = ProfileForm.safeParse(valid);
console.log('Valid success:', r4.success); // true
if (r4.success) {
  console.log('Trusted data:', r4.data);
}
