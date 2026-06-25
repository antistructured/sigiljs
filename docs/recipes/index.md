# Boundary Contract Recipes

Recipes show how SigilJS contracts move through real application boundaries.

See [docs/recipes/README.md](README.md) for the full recipe index.

## Quick links

### End-to-end recipes

- [Full Lifecycle](full-lifecycle.md) — all five pillars ⭐
- [API Route](api-route.md) — request + response boundary
- [LLM Output](llm-output.md) — validate AI structured output
- [Form Submission](form-submission.md) — form values + projection
- [Database Persistence](database-persistence.md) — record/insert/update + diff
- [CLI Workflow](cli-workflow.md) — terminal contract commands
- [Contract Testing](contract-testing.md) — mock, cases, test

### Boundary reference recipes

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

## Recipe structure

Every recipe follows the same path:

1. Boundary problem
2. Sigil contract
3. Unknown input
4. Enforcement using `parse`, `safeParse`, or `assert`
5. Trusted output
6. Optional projection
