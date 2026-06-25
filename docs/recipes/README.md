# SigilJS Recipes

Recipes show how SigilJS contracts move through real application boundaries.

Each recipe starts with a problem, defines one or more contracts, enforces them at a boundary, and demonstrates the full Define → Enforce → Transform → Project → Prove lifecycle.

---

## Recipe structure

Every recipe follows this pattern:

| Step | Description |
|------|-------------|
| **Problem** | What boundary problem the recipe solves |
| **Contract** | The Sigil contract definition |
| **Boundary** | Where the contract is enforced |
| **Implementation** | How to use parse/safeParse at the boundary |
| **Validation** | Error handling and invalid input behavior |
| **Projection** | JSON Schema, TypeScript, OpenAPI, or form output |
| **Prove** | mock(), cases(), and test() for the contract |
| **Run it** | How to run the example |
| **Limits** | What this recipe doesn't cover |

---

## End-to-end recipes (full lifecycle)

- [Full Lifecycle](full-lifecycle.md) — all five pillars in one contract workflow ⭐

---

## Boundary recipes

- [API Route](api-route.md) — request body + response boundary with safeParse + OpenAPI
- [LLM Output](llm-output.md) — validate uncertain AI structured output
- [Form Submission](form-submission.md) — validate form values + project form constraints
- [Database Persistence](database-persistence.md) — record/insert/update boundaries + diff
- [CLI Workflow](cli-workflow.md) — terminal contract commands

---

## Prove recipes

- [Contract Testing](contract-testing.md) — mock(), cases(), test() in depth

---

## Boundary reference recipes

These shorter recipes document patterns for specific boundary types:

- [API request contracts](api-request-contracts.md)
- [API response contracts](api-response-contracts.md)
- [AI output contracts](ai-output-contracts.md)
- [Database contracts](database-contracts.md)
- [Form contracts](form-contracts.md)
- [Event contracts](event-contracts.md)
- [Queue contracts](queue-contracts.md)
- [Webhook contracts](webhook-contracts.md)
- [Config contracts](config-contracts.md)
- [Local storage contracts](local-storage-contracts.md)
- [Plugin contracts](plugin-contracts.md)

---

## Runnable examples

All end-to-end recipes have runnable examples in `examples/recipes/`:

```bash
bun run examples/recipes/api-route.js
bun run examples/recipes/llm-output.js
bun run examples/recipes/form-submission.js
bun run examples/recipes/database-persistence.js
bun run examples/recipes/contract-testing.js
bun run examples/recipes/full-lifecycle.js
```

CLI recipe files are in `examples/recipes/cli/`.

---

## Rules for all recipes

- All examples are dependency-free
- No network calls
- No external services
- Deterministic output
- Plain JavaScript objects
- Public package imports only
