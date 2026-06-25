/**
 * Normalized Insert — normalize before writing with transform() + parse()
 *
 * Shows how transform() normalizes insert data before the
 * application layer writes it. parse() applies transforms
 * and validates in one step.
 *
 * No database connection. Plain objects only.
 */
import { oneOf, sigil } from '../../src/index.js';

const NewUser = sigil.exact({
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});

// Add a transform that normalizes email before storage
const NormalizedNewUser = NewUser.transform((data) => ({
  ...data,
  email: data.email.toLowerCase().trim(),
  name: data.name.trim(),
}));

const rawInput = {
  email: '  Alex@Example.COM  ',
  name: '  Alex  ',
  role: 'user',
};

// parse() validates AND applies transforms
const normalized = NormalizedNewUser.parse(rawInput);
console.log('Normalized email:', normalized.email); // alex@example.com
console.log('Normalized name:', normalized.name);   // Alex

const FIXED_NOW = '2026-01-01T00:00:00.000Z';
const rowToInsert = {
  id: 'user_xyz789',
  ...normalized,
  createdAt: FIXED_NOW,
  updatedAt: FIXED_NOW,
};
console.log('Row to insert:', rowToInsert);
