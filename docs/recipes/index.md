# Boundary Contract Recipes

Define structure once. Project it everywhere.

These recipes show SigilJS as an executable data contract system at real system boundaries. Each page starts with unknown data, defines one contract object, enforces it into trusted runtime data, and optionally projects the same contract for surrounding tools.

## Recipes

- [API request contracts](api-request-contracts.md)
- [API response contracts](api-response-contracts.md)
- [Database contracts](database-contracts.md)
- [Form contracts](form-contracts.md)
- [Event contracts](event-contracts.md)
- [Queue contracts](queue-contracts.md)
- [Webhook contracts](webhook-contracts.md)
- [Config contracts](config-contracts.md)
- [Local storage contracts](local-storage-contracts.md)
- [Plugin contracts](plugin-contracts.md)
- [AI output contracts](ai-output-contracts.md)

## Recipe structure

Every recipe follows the same path:

1. Boundary problem
2. Sigil contract
3. Unknown input
4. Enforcement using `parse`, `safeParse`, or `assert`
5. Trusted output
6. Optional projection
