/**
 * Record Cases — generate valid and invalid record cases with cases()
 *
 * Shows how cases() generates boundary test inputs for database
 * record contracts, covering valid shapes and common invalid scenarios.
 *
 * No database connection. Plain objects only.
 */
import { oneOf, sigil } from '../../src/index.js';

const UserRecord = sigil.exact({
  id: String,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
  createdAt: String,
  updatedAt: String,
});

// Generate test cases — returns { valid: [...], invalid: [...] }
const recordCases = UserRecord.cases();

console.log('Valid record cases:', recordCases.valid.length);
console.log('Invalid record cases:', recordCases.invalid.length);

// Valid cases all parse successfully
for (const c of recordCases.valid) {
  const result = UserRecord.safeParse(c.value);
  console.log(`Valid case "${c.label}": success=${result.success}`);
}

// Invalid cases all fail safeParse
for (const c of recordCases.invalid.slice(0, 4)) {
  const result = UserRecord.safeParse(c.value);
  console.log(`Invalid case "${c.label}": success=${result.success}`);
}
