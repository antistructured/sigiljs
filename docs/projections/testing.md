# Testing Helpers

SigilJS can generate deterministic fixtures and basic contract test cases from the same runtime contract.

Future direction:

```txt
@sigil/testing
```

For now, `mock()` and `cases()` live in core while the testing API stabilizes.

## `mock()`

`mock()` generates a simple valid sample value:

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

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
  id: 1,
  name: 'string',
  role: 'admin',
}
```

Optional fields are omitted by default so the sample stays minimal but valid.

Current deterministic mappings:

- `string` → `'string'`
- `number` → `1`
- `boolean` → `true`
- `bigint` → `1n`
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
