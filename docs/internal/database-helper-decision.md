# DB Helper Stabilization Decision

**Block:** Database Boundary Contracts  
**Package:** `@weipertda/sigiljs`

---

## Decision: Option C — Direct contract usage only

No `dbContract()` helper will be added in this block.

---

## Rationale

Database integration varies too heavily to justify a premature public helper:

- ID generation strategy differs per stack (UUID, ULID, auto-increment, database-generated)
- Timestamp injection differs (application layer, database trigger, ORM hook)
- Partial update semantics are application-specific
- Transaction and rollback semantics are outside SigilJS scope
- SQL vs NoSQL vs document store vs key-value all have different update shapes
- ORM vs raw driver adds another axis of variation

A `dbContract()` helper would need to make assumptions about all of these, which would make it wrong for many real applications.

---

## Recommended stable path

Use direct contract APIs at each boundary:

```js
// Read boundary
const user = UserRecord.parse(rowFromDatabase);
const result = UserRecord.safeParse(rowFromDatabase);

// Insert boundary
const validated = NewUser.parse(input);

// Update boundary
const patch = UserUpdate.parse(updatePayload);

// Diff
const changes = NewUserRecord.diff(OldUserRecord);

// Fixtures
const fixture = UserRecord.mock({ seed: 1 });
```

This is sufficient. No helper is needed.

---

## What would justify adding a helper

If a `dbContract()` helper is added in a future block, it should only be considered when:

- A concrete adapter pattern for at least one database/ORM has been proven in real usage
- The read/insert/update split is stable across multiple application architectures
- A clear need exists that cannot be met with direct contract composition
- The implementation remains dependency-free

Until then, direct contract usage is the recommended and documented path.

---

## No accidental public database API

Confirmed: no `dbContract`, `recordContract`, or database-related symbol will be exported from `src/index.js` in this block.
