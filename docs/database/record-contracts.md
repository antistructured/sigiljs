# Record Contracts

SigilJS can validate data as it crosses persistence boundaries, without becoming your ORM.

A database row is untrusted data until a contract confirms it has the shape your application expects. Define the record shape once — then enforce it at every read boundary before the data enters application logic.

---

## Why database records need runtime contracts

Databases drift. Column types change, fields are added or removed, and legacy rows may not match the schema your code currently expects. Without a runtime check, a malformed row can propagate through your application logic silently.

A Sigil contract stops bad records at the boundary:

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
```

---

## Validating records read from persistence

```js
const rowFromDatabase = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// Trust boundary — validate before using in application logic
const user = UserRecord.parse(rowFromDatabase.rows[0]);

// user.id, user.email, user.role are now verified
console.log(user.role); // 'admin' | 'user' — guaranteed
```

Use `safeParse()` when you need to handle the error without throwing:

```js
const result = UserRecord.safeParse(rowFromDatabase.rows[0]);

if (!result.success) {
  logger.error('Unexpected record shape', { error: result.error.message });
  return null;
}

return result.data;
```

---

## Bulk read validation

Validate each row in a result set individually. Skip or flag invalid rows rather than crashing:

```js
const trusted = [];
const invalid = [];

for (const row of rows) {
  const result = UserRecord.safeParse(row);
  if (result.success) {
    trusted.push(result.data);
  } else {
    invalid.push({ id: row?.id, error: result.error.message });
  }
}
```

---

## Error paths on bad records

`SigilValidationError.path` points to the failing field:

```js
const result = UserRecord.safeParse({ ...row, role: 'legacy_owner' });
result.error.path    // ['role']
result.error.message // "Expected property \"role\" to be \"admin\" | \"user\", got legacy_owner"
```

---

## Using exact contracts for persistence safety

`sigil.exact()` rejects rows with unexpected columns. This catches cases where a database migration added a column that your record contract doesn't know about — making schema drift visible:

```js
const strictRecord = sigil.exact({ id: String, email: String });
strictRecord.parse({ id: '1', email: 'x@x.com', newColumn: 'surprise' });
// → throws: Unexpected property "newColumn"
```

---

## Non-goals

SigilJS does not:
- connect to databases
- run SQL queries
- manage connection pools
- generate migrations
- replace an ORM
- manage transactions
