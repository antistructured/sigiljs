import { optional, sigil } from '../../src/index.js';

const UserRecord = sigil.exact({
  id: String,
  email: String,
  displayName: optional(String),
  createdAt: String,
  updatedAt: String,
});
const InsertUser = sigil.exact({ email: String, displayName: optional(String) });
const UpdateUser = sigil.exact({ displayName: optional(String), updatedAt: String });

function insertUser(input, now = '2026-01-01T00:00:00.000Z') {
  const values = InsertUser.parse(input);
  return UserRecord.parse({ id: 'usr_1', ...values, createdAt: now, updatedAt: now });
}

function updateUser(existing, patch) {
  const record = UserRecord.parse(existing);
  const values = UpdateUser.parse(patch);
  return UserRecord.parse({ ...record, ...values });
}

const inserted = insertUser({ email: 'dana@example.com', displayName: 'Dana' });
const updated = updateUser(inserted, { displayName: 'D. Example', updatedAt: '2026-01-02T00:00:00.000Z' });
const serialized = UserRecord.serialize(updated);
const diff = UserRecord.diff(UpdateUser);
const mock = UserRecord.mock({ includeOptional: true });
const proof = UserRecord.test(UserRecord.cases({ includeOptional: true }));

if (!proof.success) throw new Error('record proof should pass');

console.log(JSON.stringify({
  inserted,
  serialized,
  changedName: updated.displayName,
  diffCount: diff.length,
  mock,
  proof: proof.success,
}, null, 2));
