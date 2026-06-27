# Database Boundary Trial

Database read/write boundary patterns without adding database dependencies.

## Run

```bash
bun run trials/database-boundary/user-record.js
bun run trials/database-boundary/account-settings.js
```

## What this validates

- parsing rows read from storage
- parsing insert values
- parsing update values
- partial update shapes
- serialized write shapes
- record diff/proof helpers
- app ownership of ids and timestamps

For `diff()` interpretation, use `Next.diff(Previous)` and see `docs/diff.md`.

No database driver or ORM dependency is used. No `dbContract()` helper is added.
