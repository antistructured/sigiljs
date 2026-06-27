# Database Boundary Model Design

**Block:** Database Boundary Contracts  
**Package:** `@weipertda/sigiljs`

---

## Conceptual model

Database boundary contracts cover three distinct shapes. Each shape is a separate Sigil contract — not one combined contract — because their valid fields differ.

```
Stored record   — what comes back from a database read
Insert input    — what is validated before a new write
Update input    — what is validated before a patch/update write
```

---

## Record contract

Validates data read from persistence. Contains all persisted columns including generated fields (IDs, timestamps).

```js
const UserRecord = sigil.exact({
  id: String,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
  createdAt: String,
  updatedAt: String,
});
```

Use `parse()` or `safeParse()` immediately after reading from the database — before the data enters application logic.

---

## Insert contract

Validates caller-supplied fields before writing a new row/document. Excludes generated fields (IDs, timestamps) that the database or application layer will add.

```js
const NewUser = sigil.exact({
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});
```

After validation, the application layer appends generated fields:

```js
const validated = NewUser.parse(input);
const rowToInsert = {
  id: generateId(),
  ...validated,
  createdAt: now(),
  updatedAt: now(),
};
```

SigilJS owns the validation. The application layer owns ID generation and timestamp injection.

---

## Update contract

Validates partial update payloads. Fields are optional to support partial updates. The `updatedAt` timestamp is required to signal the update was intentional.

```js
const UserUpdate = sigil.exact({
  name: optional(String),
  role: optional(oneOf('admin', 'user')),
  updatedAt: String,
});
```

### Partial update limitation

SigilJS has no native "at least one optional field must be present" constraint. A payload of `{ updatedAt: '...' }` with no other fields is valid. Applications that require at least one non-timestamp field must enforce that constraint in application logic, not in the contract.

This limitation is documented in `docs/database/update-contracts.md`.

---

## Database read boundary

```
database adapter
↓ raw row / document
UserRecord.parse(rawRow)   ← trust boundary
↓ trusted UserRecord
application logic
```

---

## Database write boundary

```
caller input
↓
NewUser.parse(input)       ← insert trust boundary
↓ trusted NewUser
+ generated fields (app layer)
↓ rowToInsert
database adapter
```

---

## Serialization behavior

`serialize()` validates/serializes the current shape but does not apply transforms. Use `parse()` when a contract includes transforms that must run before a value is written:

```js
const NormalizedUser = NewUser.transform((d) => ({
  ...d,
  email: d.email.toLowerCase(),
}));

const normalized = NormalizedUser.parse(input);
```

---

## Contract diff behavior

`diff(other)` compares two contract descriptions and returns a list of property changes with `impact: 'breaking'`, `'non-breaking'`, or `'unknown'`. Use `Next.diff(Previous)` to detect when a record contract shape has changed.

```js
NewUserRecord.diff(OldUserRecord)
// [{ kind: 'property.added', path: ['role'], impact: 'non-breaking' }]
```

Diffs do not generate or execute migrations. They are a signal for human review.

---

## Non-goals

SigilJS does not:
- connect to any database
- run SQL queries or NoSQL operations
- generate migrations or DDL
- replace an ORM or query builder
- manage transactions or connection pools
- generate IDs or timestamps
- guarantee atomicity of writes
- validate relational integrity between records
