# Contract Files

**Status: Experimental. The CLI is Bun-first, and the `.sigil` text format plus CLI module-loading behavior may change before 1.0.0.**

The CLI loads contracts from two formats.

---

## `.sigil` text files

A `.sigil` file contains a Sigil type expression:

```
{ id: number, name: string, age?: number }
```

Supported types in `.sigil` text format:

```
string, number, boolean, null
{ key: type }         — object
{ key?: type }        — optional field
'literal' | 'union'   — literal union
```

Example commands:

```bash
sigil describe contracts/user.sigil
sigil check contracts/user.sigil data/user.json
```

---

## `.sigil.js` JS module files

A `.sigil.js` file exports a Sigil contract:

```js
// contracts/user.sigil.js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

export default sigil.exact({
  id: String,
  name: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});
```

The CLI loads the default export. Use `--export <name>` for named exports.

---

## Named exports

```js
// contracts/auth.sigil.js
export const LoginRequest = sigil.exact({ email: String, password: String });
export const LoginResponse = sigil.exact({ token: String });
```

```bash
sigil describe contracts/auth.sigil.js --export LoginRequest
sigil describe contracts/auth.sigil.js --export LoginResponse
```

---

## Error messages

| Situation | Error |
|-----------|-------|
| File not found | `Contract file not found: <path>` |
| Invalid `.sigil` syntax | `Invalid Sigil contract in <path>: <message>` |
| Module load failure | `Failed to load contract module <path>: <message>` |
| No default export | `No default export found in <path>. Use --export <name>.` |
| Named export not found | `Named export '<name>' not found in <path>. Available: ...` |
| Export is not a contract | `Export '<name>' in <path> is not a Sigil contract.` |

---

## Choosing between formats

Use `.sigil` text files for:
- simple one-off schemas
- quick validation from the terminal
- cases where you don't want a JS build step

Use `.sigil.js` module files for:
- contracts already defined in your codebase
- contracts using `sigil.exact()`, `optional()`, `oneOf()`, and other JS API features
- sharing contracts between application code and CLI workflows

For real projects, prefer `.sigil.js` until the `.sigil` text format has a compatibility policy. Run commands from the project root or use absolute paths because module loading is resolved relative to the current working directory.
