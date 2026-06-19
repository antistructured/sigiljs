# CLI

SigilJS includes a Bun-native CLI for contract workflows outside application code.

The package currently exposes the `sigil` bin from core:

```bash
sigil check schema.sigil data.json
sigil parse schema.sigil data.json
sigil safe-parse schema.sigil data.json
sigil describe schema.sigil
sigil json-schema schema.sigil
sigil types schema.sigil [Name]
sigil openapi schema.sigil
sigil mock schema.sigil
sigil diff before.sigil after.sigil
```

Most commands that produce projection artifacts already print deterministic JSON. Workflow commands that are useful for humans also support an optional `--json` flag for automation:

```bash
sigil check user.sigil user.json --json
sigil parse user.sigil user.json --json
sigil diff user-v1.sigil user-v2.sigil --json
```

When working from the repository, run the same CLI through Bun:

```bash
bun run src/playground.js check schema.sigil data.json
```

The CLI is dependency-free and intentionally small. A future package may split this into `@sigil/cli`, but not until the core API is stable.

## Schema files

A `.sigil` file contains a Sigil type expression:

```sigil
{
  id: number
  name: string
  age?: number
}
```

The CLI loads `.sigil` files through the same template-string contract path used by `` Sigil`...` `` in code. JavaScript module contract files are not part of this workflow yet.

JSON data files are regular `.json` files loaded from disk for commands such as `check`, `parse`, and `safe-parse`.

File-loading errors are reported with the file role and path:

```text
Contract file not found: contracts/user.sigil
Data file not found: data/user.json
Invalid Sigil contract in contracts/user.sigil: ...
Invalid JSON data in data/user.json: ...
```

## `check`

Validate JSON data against a schema file:

```bash
sigil check user.sigil user.json
```

Valid data exits with status `0`:

```text
✓ valid

Contract: User
Data: user.json
```

Invalid data exits with status `1` and prints path-aware diagnostics:

```text
✗ invalid

Path: age
Expected: number
Actual: string
Message: Expected property "age" to be number, got string
```

Use `--json` for deterministic machine-readable output:

```bash
sigil check user.sigil user.json --json
```

```json
{
  "success": false,
  "error": {
    "code": "SIGIL_VALIDATION_FAILED",
    "path": ["age"],
    "expected": "number",
    "actual": "string",
    "message": "Expected property \"age\" to be number, got string"
  }
}
```

## `parse`

Parse JSON data through the contract and print parsed trusted data as JSON:

```bash
sigil parse user.sigil user.json
```

Valid data exits with status `0` and prints the parsed data. Invalid data exits with status `1` and prints path-aware diagnostics.

Use `--json` to print validation failures as `{ "success": false, "error": ... }` while still exiting with status `1`.

## `safe-parse`

Parse JSON data through the contract without exiting non-zero for validation failures:

```bash
sigil safe-parse user.sigil user.json
```

Valid data prints:

```json
{
  "success": true,
  "data": { "id": 1, "name": "Dana" }
}
```

Invalid data prints:

```json
{
  "success": false,
  "error": {
    "code": "SIGIL_VALIDATION_FAILED",
    "message": "Expected property \"id\" to be number, got string",
    "path": ["id"],
    "expected": "number",
    "actual": "string"
  }
}
```

## `describe`

Print the stable contract description model:

```bash
sigil describe user.sigil
```

```json
{
  "kind": "object",
  "exact": false,
  "properties": [
    {
      "key": "id",
      "required": true,
      "contract": { "kind": "number" }
    }
  ]
}
```

## `json-schema`

Print the JSON Schema projection:

```bash
sigil json-schema user.sigil
```

## `types`

Print a TypeScript type declaration:

```bash
sigil types user.sigil User
```

The type name can be passed explicitly. When omitted, it is inferred from the schema filename:

```ts
type User = {
  id: number;
  name: string;
};
```

## `openapi`

Print the OpenAPI-compatible schema projection:

```bash
sigil openapi user.sigil
```

This uses the contract's existing `toOpenAPI()` method.

## `mock`

Print deterministic valid sample data:

```bash
sigil mock user.sigil
```

```json
{
  "id": 1,
  "name": "string"
}
```

## `diff`

Print an object-contract diff between two schema files:

```bash
sigil diff user-v1.sigil user-v2.sigil
```

The CLI treats the first file as the previous contract and the second file as the next contract. By default, `diff` prints grouped human-readable output:

```text
Contract changes:

BREAKING
- required property: email
- removed property: name

NON-BREAKING
- added property: displayName
```

Use `--json` to print the raw deterministic change array:

```bash
sigil diff user-v1.sigil user-v2.sigil --json
```

## Workflow examples

Runnable CLI workflows live in [`examples/workflows/`](../examples/workflows/README.md). They cover API response checks, TypeScript generation, JSON Schema generation, contract diffs, and AI structured-output checks.

## Legacy playground mode

The previous inline playground command still works:

```bash
bun run src/playground.js '{"name":"D"}' '{ name: string }'
```

This mode remains useful for quick one-off validation, but file-based commands are preferred for repeatable workflows.
