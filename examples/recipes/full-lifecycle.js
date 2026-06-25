/**
 * Full Lifecycle Recipe — examples/recipes/full-lifecycle.js
 *
 * Shows all five SigilJS pillars in one contract workflow.
 * Domain: SupportTicket — a realistic multi-boundary scenario.
 *
 * The value of SigilJS compounds when the same contract moves through
 * multiple boundaries.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

console.log('─── SigilJS Full Lifecycle: SupportTicket ───────────────────────────────\n');

// ── DEFINE ────────────────────────────────────────────────────────────────
// One contract. Used everywhere.

const SupportTicket = sigil.exact(
  {
    id: String,
    title: String,
    status: oneOf('open', 'in-progress', 'resolved'),
    priority: oneOf('low', 'medium', 'high'),
    assignee: optional(String),
    createdAt: String,
  },
  {
    name: 'SupportTicket',
    version: '1.0.0',
    description: 'A customer support ticket',
  },
);

console.log('DEFINE — contract:', SupportTicket.describe().kind, '| exact:', SupportTicket.describe().exact);

// ── ENFORCE ───────────────────────────────────────────────────────────────
// Boundary 1: API request body

const incomingTicket = {
  id: 'ticket_001',
  title: 'Login page crashes on Safari',
  status: 'open',
  priority: 'high',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const result = SupportTicket.safeParse(incomingTicket);
console.log('\nENFORCE — safeParse valid:', result.success);
if (result.success) {
  console.log('  Trusted ticket id:', result.data.id);
  console.log('  Priority:', result.data.priority);
}

// Boundary 2: Database row read
const rowFromDatabase = {
  id: 'ticket_001',
  title: 'Login page crashes on Safari',
  status: 'in-progress',
  priority: 'high',
  assignee: 'Dana',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const dbResult = SupportTicket.parse(rowFromDatabase);
console.log('  DB row trusted assignee:', dbResult.assignee);

// Invalid data is caught at every boundary
const badPriority = { ...incomingTicket, priority: 'critical' };
const badResult = SupportTicket.safeParse(badPriority);
console.log('  Invalid priority caught:', !badResult.success, '| field:', badResult.error?.path);

// ── TRANSFORM ─────────────────────────────────────────────────────────────
// Normalize before persistence

const NormalizedTicket = SupportTicket.transform((data) => ({
  ...data,
  title: data.title.trim(),
}));

const normalized = NormalizedTicket.parse({
  ...incomingTicket,
  title: '  Login page crashes on Safari  ',
});
console.log('\nTRANSFORM — title trimmed:', `"${normalized.title}"`);

// ── PROJECT ───────────────────────────────────────────────────────────────

const jsonSchema = SupportTicket.toJSONSchema();
console.log('\nPROJECT — JSON Schema type:', jsonSchema.type);
console.log('  required fields:', jsonSchema.required);

const tsType = SupportTicket.toTypeScript('SupportTicket');
console.log('  TypeScript type generated:', tsType.includes('SupportTicket'));

const openapi = SupportTicket.toOpenAPI();
console.log('  OpenAPI type:', openapi.type);

const formConstraints = SupportTicket.toFormConstraints(); // experimental
console.log('  Form fields (experimental):',
  Object.entries(formConstraints.fields).map(([k, v]) => `${k}:${v.type}`).join(', '));

// ── PROVE ─────────────────────────────────────────────────────────────────

const fixture = SupportTicket.mock({ seed: 1 });
console.log('\nPROVE — mock fixture:', fixture);

const report = SupportTicket.test(SupportTicket.cases());
console.log('  Contract proof success:', report.success);
console.log('  Valid passed:', report.valid.passed, '| Invalid passed:', report.invalid.passed);

// Diff: what changed between schema versions?
const OldTicket = sigil.exact({ id: String, title: String, status: oneOf('open', 'closed') });
const changes = OldTicket.diff(SupportTicket);
console.log('  Schema changes from old:', changes.length, 'field(s)');

console.log('\n─── All five pillars demonstrated ───────────────────────────────────────');
