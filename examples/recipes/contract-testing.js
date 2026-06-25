/**
 * Contract Testing Recipe — examples/recipes/contract-testing.js
 *
 * Shows the Prove pillar in depth: mock(), cases(), test().
 * No test runner required. Plain JavaScript output.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

// ── Contract ──────────────────────────────────────────────────────────────

const SupportTicket = sigil.exact({
  id: String,
  title: String,
  status: oneOf('open', 'in-progress', 'resolved'),
  priority: oneOf('low', 'medium', 'high'),
  assignee: optional(String),
});

// ── mock() — generate a valid fixture ─────────────────────────────────────

const fixture = SupportTicket.mock({ seed: 1 });
console.log('Generated fixture:', fixture);
console.log('Fixture parses:', SupportTicket.safeParse(fixture).success); // true

// Deterministic — same seed, same result
const a = SupportTicket.mock({ seed: 42 });
const b = SupportTicket.mock({ seed: 42 });
console.log('Deterministic:', JSON.stringify(a) === JSON.stringify(b)); // true

// ── cases() — get valid/invalid test inputs ────────────────────────────────

const { valid, invalid } = SupportTicket.cases();
console.log('\nGenerated cases:');
console.log('  valid:', valid.length);
console.log('  invalid:', invalid.length);

// All valid cases parse successfully
for (const c of valid) {
  const result = SupportTicket.safeParse(c.value);
  console.log(`  valid "${c.label}": ${result.success ? 'pass' : 'FAIL'}`);
}

// All invalid cases fail parsing
for (const c of invalid.slice(0, 4)) {
  const result = SupportTicket.safeParse(c.value);
  console.log(`  invalid "${c.label}": ${!result.success ? 'pass' : 'FAIL'}`);
}

// ── test() — run a contract proof ─────────────────────────────────────────

const FIXED_ID = 'ticket_001';

const report = SupportTicket.test({
  valid: [
    {
      label: 'open ticket with no assignee',
      value: { id: FIXED_ID, title: 'App crash', status: 'open', priority: 'high' },
    },
    {
      label: 'assigned in-progress ticket',
      value: { id: FIXED_ID, title: 'Slow load', status: 'in-progress', priority: 'medium', assignee: 'Dana' },
    },
  ],
  invalid: [
    {
      label: 'invalid status value',
      value: { id: FIXED_ID, title: 'Bug', status: 'deleted', priority: 'low' },
      expectedPath: ['status'],
    },
    {
      label: 'missing title',
      value: { id: FIXED_ID, status: 'open', priority: 'low' },
      expectedPath: ['title'],
    },
    {
      label: 'extra field (exact mode)',
      value: { id: FIXED_ID, title: 'Bug', status: 'open', priority: 'low', internalFlag: true },
    },
  ],
});

console.log('\nContract proof:');
console.log('  success:', report.success);
console.log('  valid passed:', report.valid.passed, '/ failed:', report.valid.failed);
console.log('  invalid passed:', report.invalid.passed, '/ failed:', report.invalid.failed);

// ── Using with a test runner (Bun example) ────────────────────────────────
// In your Bun test file:
//
// import { test, expect, describe } from 'bun:test';
//
// describe('SupportTicket contract', () => {
//   const { valid, invalid } = SupportTicket.cases();
//
//   for (const c of valid) {
//     test(`valid: ${c.label}`, () => {
//       expect(SupportTicket.safeParse(c.value).success).toBe(true);
//     });
//   }
//
//   for (const c of invalid) {
//     test(`invalid: ${c.label}`, () => {
//       expect(SupportTicket.safeParse(c.value).success).toBe(false);
//     });
//   }
// });
