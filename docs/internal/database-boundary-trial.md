# Database Boundary Trial

**Block:** Real-World Usage Trial  
**Pass:** 8 — Database Boundary Trial  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Trial Files

- `trials/database-boundary/user-record.js`
- `trials/database-boundary/account-settings.js`
- `trials/database-boundary/README.md`

---

## Commands Run

```bash
bun run trials/database-boundary/user-record.js
bun run trials/database-boundary/account-settings.js
```

Result: **pass**

---

## Coverage

The trial exercised:

- record parse
- insert parse
- update parse
- partial update shape
- serialized write shape
- diff between record/write contracts
- mock record fixture
- `cases()` / `test()` record behavior
- application ownership of ids and timestamps

---

## Findings

### What Felt Good

- Direct contracts are enough for dependency-free database boundaries.
- Separate read/insert/update contracts make ownership clear.
- Application code naturally owns generated IDs and timestamps.
- `serialize()` is a good fit for validating outbound write shapes because it does not apply transforms.
- `safeParse()` is sufficient for rejected write payloads.
- `mock()` / `cases()` / `test()` are useful for record fixture/proof scaffolding.

### Friction

- Partial update contracts cannot express "at least one optional update field must be present"; application logic must enforce this.
- `diff()` between a full record and write contract is useful for review, but output needs explanatory docs before it is obvious in migrations.
- Date/time semantics remain string-level unless application code adds stronger validation.

---

## Database Helper Assessment

A `dbContract()` helper still appears unnecessary for current needs.

Direct contracts preserve dependency-free boundaries and avoid coupling SigilJS to an ORM, migration system, or database driver.

---

## Blocker Assessment

No database-boundary blocker found.

Keep database helpers deferred. Document app-owned constraints like IDs, timestamps, uniqueness, persistence, and partial-update business rules.
