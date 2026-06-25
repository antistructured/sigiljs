/**
 * Invalid Record — parse fails on a malformed database row
 *
 * Shows what happens when a database row has a bad shape:
 * unexpected role value, missing field, or wrong type.
 *
 * No database connection. Plain objects only.
 */
import { oneOf, SigilValidationError, sigil } from '../../src/index.js';

const UserRecord = sigil.exact({
  id: String,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
  createdAt: String,
  updatedAt: String,
});

// Invalid role — 'owner' is not in the oneOf contract
const badRow = {
  id: 'user_123',
  email: 'alex@example.com',
  name: 'Alex',
  role: 'owner',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

try {
  UserRecord.parse(badRow);
} catch (err) {
  if (err instanceof SigilValidationError) {
    console.log('Parse failed — bad role value');
    console.log('Field path:', err.path);
    console.log('Message:', err.message);
  }
}

// Missing required field
const missingField = {
  id: 'user_456',
  email: 'sam@example.com',
  // name is missing
  role: 'user',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const result = UserRecord.safeParse(missingField);
console.log('Missing field — success:', result.success);
if (!result.success) {
  console.log('Field path:', result.error.path);
  console.log('Message:', result.error.message);
}
