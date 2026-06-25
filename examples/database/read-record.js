/**
 * Record Read Boundary — parse a database row into trusted data
 *
 * Shows how SigilJS validates records read from a database
 * before they enter application logic.
 *
 * No database connection. Plain objects only.
 */
import { oneOf, sigil } from '../../src/index.js';

// Define the stored record shape — includes all persisted columns
const UserRecord = sigil.exact({
  id: String,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
  createdAt: String,
  updatedAt: String,
});

// Simulate a raw row from a database adapter (untrusted)
const rowFromDatabase = {
  id: 'user_123',
  email: 'alex@example.com',
  name: 'Alex',
  role: 'user',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

// Trust boundary — validate before using in application logic
const user = UserRecord.parse(rowFromDatabase);

console.log('Trusted user id:', user.id);
console.log('Trusted user role:', user.role);
console.log('Trusted user email:', user.email);
