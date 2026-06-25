# CLI Examples — JS Module Contract Files

SigilJS contracts can be used from JavaScript and from the terminal.

These examples show how to use the `sigil` CLI with JavaScript module contract files (`.sigil.js`).

---

## Contract files

| File | Description |
|------|-------------|
| `contracts/user.sigil.js` | User contract with required/optional fields and enum role |
| `contracts/old-user.sigil.js` | Previous user contract (for diff) |
| `contracts/new-user.sigil.js` | New user contract with added fields (for diff) |
| `data/valid-user.json` | Valid user JSON data |
| `data/invalid-user.json` | Invalid user JSON (bad role value) |

---

## Example commands

Run from the repository root:

```bash
# Describe the contract structure
sigil describe examples/cli/contracts/user.sigil.js

# Validate a JSON data file
sigil check examples/cli/contracts/user.sigil.js examples/cli/data/valid-user.json
sigil check examples/cli/contracts/user.sigil.js examples/cli/data/invalid-user.json

# Project to JSON Schema
sigil json-schema examples/cli/contracts/user.sigil.js

# Project to TypeScript
sigil types examples/cli/contracts/user.sigil.js User

# Project to OpenAPI
sigil openapi examples/cli/contracts/user.sigil.js

# Project form constraints (experimental)
sigil form examples/cli/contracts/user.sigil.js

# Generate a valid mock fixture
sigil mock examples/cli/contracts/user.sigil.js

# Generate valid/invalid test cases
sigil cases examples/cli/contracts/user.sigil.js

# Run a contract self-test
sigil test examples/cli/contracts/user.sigil.js

# Diff two contracts
sigil diff examples/cli/contracts/old-user.sigil.js examples/cli/contracts/new-user.sigil.js
sigil diff examples/cli/contracts/old-user.sigil.js examples/cli/contracts/new-user.sigil.js --json
```

---

## Named exports

Use `--export <name>` to select a named export:

```js
// contracts/multi.sigil.js
export const User = sigil.exact({ name: String });
export const Post = sigil.exact({ title: String });
```

```bash
sigil describe contracts/multi.sigil.js --export User
sigil describe contracts/multi.sigil.js --export Post
```

---

## Notes

- `.sigil.js` files must export a Sigil contract as the default export (or a named export via `--export`).
- `.sigil` text files (template-literal format) are also supported.
- When running from the published package, replace `../../../src/index.js` with `@weipertda/sigiljs` in your contract files.
