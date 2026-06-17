# CLI Playground

SigilJS comes with a CLI tool for experimenting with schemas and validating raw JSON data directly in your terminal.

## Running the Playground

You can run the playground script using Bun:

```bash
bun run src/playground/playground.js <json-data> <schema>
```

### Argument Format
1. `<json-data>`: A valid JSON string representing the data you want to validate.
2. `<schema>`: The Sigil validation schema string (omit the `Sigil` tag and backticks).

## Examples

### Valid Data

```bash
bun run src/playground/playground.js '{"name": "Alice", "age": 30}' '{ name: string, age?: number }'
# Output:
# ✅ Validation passed
```

### Invalid Data

```bash
bun run src/playground/playground.js '{"name": "Alice", "age": "thirty"}' '{ name: string, age?: number }'
# Output:
# ❌ Validation failed
# Code: SIGIL_VALIDATION_FAILED
# Message: Expected property "age" to be number, got string
# Path: age
# Expected: number
# Actual: string
```

### Invalid JSON

If the data argument is not valid JSON, the playground reports it:

```bash
bun run src/playground/playground.js 'invalid-json' '{ name: string }'
# Output:
# ❌ Error parsing JSON: Unexpected token i in JSON at position 0
```
