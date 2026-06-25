# CLI Workflow Model Design

**Block:** CLI Workflow Contracts  
**Package:** `@weipertda/sigiljs`

---

## Philosophy

The CLI answers questions about contracts from the terminal:

```
What does this contract describe?       → describe
Can this data pass this contract?       → check / validate
What JSON Schema does this produce?     → json-schema
What TypeScript does this produce?      → types
What OpenAPI does this produce?         → openapi
What form constraints does this produce?→ form
What valid sample does this generate?   → mock
What test cases does this generate?     → cases
How does this contract test itself?     → test
How did this contract change?           → diff
```

---

## Contract file model

Two contract file formats are supported:

### `.sigil` text files (legacy, primary)

A `.sigil` file contains a Sigil type expression in the template-literal format:

```sigil
{
  id: string
  name: string
  role: 'admin' | 'user'
  age?: number
}
```

Loaded by the CLI's `compileSigil()` function via the template-literal path.

### `.sigil.js` JS module files (new)

A `.sigil.js` file is a JavaScript module that exports a Sigil contract:

```js
// user.sigil.js
import { sigil, oneOf, optional } from '@weipertda/sigiljs';

export default sigil.exact({
  id: String,
  name: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});
```

Loaded via dynamic `import()`. The CLI detects the file extension and routes accordingly.

Named exports are also supported:

```js
export const User = sigil.exact({ name: String });
```

Use `--export User` to select a named export.

---

## Default export behavior

When loading a `.sigil.js` file:
1. Try `module.default` first.
2. If no default export, fail with a clear error: `No default export found in <path>. Use --export <name> to specify a named export.`

---

## Named export behavior

`--export <Name>` selects a named export:

```bash
sigil describe ./contracts/user.sigil.js --export User
```

---

## JSON input behavior

JSON data files are loaded with `JSON.parse()` from disk.

Stdin support (`--stdin`) is a future addition — not required in this block.

---

## stdout behavior

All commands print to stdout. JSON outputs are pretty-printed (`JSON.stringify(value, null, 2)`). Human-readable outputs use plain text with `✓`/`✗` markers.

---

## File output behavior

`--out <path>` writes stdout to a file instead of printing it. Parent directories are not automatically created.

---

## Error behavior

- File not found → `Contract file not found: <path>`
- Invalid JSON → `Invalid JSON data in <path>: <message>`
- No default export → `No default export found in <path>. Use --export <name>.`
- Named export not found → `Named export '<name>' not found in <path>.`
- Invalid contract → `Invalid Sigil contract in <path>: <message>`
- All errors exit with code `1`.

---

## Non-goals

- The CLI does not compile TypeScript.
- The CLI does not watch files.
- The CLI does not run servers.
- The CLI does not replace test runners (Bun, Jest, Vitest).
- The CLI does not require a framework.
- The CLI does not connect to databases.
- The CLI does not make network calls.
