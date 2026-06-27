# Persistence Diffs

SigilJS can validate data as it crosses persistence boundaries, without becoming your ORM.

`diff()` compares two contract descriptions and returns a list of property changes. Use it to catch persistence schema changes before they cause runtime failures.

**Contract diffs can highlight persistence shape changes, but they do not generate or execute migrations.**

---

## How diff() works

Use `Next.diff(Previous)` to describe how a persistence contract changed from the previous version to the next version. Properties that exist in the next contract but not the previous contract appear as `property.added`; properties removed from the next contract appear as `property.removed`.

```js
import { oneOf, sigil } from '@weipertda/sigiljs';

const OldUserRecord = sigil.exact({
  id: String,
  email: String,
  name: String,
});

const NewUserRecord = sigil.exact({
  id: String,
  email: String,
  name: String,
  role: oneOf('admin', 'user'), // new field
});

const changes = NewUserRecord.diff(OldUserRecord);
// [{ kind: 'property.added', path: ['role'], impact: 'non-breaking' }]
```

A `non-breaking` impact means the structural contract diff itself is additive. You may still need an application/database migration if the new field is required for stored rows or persistence code.

---

## Detecting breaking changes before deployment

```js
const changes = NewSchema.diff(OldSchema);
const breaking = changes.filter((c) => c.impact === 'breaking');

if (breaking.length > 0) {
  console.warn('Breaking schema changes detected:');
  for (const c of breaking) {
    console.warn(` [${c.impact}] ${c.kind} at ${c.path.join('.')}`);
  }
  // Block deployment or require migration confirmation
}
```

---

## Validating old records against a new schema

Use `safeParse()` to check whether existing stored records are compatible with a new contract:

```js
const oldRow = { id: 'u1', email: 'alex@example.com', name: 'Alex' };
const result = NewUserRecord.safeParse(oldRow);

if (!result.success) {
  console.log('Old row incompatible with new schema:', result.error.message);
  // → Missing required property "role"
  console.log('Migration needed before deploying new schema.');
}
```

---

## Contract diff in a CI check

```js
// In a test or CI script
import { OldUserRecord, NewUserRecord } from './contracts.js';

const changes = NewUserRecord.diff(OldUserRecord);
const breaking = changes.filter((c) => c.impact === 'breaking');

if (breaking.length > 0) {
  console.error('Breaking contract change detected. Migration required.');
  process.exit(1);
}
```

---

## Limits and non-goals

- Contract diffs describe structural shape changes only. They do not inspect actual database state.
- Diffs do not generate SQL `ALTER TABLE` statements or NoSQL migration scripts.
- Diffs do not run migrations.
- Diffs cannot detect data-level inconsistencies (e.g. existing rows with invalid enum values).
- Use a dedicated migration tool (Flyway, Alembic, Prisma Migrate, etc.) to execute schema changes. Use SigilJS contract diffs to reason about what changed.
