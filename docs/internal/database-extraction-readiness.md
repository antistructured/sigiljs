# Database Extraction Readiness Report

**Block:** Database Boundary Contracts  
**Package:** `@weipertda/sigiljs`

---

## 1. Current package name

`@weipertda/sigiljs` — single package, no split.

---

## 2. Database examples

| File | Description |
|------|-------------|
| `examples/database/read-record.js` | `parse()` at a database read boundary |
| `examples/database/invalid-record.js` | Invalid row shapes — error paths |
| `examples/database/record-safe-parse.js` | Bulk row validation with `safeParse()` |
| `examples/database/insert-shape.js` | `parse()` before insert, generated fields added by app layer |
| `examples/database/invalid-insert.js` | Extra fields, wrong types, missing required fields at insert |
| `examples/database/serialized-insert.js` | `transform()` + `parse()` for normalized inserts |
| `examples/database/update-shape.js` | Partial update contract with optional fields |
| `examples/database/invalid-update.js` | Extra fields, bad values, missing `updatedAt` |
| `examples/database/partial-update.js` | Single-field patches and merge patterns |
| `examples/database/record-contract-diff.js` | `diff()` between old and new record schema |
| `examples/database/migration-safety-check.js` | Old row validation against new schema |
| `examples/database/record-mock.js` | `mock()` for deterministic test fixtures |
| `examples/database/record-cases.js` | `cases()` for boundary test inputs |
| `examples/database/record-contract-test.js` | `test()` for contract proofs |

All examples are offline, deterministic, Bun-runnable, and database-neutral.

---

## 3. Database public APIs

**No new exports.** This block uses only existing stable APIs:

| API | Status |
|-----|--------|
| `sigil.exact()` | stable |
| `contract.parse()` | stable |
| `contract.safeParse()` | stable |
| `contract.transform()` | stable |
| `contract.mock()` | stable |
| `contract.cases()` | stable |
| `contract.test()` | stable |
| `contract.diff()` | stable |
| `optional()`, `oneOf()` | stable |

No `dbContract()` or database-specific export was added.

---

## 4. Database experimental APIs

**None.** No experimental database helper was added in this block. All behavior demonstrated uses stable public APIs.

---

## 5. Database dependency status

**Zero database dependencies.** No Prisma, Drizzle, Knex, Mongoose, `pg`, `mysql2`, `sqlite3`, or similar package is imported anywhere.

---

## 6. ORM/framework dependency status

**None.** No ORM adapter, query builder, or framework integration was added.

---

## 7. Direct contract usage status

Direct contract usage is the recommended and documented path. The examples demonstrate that `parse()`, `safeParse()`, `transform()`, and `diff()` are sufficient for all database boundary patterns without a helper abstraction.

---

## 8. Testing status

| File | Tests |
|------|-------|
| `tests/database-boundary.test.js` | 33 tests |

Coverage: record read/parse, invalid records, safeParse, insert shape, invalid insert, update shape, partial update, update limitation, contract diff, mock/cases/test, database-neutral proof.

---

## 9. Extraction blockers

| Blocker | Severity |
|---------|----------|
| No proven adapter pattern for any specific database/ORM | high |
| ID generation strategy varies across stacks | high |
| Timestamp injection varies across stacks | medium |
| Partial update "at least one field" constraint is app-specific | medium |
| No user demand confirmed for `@sigil/db` | high |

---

## 10. Recommended future package shape

If `@sigil/db` is eventually extracted, the shape would be database-neutral wrappers, not adapters:

```js
// @sigil/db (hypothetical future package)
import { dbContract } from '@sigil/db';

const UserDB = dbContract({
  record: UserRecord,
  insert: NewUser,
  update: UserUpdate,
});

// UserDB.parseRecord(row)
// UserDB.parseInsert(input)
// UserDB.parseUpdate(patch)
```

Database adapters (for Prisma, Drizzle, etc.) would live in separate packages:
- `@sigil/db-prisma`
- `@sigil/db-drizzle`
- `@sigil/db-mongoose`

None of these should be in core until there is concrete adapter demand.

---

## 11. Recommendation

**Stay single package. Do not extract `@sigil/db` yet. Do not create `@sigil/db` until concrete adapter demand exists.**

Direct contract usage is sufficient. The examples and tests prove this. No helper abstraction is justified until:

1. At least one real-world ORM/adapter pattern has been proven in production
2. The record/insert/update split is stable across multiple architectures
3. ID and timestamp generation strategies are clarified
4. User demand for a `@sigil/db` package has been confirmed
