# Database boundaries

SigilJS can validate data as it crosses persistence boundaries, without becoming your ORM.

Database reads and writes cross a trust boundary. The database row shape and the application object shape can drift over time. Contracts keep that drift visible and caught at runtime.

---

## Read boundary

Validate every record immediately after reading from the database:

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

const row = await db.query('SELECT * FROM users WHERE id = $1', [id]);
const user = UserRecord.parse(row.rows[0]); // trust boundary
```

Use `safeParse()` for bulk reads or when you need non-throwing error handling.

---

## Write boundary — insert

Validate caller input before writing a new record:

```js
const NewUser = sigil.exact({
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});

const validated = NewUser.parse(callerInput);

// Application layer adds generated fields
const rowToInsert = {
  id: generateId(),
  ...validated,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

---

## Write boundary — update

Validate partial update payloads before applying them:

```js
const UserUpdate = sigil.exact({
  name: optional(String),
  role: optional(oneOf('admin', 'user')),
  updatedAt: String,
});

const patch = UserUpdate.parse(updatePayload);
```

---

## Schema change detection

Use `diff()` to catch persistence shape changes before deploying:

```js
const changes = OldUserRecord.diff(NewUserRecord);
const breaking = changes.filter((c) => c.impact === 'breaking');
// breaking.length > 0 → migration may be needed
```

---

## Database boundaries are useful for

- ORM hydration validation
- query result assertions
- insert and update envelope validation
- multi-tenant row scoping
- migration safety checks
- legacy schema compatibility detection

---

## Docs

- [Record Contracts](../database/record-contracts.md)
- [Insert Contracts](../database/insert-contracts.md)
- [Update Contracts](../database/update-contracts.md)
- [Persistence Diffs](../database/persistence-diffs.md)
- [Database Testing](../database/database-testing.md)
