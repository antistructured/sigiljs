# Testing Helpers

SigilJS includes stable built-in helpers for deterministic fixture and test-case generation.

`mock()` and `cases()` are part of the stable 0.4.0 public API. They are not experimental.

Future direction for additional testing capabilities:

```txt
fixtures()
```

For now, the supported testing surface is:

- `mock()` — one valid sample
- `cases()` — labeled valid/invalid cases
- `test()` — contract behavior report

No additional fixture helper is needed at this time.

## `mock()`

`mock()` generates a simple valid sample value:

```js
import { oneOf, optional, sigil } from 'sigil';

const User = sigil({
  id: Number,
  name: String,
  age: optional(Number),
  role: oneOf('admin', 'user'),
});

User.mock();
```

returns:

```js
{
  id: 0,
  name: 'string',
  role: 'admin',
}
```

Optional fields are omitted by default so the sample stays minimal but valid.

Current deterministic mappings:

- `string` → `'string'`
- `number` → `0`
- `boolean` → `true`
- `bigint` → `0n`
- `null` → `null`
- arrays → one mocked element
- objects → required properties only
- literal unions → first literal
- primitive unions → first variant
- named sigils → resolved named contract mock

## `cases()`

`cases()` returns basic valid and invalid values:

```js
User.cases();
```

returns:

```js
{
  valid: [User.mock()],
  invalid: [/* one simple invalid sample */],
}
```

This is useful for lightweight contract tests:

```js
const cases = User.cases();

for (const value of cases.valid) {
  expect(User.check(value)).toBe(true);
}

for (const value of cases.invalid) {
  expect(User.check(value)).toBe(false);
}
```

## `test()`

`test()` runs generated or custom cases against the contract and returns a plain report:

```js
const report = User.test();

{
  success: true,
  valid: { passed: 1, failed: 0 },
  invalid: { passed: 4, failed: 0 },
  failures: [],
}
```

Pass custom cases when you need boundary-specific coverage:

```js
const report = User.test({
  valid: [
    { label: 'minimum id', value: { id: 0, name: 'Ada' } }
  ],
  invalid: [
    { label: 'negative id', value: { id: -1, name: 'Ada' } }
  ]
});
```

Tests against the report:

```js
expect(report.success).toBe(true);
expect(report.failures).toEqual([]);
```

## Not fuzzing yet

Do not treat `cases()` as a fuzzer. It is intentionally deterministic and small.

Future `@sigil/testing` work may add fuzzing with options like:

```js
User.fuzz({
  count: 100,
  seed: 1234,
});
```

Possible future scope:

- seeded random generation
- boundary numbers and strings
- nested object depth controls
- optional-field inclusion modes
- invalid case categories
- shrinking failing cases

Keep fuzzing out of core until the contract model and projection APIs are mature.
