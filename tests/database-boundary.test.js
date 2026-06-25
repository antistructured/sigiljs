/**
 * Task 8 — Database Boundary Tests
 *
 * Proves database boundary behavior through direct Sigil contract usage.
 * No database connection. No database dependencies. No network calls.
 * All tests are deterministic and offline.
 */
import { describe, test, expect } from 'bun:test';
import { oneOf, optional, sigil, SigilValidationError } from '../src/index.js';

const FIXED_TS = '2026-01-01T00:00:00.000Z';
const FIXED_TS2 = '2026-01-02T00:00:00.000Z';

// Shared contracts used across test groups
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

const validRow = () => ({
  id: 'user_1',
  email: 'alex@example.com',
  name: 'Alex',
  role: 'user',
  createdAt: FIXED_TS,
  updatedAt: FIXED_TS,
});

// ─── Record read boundary ─────────────────────────────────────────────────

describe('Database boundary — record read', () => {
  test('valid database record parses successfully', () => {
    const result = UserRecord.parse(validRow());
    expect(result.id).toBe('user_1');
    expect(result.email).toBe('alex@example.com');
    expect(result.role).toBe('user');
  });

  test('invalid role value fails parse', () => {
    const badRow = { ...validRow(), role: 'owner' };
    expect(() => UserRecord.parse(badRow)).toThrow();
  });

  test('record safeParse returns success on valid row', () => {
    const result = UserRecord.safeParse(validRow());
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Alex');
  });

  test('record safeParse returns failure on invalid row', () => {
    const result = UserRecord.safeParse({ ...validRow(), role: 'owner' });
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test('invalid role failure path points to role field', () => {
    const result = UserRecord.safeParse({ ...validRow(), role: 'superuser' });
    expect(result.success).toBe(false);
    expect(result.error.path).toEqual(['role']);
  });

  test('missing required field fails with path', () => {
    const { name: _name, ...withoutName } = validRow();
    const result = UserRecord.safeParse(withoutName);
    expect(result.success).toBe(false);
    expect(result.error.path).toEqual(['name']);
  });

  test('extra column rejected by exact mode', () => {
    const withExtra = { ...validRow(), internalFlag: true };
    expect(() => UserRecord.parse(withExtra)).toThrow();
  });

  test('parse throws SigilValidationError on invalid row', () => {
    const badRow = { ...validRow(), email: 42 };
    try {
      UserRecord.parse(badRow);
      expect(true).toBe(false); // should not reach
    } catch (err) {
      expect(err).toBeInstanceOf(SigilValidationError);
    }
  });
});

// ─── Insert shape boundary ────────────────────────────────────────────────

describe('Database boundary — insert shape', () => {
  test('valid insert shape parses successfully', () => {
    const input = { email: 'dana@example.com', name: 'Dana', role: 'user' };
    const validated = NewUser.parse(input);
    expect(validated.email).toBe('dana@example.com');
    expect(validated.role).toBe('user');
  });

  test('insert with invalid role fails', () => {
    const input = { email: 'dana@example.com', name: 'Dana', role: 'superuser' };
    expect(() => NewUser.parse(input)).toThrow();
  });

  test('insert with missing required field fails', () => {
    const input = { email: 'dana@example.com', role: 'user' }; // name missing
    const result = NewUser.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error.path).toEqual(['name']);
  });

  test('insert with extra field rejected by exact mode', () => {
    const input = {
      email: 'dana@example.com',
      name: 'Dana',
      role: 'user',
      id: 'user_999', // generated field leaked into insert
    };
    const result = NewUser.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('validated insert does not include generated fields', () => {
    const input = { email: 'dana@example.com', name: 'Dana', role: 'user' };
    const validated = NewUser.parse(input);
    expect(Object.hasOwn(validated, 'id')).toBe(false);
    expect(Object.hasOwn(validated, 'createdAt')).toBe(false);
  });
});

// ─── Update shape boundary ────────────────────────────────────────────────

describe('Database boundary — update shape', () => {
  test('valid full update parses successfully', () => {
    const patch = { name: 'Alex W.', role: 'admin', updatedAt: FIXED_TS2 };
    const update = UserUpdate.parse(patch);
    expect(update.name).toBe('Alex W.');
    expect(update.role).toBe('admin');
  });

  test('partial update with only name is valid', () => {
    const patch = { name: 'Alexander', updatedAt: FIXED_TS2 };
    const update = UserUpdate.parse(patch);
    expect(update.name).toBe('Alexander');
    expect(update.role).toBeUndefined();
  });

  test('partial update with only role is valid', () => {
    const patch = { role: 'admin', updatedAt: FIXED_TS2 };
    const update = UserUpdate.parse(patch);
    expect(update.role).toBe('admin');
    expect(update.name).toBeUndefined();
  });

  test('update missing updatedAt fails', () => {
    const patch = { name: 'Alex' }; // missing updatedAt
    const result = UserUpdate.safeParse(patch);
    expect(result.success).toBe(false);
  });

  test('update with invalid role fails', () => {
    const patch = { role: 'superuser', updatedAt: FIXED_TS2 };
    const result = UserUpdate.safeParse(patch);
    expect(result.success).toBe(false);
    expect(result.error.path).toEqual(['role']);
  });

  test('update with extra field rejected by exact mode', () => {
    const patch = { updatedAt: FIXED_TS2, isAdmin: true };
    const result = UserUpdate.safeParse(patch);
    expect(result.success).toBe(false);
  });

  test('timestamp-only update is valid (documented limitation)', () => {
    // SigilJS has no "at least one optional field" constraint
    const patch = { updatedAt: FIXED_TS2 };
    const result = UserUpdate.safeParse(patch);
    expect(result.success).toBe(true); // limitation — app logic must enforce
  });
});

// ─── Contract diff ────────────────────────────────────────────────────────

describe('Database boundary — contract diff', () => {
  const OldRecord = sigil.exact({ id: String, name: String });
  const NewRecord = sigil.exact({ id: String, name: String, role: oneOf('admin', 'user') });

  test('diff detects added field', () => {
    const diff = OldRecord.diff(NewRecord);
    expect(diff.length).toBeGreaterThan(0);
  });

  test('diff result includes path information', () => {
    const diff = OldRecord.diff(NewRecord);
    const entry = diff[0];
    expect(entry.path).toBeDefined();
    expect(Array.isArray(entry.path)).toBe(true);
  });

  test('diff result includes impact', () => {
    const diff = OldRecord.diff(NewRecord);
    for (const entry of diff) {
      expect(['breaking', 'non-breaking']).toContain(entry.impact);
    }
  });

  test('identical contracts have no diff', () => {
    const A = sigil.exact({ id: String });
    const B = sigil.exact({ id: String });
    expect(A.diff(B)).toHaveLength(0);
  });

  test('old row fails validation against new record schema', () => {
    const oldRow = { id: 'u1', name: 'Alex' }; // no role field
    const result = NewRecord.safeParse(oldRow);
    expect(result.success).toBe(false);
  });
});

// ─── Prove — mock / cases / test ─────────────────────────────────────────

describe('Database boundary — Prove pillar', () => {
  test('mock() generates a valid record fixture', () => {
    const fixture = UserRecord.mock({ seed: 1 });
    const result = UserRecord.safeParse(fixture);
    expect(result.success).toBe(true);
  });

  test('mock() is deterministic with a seed', () => {
    const a = UserRecord.mock({ seed: 42 });
    const b = UserRecord.mock({ seed: 42 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  test('cases() returns valid and invalid groups', () => {
    const recordCases = UserRecord.cases();
    expect(recordCases.valid).toBeDefined();
    expect(recordCases.invalid).toBeDefined();
    expect(recordCases.valid.length).toBeGreaterThan(0);
    expect(recordCases.invalid.length).toBeGreaterThan(0);
  });

  test('cases() valid cases all parse successfully', () => {
    const { valid } = UserRecord.cases();
    for (const c of valid) {
      expect(UserRecord.safeParse(c.value).success).toBe(true);
    }
  });

  test('cases() invalid cases all fail safeParse', () => {
    const { invalid } = UserRecord.cases();
    for (const c of invalid) {
      expect(UserRecord.safeParse(c.value).success).toBe(false);
    }
  });

  test('test() reports record contract behavior', () => {
    const report = UserRecord.test({
      valid: [{ label: 'valid row', value: validRow() }],
      invalid: [
        {
          label: 'bad role',
          value: { ...validRow(), role: 'owner' },
          expectedPath: ['role'],
        },
      ],
    });
    expect(report.success).toBe(true);
    expect(report.valid.passed).toBe(1);
    expect(report.invalid.passed).toBe(1);
  });
});

// ─── Database-neutral / no dependencies ───────────────────────────────────

describe('Database boundary — database-neutral behavior', () => {
  test('no database import is required', async () => {
    // This test itself proves no DB driver is needed — it runs with zero deps
    const row = validRow();
    expect(UserRecord.parse(row).id).toBe('user_1');
  });

  test('contracts work with plain objects from any source', () => {
    // Could be Postgres, MongoDB, SQLite, in-memory — shape is what matters
    const fromAnySource = {
      id: 'record_999',
      email: 'test@example.com',
      name: 'Test',
      role: 'admin',
      createdAt: FIXED_TS,
      updatedAt: FIXED_TS,
    };
    expect(UserRecord.parse(fromAnySource).role).toBe('admin');
  });
});
