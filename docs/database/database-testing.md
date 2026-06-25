# Database Testing

SigilJS can validate data as it crosses persistence boundaries, without becoming your ORM.

The **Prove** pillar provides `mock()`, `cases()`, and `test()` — deterministic, offline tools for proving that database record contracts behave correctly in tests.

---

## mock() — generate valid record fixtures

`mock()` generates a deterministic, contract-valid fixture. Useful for seeding test databases or unit test inputs:

```js
import { oneOf, sigil } from '@weipertda/sigiljs';

const UserRecord = sigil.exact({
  id: String,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
  createdAt: String,
  updatedAt: String,
});

const fixture = UserRecord.mock({ seed: 1 });
// { id: 'string', email: 'string', name: 'string', role: 'admin', createdAt: 'string', updatedAt: 'string' }

// Always valid
UserRecord.parse(fixture); // no throw
```

This fixture is useful for tests. Your app/database layer still owns IDs, timestamps, and persistence.

Use a seed for determinism:

```js
const a = UserRecord.mock({ seed: 42 });
const b = UserRecord.mock({ seed: 42 });
// JSON.stringify(a) === JSON.stringify(b) → true
```

---

## cases() — boundary test inputs

`cases()` returns `{ valid: [...], invalid: [...] }` — structured test inputs covering common valid and invalid scenarios for the contract:

```js
const recordCases = UserRecord.cases();

// All valid cases parse successfully
for (const c of recordCases.valid) {
  const result = UserRecord.safeParse(c.value);
  console.log(c.label, '→', result.success); // true
}

// All invalid cases fail
for (const c of recordCases.invalid) {
  const result = UserRecord.safeParse(c.value);
  console.log(c.label, '→', result.success); // false
}
```

---

## test() — prove contract behavior

`test()` accepts `{ valid, invalid }` case arrays and returns a pass/fail summary:

```js
const FIXED_TS = '2026-01-01T00:00:00.000Z';

const report = UserRecord.test({
  valid: [
    {
      label: 'valid admin row',
      value: { id: 'u1', email: 'a@b.com', name: 'Alex', role: 'admin', createdAt: FIXED_TS, updatedAt: FIXED_TS },
    },
  ],
  invalid: [
    {
      label: 'bad role',
      value: { id: 'u1', email: 'a@b.com', name: 'Alex', role: 'owner', createdAt: FIXED_TS, updatedAt: FIXED_TS },
      expectedPath: ['role'],
    },
  ],
});

console.log(report.success);         // true if all cases matched expectations
console.log(report.valid.passed);    // 1
console.log(report.invalid.passed);  // 1
```

---

## Using cases() inside a Bun test

```js
import { test, expect, describe } from 'bun:test';
import { UserRecord } from './contracts.js';

describe('UserRecord contract', () => {
  const { valid, invalid } = UserRecord.cases();

  for (const c of valid) {
    test(`valid: ${c.label}`, () => {
      expect(UserRecord.safeParse(c.value).success).toBe(true);
    });
  }

  for (const c of invalid) {
    test(`invalid: ${c.label}`, () => {
      expect(UserRecord.safeParse(c.value).success).toBe(false);
    });
  }
});
```

---

## Non-goals

- `mock()` generates type-correct values, not semantically meaningful ones (IDs are `'string'`, not `'user_abc123'`).
- `cases()` covers common boundary inputs, not exhaustive fuzzing.
- None of these helpers connect to a database or insert real records.
- For integration tests that need a real database, use `mock()` output as a starting point and override generated fields.
