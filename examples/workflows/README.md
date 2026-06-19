# CLI Workflow Examples

These examples show SigilJS as a contract workflow system from the command line.

Each workflow starts with unknown input, enforces an executable contract, and produces trusted output or a projection for tools.

## Workflows

- [CLI API Response Check](cli-check-api-response/README.md) — validate unknown API response data before application code trusts it.
- [CLI Generate Types](cli-generate-types/README.md) — project a contract into TypeScript text for developer-facing artifacts.
- [CLI Generate JSON Schema](cli-generate-json-schema/README.md) — project a contract into JSON Schema for integration tooling.
- [CLI Diff Contracts](cli-diff-contracts/README.md) — compare previous and next boundary contracts.
- [CLI AI Output Check](cli-ai-output-check/README.md) — validate unknown AI structured output before trusting it.

## Run all workflows

From the repository root:

```bash
for script in examples/workflows/*/run.sh; do
  bash "$script"
done
```
