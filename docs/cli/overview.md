# CLI Overview

SigilJS contracts can be used from JavaScript and from the terminal.

The `sigil` CLI makes contract workflows operational without writing custom scripts for every operation.

**Status: Experimental.** The CLI may change before 1.0.0.

---

## Installation

```bash
# Use from the repository
bun run src/playground.js --help

# Use after installing the package
bun add @weipertda/sigiljs
bunx sigil --help
```

---

## Command reference

| Command | Description |
|---------|-------------|
| `check` | Validate JSON data against a contract |
| `parse` | Parse and print trusted data |
| `safe-parse` | Parse without exit-nonzero |
| `describe` | Print contract description JSON |
| `json-schema` | Print JSON Schema projection |
| `types` | Print TypeScript type declaration |
| `openapi` | Print OpenAPI projection |
| `form` | Print form constraint projection |
| `mock` | Print deterministic valid sample |
| `cases` | Print generated valid/invalid cases |
| `test` | Print contract self-test report |
| `diff` | Compare two contract files |

---

## Contract file formats

The CLI supports two contract file formats:

### `.sigil` text files

```
{ id: number, name: string, role: 'admin' | 'user' }
```

### `.sigil.js` JS module files

```js
import { sigil, oneOf, optional } from '@weipertda/sigiljs';

export default sigil.exact({
  id: String,
  name: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});
```

The CLI detects the file extension and routes accordingly.

---

## Options

| Option | Description |
|--------|-------------|
| `--json` | Output as machine-readable JSON (`check`, `parse`, `diff`) |
| `--export <name>` | Use a named export from a `.sigil.js` module |
| `--out <path>` | Write output to a file instead of stdout |

---

## Non-goals

- The CLI does not compile TypeScript.
- The CLI does not watch files.
- The CLI does not run servers.
- The CLI does not replace test runners.
- The CLI does not require a framework.

---

## Docs

- [Contract Files](./contract-files.md)
- [Projections](./projections.md)
- [Validation](./validation.md)
- [Prove](./prove.md)
- [Diff](./diff.md)
