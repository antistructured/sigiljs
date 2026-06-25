/**
 * Partial Update — optional fields in update contracts
 *
 * Shows different partial update scenarios: updating one field,
 * multiple fields, and how optional fields in the update contract
 * support flexible partial patches.
 *
 * No database connection. Plain objects only.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

const UserUpdate = sigil.exact({
  name: optional(String),
  role: optional(oneOf('admin', 'user')),
  updatedAt: String,
});

const PostUpdate = sigil.exact({
  title: optional(String),
  status: optional(oneOf('draft', 'published', 'archived')),
  tags: optional(Array),
  updatedAt: String,
});

const FIXED_NOW = '2026-01-02T00:00:00.000Z';

// Patch only the name
const nameOnly = UserUpdate.parse({ name: 'Dana Kim', updatedAt: FIXED_NOW });
console.log('Name patch:', nameOnly);
console.log('Role in patch:', nameOnly.role); // undefined — not included

// Patch only the role
const roleOnly = UserUpdate.parse({ role: 'admin', updatedAt: FIXED_NOW });
console.log('Role patch:', roleOnly);
console.log('Name in patch:', roleOnly.name); // undefined

// Multi-field post update
const postPatch = PostUpdate.parse({
  status: 'published',
  tags: ['contracts', 'sigil'],
  updatedAt: FIXED_NOW,
});
console.log('Post patch:', postPatch);

// Applying a patch to an existing record (application layer)
const existingUser = {
  id: 'user_123',
  email: 'alex@example.com',
  name: 'Alex',
  role: 'user',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

// Only spread defined patch fields (application layer's job)
const patchFields = Object.fromEntries(
  Object.entries(nameOnly).filter(([, v]) => v !== undefined),
);
const updatedRecord = { ...existingUser, ...patchFields };
console.log('Updated record name:', updatedRecord.name);
console.log('Updated record role:', updatedRecord.role); // still 'user'
