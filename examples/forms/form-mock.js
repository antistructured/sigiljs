/**
 * Form Mock — Generate valid form values with mock()
 *
 * Shows how the Prove pillar generates deterministic valid form data
 * from the same contract used for enforcement.
 *
 * No framework required. No network calls.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

const RegistrationForm = sigil.exact({
  name: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});

// Generate a valid mock form submission
const mockValues = RegistrationForm.mock();
console.log('Mock form values:', mockValues);

// Verify the mock is valid — it should parse successfully
const result = RegistrationForm.safeParse(mockValues);
console.log('Mock is valid:', result.success); // true

// mock() is deterministic with a seed
const seeded1 = RegistrationForm.mock({ seed: 42 });
const seeded2 = RegistrationForm.mock({ seed: 42 });
console.log('Deterministic mock (seed 42):', seeded1);
console.log('Same result?', JSON.stringify(seeded1) === JSON.stringify(seeded2)); // true

// Generate multiple mocks
for (let i = 0; i < 3; i++) {
  const m = RegistrationForm.mock({ seed: i });
  const valid = RegistrationForm.safeParse(m);
  console.log(`Mock ${i} valid:`, valid.success, '| role:', m.role);
}
