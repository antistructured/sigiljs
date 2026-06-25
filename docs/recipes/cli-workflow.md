# CLI Workflow Recipe

**Boundary:** Contract files → terminal commands → stdout / files

**The CLI is experimental — command and output shapes may change before 1.0.0.**

---

## Problem

You want to validate data, generate schema artifacts, or compare contract versions from the terminal — without writing a custom script for each operation.

---

## Setup

Create a `.sigil.js` contract file:

```js
// contracts/user.sigil.js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

export default sigil.exact({
  id: String,
  name: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});
```

Create a data file:

```json
// data/valid-user.json
{ "id": "u1", "name": "Alex", "email": "alex@example.com", "role": "user" }
```

---

## Commands

### Describe

```bash
sigil describe contracts/user.sigil.js
```

Prints the stable contract description model.

### Validate

```bash
sigil check contracts/user.sigil.js data/valid-user.json
# → ✓ valid

sigil check contracts/user.sigil.js data/invalid-user.json
# → ✗ invalid  (exit 1)
```

### Project

```bash
sigil json-schema contracts/user.sigil.js
sigil types contracts/user.sigil.js User
sigil openapi contracts/user.sigil.js
sigil form contracts/user.sigil.js     # experimental
```

### Prove

```bash
sigil mock contracts/user.sigil.js
sigil cases contracts/user.sigil.js
sigil test contracts/user.sigil.js
```

### Diff

```bash
sigil diff contracts/old-user.sigil.js contracts/new-user.sigil.js
sigil diff contracts/old-user.sigil.js contracts/new-user.sigil.js --json
```

### File output

```bash
sigil json-schema contracts/user.sigil.js --out generated/user.schema.json
sigil types contracts/user.sigil.js User --out generated/user.d.ts
```

---

## Named exports

```bash
sigil describe contracts/multi.sigil.js --export UserRecord
```

---

## Example files

Runnable CLI examples live in [`examples/recipes/cli/`](../../examples/recipes/cli/).

Run commands from the repository root:

```bash
sigil describe examples/recipes/cli/user.sigil.js
sigil check examples/recipes/cli/user.sigil.js examples/recipes/cli/valid-user.json
sigil mock examples/recipes/cli/user.sigil.js
sigil diff examples/recipes/cli/old-user.sigil.js examples/recipes/cli/new-user.sigil.js
```

---

## Limits

- The CLI is **experimental**. Commands and output formats may change before 1.0.0.
- `.sigil` text-file loading is Bun-specific. Use `.sigil.js` module files for Node.js compatibility.
- JS module loading resolves imports relative to `process.cwd()`.
- See [`docs/known-limitations.md`](../known-limitations.md) for the full list.
- See [`docs/cli/`](../cli/) for full CLI documentation.
