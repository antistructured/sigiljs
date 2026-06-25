/**
 * Database Persistence Recipe — examples/recipes/database-persistence.js
 *
 * Shows read / insert / update / diff boundary patterns.
 * No database connection. Plain objects only. Deterministic timestamps.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

const FIXED_TS = '2026-01-01T00:00:00.000Z';
const FIXED_TS2 = '2026-01-02T00:00:00.000Z';

// ── Contracts ─────────────────────────────────────────────────────────────

const UserRecord = sigil.exact({
  id: String,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
  createdAt: String,
  updatedAt: String,
});

const NewUser = sigil.exact({
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});

const UserUpdate = sigil.exact({
  name: optional(String),
  role: optional(oneOf('admin', 'user')),
  updatedAt: String,
});

// ── Read boundary ─────────────────────────────────────────────────────────

const rowFromDatabase = {
  id: 'user_1',
  email: 'alex@example.com',
  name: 'Alex',
  role: 'user',
  createdAt: FIXED_TS,
  updatedAt: FIXED_TS,
};

const user = UserRecord.parse(rowFromDatabase);
console.log('Trusted read:', user.id, '|', user.role);

// Invalid row fails at the boundary
const badRow = { ...rowFromDatabase, role: 'owner' };
const r = UserRecord.safeParse(badRow);
console.log('Invalid row accepted:', r.success, '| field:', r.error?.path);

// ── Insert boundary ───────────────────────────────────────────────────────

const input = { email: 'dana@example.com', name: 'Dana', role: 'admin' };
const validated = NewUser.parse(input);

// Application layer adds generated fields
const rowToInsert = { id: 'user_2', ...validated, createdAt: FIXED_TS, updatedAt: FIXED_TS };
console.log('Row to insert:', rowToInsert);

// Extra field rejected at insert boundary
const withExtra = { ...input, id: 'user_leaked' };
const insertBad = NewUser.safeParse(withExtra);
console.log('Extra field in insert:', insertBad.success); // false

// ── Update boundary ───────────────────────────────────────────────────────

const patch = { name: 'Dana K.', updatedAt: FIXED_TS2 };
const update = UserUpdate.parse(patch);
console.log('Partial update:', update);
console.log('Role in patch:', update.role); // undefined — not changed

// ── Contract diff ─────────────────────────────────────────────────────────

const OldRecord = sigil.exact({ id: String, email: String, name: String });
const NewRecord = sigil.exact({ id: String, email: String, name: String, role: oneOf('admin', 'user') });

const changes = OldRecord.diff(NewRecord);
console.log('Schema changes:', changes.length);
for (const c of changes) {
  console.log(` [${c.impact}] ${c.kind} at path:`, c.path.join('.'));
}

// Old row fails against new schema
const oldRowVsNewSchema = NewRecord.safeParse(rowFromDatabase);
console.log('Old row valid against new schema:', oldRowVsNewSchema.success);

// ── Prove ─────────────────────────────────────────────────────────────────

const fixture = UserRecord.mock({ seed: 1 });
console.log('Mock fixture:', fixture);

const report = UserRecord.test(UserRecord.cases());
console.log('Contract proof success:', report.success);
console.log('  valid passed:', report.valid.passed, '| invalid passed:', report.invalid.passed);
