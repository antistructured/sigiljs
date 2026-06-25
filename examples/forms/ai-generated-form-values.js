/**
 * AI-Generated Form Values — Validate uncertain AI output before use
 *
 * AI structured output is untrusted until parsed through a contract.
 * This example shows how to validate AI-generated form data using
 * the same contract that defines the form structure.
 *
 * No provider SDK. No network calls. No framework required.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

// Define the form contract once — used for AI output AND user submissions
const UserProfileForm = sigil.exact({
  displayName: String,
  email: String,
  role: oneOf('admin', 'editor', 'viewer'),
  bio: optional(String),
});

// Simulate AI-generated form values (as if an LLM filled in the form)
// AI output is untrusted — it may be missing fields, have wrong types, or invented values.
const aiOutputs = [
  // Well-formed AI response
  {
    displayName: 'Dana Kim',
    email: 'dana@example.com',
    role: 'editor',
    bio: 'Product designer turned developer.',
  },
  // AI hallucinated an invalid role
  {
    displayName: 'Alex',
    email: 'alex@example.com',
    role: 'superuser', // not in oneOf
  },
  // AI omitted required field
  {
    email: 'sam@example.com',
    role: 'viewer',
    // displayName missing
  },
  // AI returned a number where a string was expected
  {
    displayName: 42,
    email: 'j@example.com',
    role: 'admin',
  },
];

console.log('Validating AI-generated form values:\n');
for (const [i, aiOutput] of aiOutputs.entries()) {
  const result = UserProfileForm.safeParse(aiOutput);
  if (result.success) {
    console.log(`[${i + 1}] TRUSTED: ${result.data.displayName} <${result.data.email}> (${result.data.role})`);
  } else {
    const field = result.error.path?.at(-1) ?? 'unknown';
    console.log(`[${i + 1}] REJECTED: field="${field}" — ${result.error.message}`);
  }
}

// The same contract can be projected for form UI hints
const constraints = UserProfileForm.toFormConstraints();
console.log('\nForm field types (from same contract):');
for (const field of Object.values(constraints.fields)) {
  const opts = field.options ? ` options=${JSON.stringify(field.options)}` : '';
  console.log(` ${field.name}: type=${field.type}${opts}`);
}
