/**
 * Invalid Update — catches bad update payloads
 *
 * Shows how exact update contracts reject extra fields
 * and wrong-typed values before reaching the database.
 *
 * No database connection. Plain objects only.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

const UserUpdate = sigil.exact({
  name: optional(String),
  role: optional(oneOf('admin', 'user')),
  updatedAt: String,
});

const FIXED_NOW = '2026-01-01T12:00:00.000Z';

// Extra field rejected by exact mode
const withExtra = { name: 'Alex', updatedAt: FIXED_NOW, isAdmin: true };
const r1 = UserUpdate.safeParse(withExtra);
console.log('Extra field accepted:', r1.success); // false
if (!r1.success) console.log('Error:', r1.error.message);

// Bad role value
const badRole = { role: 'owner', updatedAt: FIXED_NOW };
const r2 = UserUpdate.safeParse(badRole);
console.log('Bad role accepted:', r2.success); // false
if (!r2.success) console.log('Error:', r2.error.message);

// Missing required updatedAt
const noTimestamp = { name: 'Alex' };
const r3 = UserUpdate.safeParse(noTimestamp);
console.log('Missing updatedAt accepted:', r3.success); // false
if (!r3.success) console.log('Error:', r3.error.message);
