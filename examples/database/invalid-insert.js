/**
 * Invalid Insert — shows what happens when insert input is wrong
 *
 * Extra fields, wrong types, or missing required fields are all
 * caught at the insert boundary before reaching the database.
 *
 * No database connection. Plain objects only.
 */
import { oneOf, sigil } from '../../src/index.js';

const NewUser = sigil.exact({
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});

// Extra field — exact mode rejects unknown keys
const withExtra = {
  email: 'alex@example.com',
  name: 'Alex',
  role: 'user',
  isAdmin: true, // unexpected field
};
const r1 = NewUser.safeParse(withExtra);
console.log('Extra field accepted:', r1.success); // false
if (!r1.success) console.log('Error:', r1.error.message);

// Wrong role — not in oneOf
const badRole = {
  email: 'alex@example.com',
  name: 'Alex',
  role: 'superuser',
};
const r2 = NewUser.safeParse(badRole);
console.log('Bad role accepted:', r2.success); // false
if (!r2.success) console.log('Field:', r2.error.path, '|', r2.error.message);

// Missing required field
const missingName = {
  email: 'alex@example.com',
  role: 'user',
};
const r3 = NewUser.safeParse(missingName);
console.log('Missing name accepted:', r3.success); // false
if (!r3.success) console.log('Field:', r3.error.path, '|', r3.error.message);
