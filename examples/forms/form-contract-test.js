/**
 * Form Contract Test — Using contract.test() to prove form behavior
 *
 * Shows how the Prove pillar validates form contract correctness
 * using the test() helper with valid and invalid case sets.
 *
 * Run with: bun examples/forms/form-contract-test.js
 * No framework required. No network calls.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

const ProfileForm = sigil.exact({
  displayName: String,
  bio: optional(String),
  visibility: oneOf('public', 'private'),
});

// Prove the contract with explicit cases
// test() accepts { valid: [...], invalid: [...] } — same shape as cases()
const report = ProfileForm.test({
  valid: [
    {
      label: 'complete profile',
      value: { displayName: 'Alex', bio: 'Hello!', visibility: 'public' },
    },
    {
      label: 'profile without optional bio',
      value: { displayName: 'Sam', visibility: 'private' },
    },
  ],
  invalid: [
    {
      label: 'missing displayName',
      value: { visibility: 'public' },
      expectedPath: ['displayName'],
    },
    {
      label: 'invalid visibility value',
      value: { displayName: 'Jordan', visibility: 'unlisted' },
      expectedPath: ['visibility'],
    },
    {
      label: 'extra unexpected field (exact mode)',
      value: { displayName: 'Jordan', visibility: 'public', role: 'admin' },
    },
  ],
});

console.log('Form contract test report:');
console.log(' overall success:', report.success);
console.log(' valid passed:', report.valid.passed, '/ failed:', report.valid.failed);
console.log(' invalid passed:', report.invalid.passed, '/ failed:', report.invalid.failed);
if (report.failures?.length) {
  console.log('Failures:', report.failures);
}
