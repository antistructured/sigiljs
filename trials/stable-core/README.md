# Stable Core Ergonomics Trial

Application-style JavaScript trials for the stable core.

## Run

```bash
bun run trials/stable-core/user-profile.js
bun run trials/stable-core/support-ticket.js
```

## What this validates

- object contract definitions with `sigil.exact()`
- optional fields, literal choices, unions
- parse/safeParse/assert/check flows
- path-aware error handling
- describe/JSON Schema/TypeScript/OpenAPI projections
- mock/cases/test proof helpers
- diff-based lifecycle review

No experimental APIs are used in this trial.
