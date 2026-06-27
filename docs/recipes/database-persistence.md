# Database Persistence Recipe

**Boundary:** Database read/write boundaries

SigilJS validates data crossing persistence boundaries. It does not connect to your database.

---

## Problem

Data read from a database is untrusted runtime data. Data written to a database may have wrong shape. Contracts enforce both sides of the persistence boundary.

---

## Contracts

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

// What a stored row looks like
const UserRecord = sigil.exact({
  id: String,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
  createdAt: String,
  updatedAt: String,
});

// What caller supplies for a new row (no generated fields)
const NewUser = sigil.exact({
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});

// What caller supplies for a partial update
const UserUpdate = sigil.exact({
  name: optional(String),
  role: optional(oneOf('admin', 'user')),
  updatedAt: String,
});
```

---

## Read boundary

```js
const rowFromDatabase = {
  id: 'user_1',
  email: 'alex@example.com',
  name: 'Alex',
  role: 'user',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const user = UserRecord.parse(rowFromDatabase);
// user.role is now 'admin' | 'user' — verified
```

---

## Insert boundary

```js
const input = { email: 'alex@example.com', name: 'Alex', role: 'user' };
const validated = NewUser.parse(input);

// Application layer adds generated fields
const rowToInsert = {
  id: 'user_abc123',
  ...validated,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};
```

---

## Update boundary

```js
const patch = { name: 'Alex W.', updatedAt: '2026-01-02T00:00:00.000Z' };
const update = UserUpdate.parse(patch);
// update.name is verified; update.role is undefined (not in patch)
```

---

## Contract diff

```js
const OldUserRecord = sigil.exact({ id: String, email: String });
const NewUserRecord = sigil.exact({ id: String, email: String, role: oneOf('admin', 'user') });

const changes = NewUserRecord.diff(OldUserRecord);
const breaking = changes.filter((c) => c.impact === 'breaking');
// breaking.length > 0 → migration/compatibility review may be needed
```

---

## Prove

```js
const fixture = UserRecord.mock({ seed: 1 });
const { valid, invalid } = UserRecord.cases();
const report = UserRecord.test(UserRecord.cases());
```

---

## Run it

```bash
bun run examples/recipes/database-persistence.js
```

---

## Limits

- SigilJS validates data shape — it does not run queries, generate migrations, or connect to databases.
- ID and timestamp generation is the application's responsibility.
- No "at least one optional field" constraint — see [`docs/known-limitations.md`](../known-limitations.md).
- See [`docs/database/`](../database/) for full database documentation.
