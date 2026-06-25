/**
 * Record Mock — generate valid record fixtures with mock()
 *
 * Shows how mock() generates deterministic contract-valid fixtures
 * for database records. These fixtures are useful for tests.
 *
 * Your app/database layer still owns IDs, timestamps, and persistence.
 * mock() produces type-correct values — not semantically meaningful ones.
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

// Generate a valid fixture
const fixture = UserRecord.mock({ seed: 1 });
console.log('Generated fixture:', fixture);

// Fixture passes the record contract
const result = UserRecord.safeParse(fixture);
console.log('Fixture is valid:', result.success); // true

// Deterministic — same seed always gives the same result
const a = UserRecord.mock({ seed: 42 });
const b = UserRecord.mock({ seed: 42 });
console.log('Deterministic (seed 42):', JSON.stringify(a) === JSON.stringify(b)); // true

// Different seeds give different results
const c = UserRecord.mock({ seed: 1 });
const d = UserRecord.mock({ seed: 2 });
console.log('Seed 1 role:', c.role, '| Seed 2 role:', d.role);

// Generate several fixtures for a test suite
console.log('\nGenerating 3 fixtures for test suite:');
for (let i = 0; i < 3; i++) {
  const f = UserRecord.mock({ seed: i });
  console.log(` Fixture ${i}: id=${f.id}, role=${f.role}`);
}
