/**
 * Record Safe Parse — non-throwing validation of database rows
 *
 * Shows safeParse() for bulk row validation where some rows
 * may be in a legacy or unexpected shape.
 *
 * No database connection. Plain objects only.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

const PostRecord = sigil.exact({
  id: String,
  title: String,
  authorId: String,
  status: oneOf('draft', 'published', 'archived'),
  tags: optional(Array),
  createdAt: String,
});

// Simulated bulk read result from a database — some rows may be malformed
const rows = [
  {
    id: 'post_1',
    title: 'Getting Started',
    authorId: 'user_1',
    status: 'published',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'post_2',
    title: 'Advanced Patterns',
    authorId: 'user_2',
    status: 'deleted', // invalid — not in oneOf
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'post_3',
    title: 'Deep Dive',
    authorId: 'user_1',
    status: 'draft',
    tags: ['sigil', 'contracts'],
    createdAt: '2026-01-02T00:00:00.000Z',
  },
];

// Validate each row — skip invalid ones rather than crashing
const trusted = [];
const invalid = [];

for (const row of rows) {
  const result = PostRecord.safeParse(row);
  if (result.success) {
    trusted.push(result.data);
  } else {
    invalid.push({ id: row.id, error: result.error.message });
  }
}

console.log('Trusted rows:', trusted.length);
for (const r of trusted) console.log(' -', r.id, r.status);

console.log('Invalid rows:', invalid.length);
for (const e of invalid) console.log(' -', e.id, ':', e.error);
