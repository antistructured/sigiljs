import { oneOf, optional, sigil } from '../../src/index.js';

const AccountSettingsRecord = sigil.exact({
  accountId: String,
  theme: oneOf('light', 'dark', 'system'),
  timezone: String,
  marketingEmails: optional(Boolean),
  updatedAt: String,
});
const SettingsWrite = sigil.exact({
  theme: optional(oneOf('light', 'dark', 'system')),
  timezone: optional(String),
  marketingEmails: optional(Boolean),
  updatedAt: String,
});

function readSettings(row) {
  return AccountSettingsRecord.parse(row);
}

function writeSettings(existingRow, patch) {
  const existing = AccountSettingsRecord.parse(existingRow);
  const write = SettingsWrite.parse(patch);
  return AccountSettingsRecord.parse({ ...existing, ...write });
}

const existing = readSettings({
  accountId: 'acct_1',
  theme: 'system',
  timezone: 'UTC',
  updatedAt: '2026-01-01T00:00:00.000Z',
});
const updated = writeSettings(existing, { theme: 'dark', updatedAt: '2026-01-03T00:00:00.000Z' });
const invalid = SettingsWrite.safeParse({ theme: 'neon', updatedAt: '2026-01-03T00:00:00.000Z' });
const cases = AccountSettingsRecord.cases({ includeOptional: true });
const report = AccountSettingsRecord.test(cases);

if (invalid.success) throw new Error('expected invalid theme');
if (!report.success) throw new Error('settings record proof should pass');

console.log(JSON.stringify({
  existingTheme: existing.theme,
  updatedTheme: updated.theme,
  invalidPath: invalid.error.path,
  serializedWrite: SettingsWrite.serialize({ timezone: 'Europe/Berlin', updatedAt: '2026-01-04T00:00:00.000Z' }),
  caseCounts: { valid: cases.valid.length, invalid: cases.invalid.length },
  report: report.success,
}, null, 2));
