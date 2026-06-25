/**
 * Record Contract Test — prove database record behavior with test()
 *
 * Shows how test() proves a database record contract behaves correctly
 * for both valid and invalid inputs.
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

const FIXED_TS = '2026-01-01T00:00:00.000Z';

const report = UserRecord.test({
  valid: [
    {
      label: 'complete admin record',
      value: {
        id: 'user_1',
        email: 'admin@example.com',
        name: 'Admin',
        role: 'admin',
        createdAt: FIXED_TS,
        updatedAt: FIXED_TS,
      },
    },
    {
      label: 'complete user record',
      value: {
        id: 'user_2',
        email: 'user@example.com',
        name: 'User',
        role: 'user',
        createdAt: FIXED_TS,
        updatedAt: FIXED_TS,
      },
    },
  ],
  invalid: [
    {
      label: 'invalid role value',
      value: {
        id: 'user_3',
        email: 'x@example.com',
        name: 'X',
        role: 'owner',
        createdAt: FIXED_TS,
        updatedAt: FIXED_TS,
      },
      expectedPath: ['role'],
    },
    {
      label: 'missing required id',
      value: {
        email: 'x@example.com',
        name: 'X',
        role: 'user',
        createdAt: FIXED_TS,
        updatedAt: FIXED_TS,
      },
      expectedPath: ['id'],
    },
    {
      label: 'extra field rejected by exact mode',
      value: {
        id: 'user_4',
        email: 'x@example.com',
        name: 'X',
        role: 'user',
        createdAt: FIXED_TS,
        updatedAt: FIXED_TS,
        isInternal: true,
      },
    },
  ],
});

console.log('Database record contract proof:');
console.log(' overall success:', report.success);
console.log(' valid passed:', report.valid.passed, '/ failed:', report.valid.failed);
console.log(' invalid passed:', report.invalid.passed, '/ failed:', report.invalid.failed);
if (report.failures?.length) {
  console.log('Failures:', report.failures);
}
