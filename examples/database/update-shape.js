/**
 * Update Shape — validate partial update payloads
 *
 * Shows how SigilJS validates update/patch payloads before
 * applying them to a stored record.
 *
 * Optional fields support partial updates. updatedAt is
 * required to signal an intentional update.
 *
 * No database connection. Plain objects only.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

// Update contract — all changeable fields are optional
const UserUpdate = sigil.exact({
  name: optional(String),
  role: optional(oneOf('admin', 'user')),
  updatedAt: String, // required — signals intentional update
});

const FIXED_NOW = '2026-01-01T12:00:00.000Z';

// Full update
const fullPatch = {
  name: 'Alex W.',
  role: 'admin',
  updatedAt: FIXED_NOW,
};
const fullUpdate = UserUpdate.parse(fullPatch);
console.log('Full update:', fullUpdate);

// Partial update — only name changes
const namePatch = {
  name: 'Alexander',
  updatedAt: FIXED_NOW,
};
const nameUpdate = UserUpdate.parse(namePatch);
console.log('Partial update (name only):', nameUpdate);

// Timestamp-only update (limitation — see docs)
const timestampOnly = { updatedAt: FIXED_NOW };
const r = UserUpdate.safeParse(timestampOnly);
console.log('Timestamp-only valid:', r.success); // true — limitation: no min-fields rule
console.log('Note: SigilJS does not enforce "at least one field besides updatedAt"');
console.log('Application logic must check this if required.');
