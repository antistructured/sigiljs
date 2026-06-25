/**
 * Migration Safety Check — use diff() to review schema changes
 *
 * Shows how to compare record contracts across two versions of a
 * schema to catch breaking changes before deploying.
 *
 * Contract diffs can highlight persistence shape changes, but
 * they do not generate or execute migrations.
 *
 * No database connection. Plain objects only.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

// Version 1 — original schema
const PostRecordV1 = sigil.exact({
  id: String,
  title: String,
  body: String,
  authorId: String,
  createdAt: String,
});

// Version 2 — adds status and tags, renames nothing
const PostRecordV2 = sigil.exact({
  id: String,
  title: String,
  body: String,
  authorId: String,
  status: oneOf('draft', 'published', 'archived'),
  tags: optional(Array),
  createdAt: String,
  updatedAt: String,
});

const diff = PostRecordV1.diff(PostRecordV2);
console.log('Schema changes from V1 to V2:');
for (const change of diff) {
  console.log(` [${change.impact}] ${change.kind} — path: ${change.path.join('.')}`);
}

// Validate an old record against the new schema (migration check)
const oldRow = {
  id: 'post_1',
  title: 'Hello World',
  body: 'Content here',
  authorId: 'user_1',
  createdAt: '2025-01-01T00:00:00.000Z',
};

const result = PostRecordV2.safeParse(oldRow);
console.log('\nOld row valid against new schema:', result.success);
if (!result.success) {
  console.log('Migration needed — failed field:', result.error.path.join('.'));
  console.log('Reason:', result.error.message);
  console.log('Note: SigilJS identifies the gap. Your migration runner fills it.');
}
