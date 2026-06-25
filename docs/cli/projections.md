# CLI Projections

Project a contract into JSON Schema, TypeScript, OpenAPI, or form constraints from the terminal.

---

## `describe`

Print the stable contract description model:

```bash
sigil describe contracts/user.sigil.js
```

```json
{
  "kind": "object",
  "exact": true,
  "properties": [
    { "key": "id", "required": true, "contract": { "kind": "string" } }
  ]
}
```

---

## `json-schema`

Print the JSON Schema projection:

```bash
sigil json-schema contracts/user.sigil.js
```

```json
{
  "type": "object",
  "properties": { "id": { "type": "string" } },
  "required": ["id"]
}
```

---

## `types`

Print a TypeScript type declaration:

```bash
sigil types contracts/user.sigil.js User
```

The type name can be explicit. When omitted, it is inferred from the filename.

```typescript
type User = {
  id: string;
  name: string;
  role: "admin" | "user";
  age?: number;
};
```

---

## `openapi`

Print the OpenAPI-compatible schema projection:

```bash
sigil openapi contracts/user.sigil.js
```

Uses the contract's `toOpenAPI()` method.

---

## `form`

Print form constraint metadata (experimental):

```bash
sigil form contracts/user.sigil.js
```

```json
{
  "fields": {
    "name": { "name": "name", "path": ["name"], "type": "text", "required": true, "label": "Name" },
    "role": { "name": "role", "path": ["role"], "type": "select", "required": true, "label": "Role", "options": ["admin", "user"] }
  }
}
```

---

## `--out` — write to file

Use `--out` to write projection output to a file instead of stdout:

```bash
sigil json-schema contracts/user.sigil.js --out generated/user.schema.json
sigil types contracts/user.sigil.js User --out generated/user.d.ts
```
