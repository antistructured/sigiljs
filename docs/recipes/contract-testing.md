# Contract Testing Recipe

**Pillar:** Prove — `mock()`, `cases()`, `test()`

The Prove pillar lets you generate fixtures, produce boundary test cases, and run contract self-tests — all from the same contract used for enforcement.

---

## Problem

You want to test that a contract enforces valid and invalid data correctly, without writing every test case by hand.

---

## Contract

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const SupportTicket = sigil.exact({
  id: String,
  title: String,
  status: oneOf('open', 'in-progress', 'resolved'),
  priority: oneOf('low', 'medium', 'high'),
  assignee: optional(String),
});
```

---

## mock() — generate a valid fixture

```js
const fixture = SupportTicket.mock({ seed: 1 });
// { id: 'string', title: 'string', status: 'open', priority: 'low' }

// Fixtures are always valid
SupportTicket.parse(fixture); // no throw

// Same seed → same output
SupportTicket.mock({ seed: 42 }) deep-equals SupportTicket.mock({ seed: 42 })
```

Generated values are type-correct but not semantically meaningful (strings are `'string'`, etc.).

---

## cases() — generate boundary test inputs

```js
const { valid, invalid } = SupportTicket.cases();
// valid: [{ label: 'valid default', value: { ... } }]
// invalid: [{ label: 'missing required property: id', value: { ... } }, ...]

// All valid cases parse successfully
for (const c of valid) {
  SupportTicket.parse(c.value); // no throw
}

// All invalid cases fail parsing
for (const c of invalid) {
  SupportTicket.safeParse(c.value).success === false
}
```

---

## test() — run a contract proof

```js
const report = SupportTicket.test({
  valid: [
    { label: 'open ticket', value: { id: 't1', title: 'Bug', status: 'open', priority: 'high' } },
  ],
  invalid: [
    { label: 'invalid status', value: { id: 't1', title: 'Bug', status: 'deleted', priority: 'low' }, expectedPath: ['status'] },
    { label: 'missing title', value: { id: 't1', status: 'open', priority: 'low' }, expectedPath: ['title'] },
  ],
});

report.success         // true if all cases matched expectations
report.valid.passed    // 1
report.invalid.passed  // 2
report.failures        // []
```

---

## Using cases() in a Bun test suite

```js
import { test, expect, describe } from 'bun:test';

describe('SupportTicket contract', () => {
  const { valid, invalid } = SupportTicket.cases();

  for (const c of valid) {
    test(`valid: ${c.label}`, () => {
      expect(SupportTicket.safeParse(c.value).success).toBe(true);
    });
  }

  for (const c of invalid) {
    test(`invalid: ${c.label}`, () => {
      expect(SupportTicket.safeParse(c.value).success).toBe(false);
    });
  }
});
```

---

## Run it

```bash
bun run examples/recipes/contract-testing.js
```

---

## Limits

- `mock()` generates type-correct but not semantically meaningful values.
- `cases()` covers common boundary inputs — it does not exhaustively fuzz.
- `test()` returns a summary object, not a per-case result array.
- No network calls, no external test runners required.
