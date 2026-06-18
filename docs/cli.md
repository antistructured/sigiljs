# CLI

SigilJS includes a Bun-native CLI for contract workflows outside application code.

The package currently exposes the `sigil` bin from core:

```bash
sigil check schema.sigil data.json
sigil describe schema.sigil
sigil json-schema schema.sigil
sigil types schema.sigil
sigil mock schema.sigil
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

## `check`

Validate JSON data against a schema file:

```bash
sigil check user.sigil user.json
```

Valid data exits with status `0`:

```text
Sigil: user.sigil
Value: { "id": 1, "name": "Dana" }
Result: valid
```

Invalid data exits with status `1` and prints path-aware diagnostics:

```text
Sigil: user.sigil
Value: { "age": "old" }
Result: invalid
Path: age
Expected: number
Actual: string
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
sigil types user.sigil
```

The type name is inferred from the schema filename:

```ts
type User = {
  id: number;
  name: string;
};
```

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

## Legacy playground mode

The previous inline playground command still works:

```bash
bun run src/playground.js '{"name":"D"}' '{ name: string }'
```

This mode remains useful for quick one-off validation, but file-based commands are preferred for repeatable workflows.
