# Pre-1.0 CLI / Bin Exposure Audit

**Package:** `@weipertda/sigiljs` v0.12.0  
**Pass:** 5 — CLI / Bin Exposure Audit

---

## Scope

Audited package bin exposure, CLI command surface, file-loading formats, docs, and tests before a future 1.0 freeze.

Files inspected:

- `package.json`
- `src/playground.js`
- `docs/cli.md`
- `docs/cli/`
- `docs/stability.md`
- `docs/experimental.md`
- `docs/known-limitations.md`
- `tests/cli.test.js`
- `tests/cli-workflows.test.js`
- `examples/cli/contracts/`
- `examples/cli/data/`

No `bin/` directory exists. The package bin points directly to `src/playground.js`.

---

## Bin Exposure

Package metadata:

```json
{
  "bin": {
    "sigil": "./src/playground.js"
  }
}
```

Current recommendation: **keep CLI exposed as experimental**.

Do not stabilize the CLI before real-world usage. Do not rename the bin in this block.

---

## Command Inventory

Commands in `src/playground.js`:

```txt
check
parse
safe-parse
describe
json-schema
types
openapi
form
mock
cases
test
diff
```

Options:

```txt
--json        machine-readable output for supported commands
--export <N>  select a named export from a .sigil.js module
--out <path>  write output to a file
```

Contract file formats:

```txt
.sigil      text Sigil type expressions
.sigil.js   JavaScript modules with default or named Sigil contract exports
```

---

## Test Coverage

Coverage exists in:

- `tests/cli.test.js` — original `.sigil` format and core commands
- `tests/cli-workflows.test.js` — JS module loading, `form`, `cases`, `test`, `--export`, `--out`

Covered behavior includes:

- loading `.sigil` text contracts
- loading `.sigil.js` default exports
- loading named exports with `--export`
- auto-selecting a single named export
- clear missing-file errors
- rejecting non-contract exports
- writing output with `--out`
- machine-readable JSON output for supported commands

---

## Known Limitations / Risks

| Risk | Status | 1.0 impact |
|------|--------|------------|
| Bun-native shebang/runtime | known | CLI portability must be decided before CLI stabilization |
| `.sigil` file format stability | experimental | syntax compatibility policy needed before 1.0 CLI stability |
| JS module loading is CWD-relative | known | needs clear docs and examples |
| No confirmed real-world CLI usage | known | major blocker to stabilization |
| `form` command exposes experimental form constraints | known | CLI command must remain experimental while projection is experimental |
| Bin name permanence | unresolved | if `sigil` is not final, rename before 1.0; current settled project decision is to keep `sigil` |
| Package exposes CLI from core | accepted for 0.x | extraction deferred; no package split before 1.0 |

---

## Documentation Findings

- `docs/experimental.md` lists CLI as experimental.
- `docs/stability.md` lists CLI as experimental.
- `docs/known-limitations.md` documents Bun-specific and CWD-relative loading limitations.
- `docs/cli/contract-files.md` documents `.sigil.js` module files and `--export`.
- `docs/cli.md` contains stale wording saying JavaScript module contract files are not part of the workflow yet. That should be updated in the docs consistency pass.

---

## Required Decision

Chosen recommendation:

```txt
keep CLI exposed as experimental
```

Rationale:

- Existing CLI is tested and useful for adoption.
- Removing it now would reduce workflow coverage and documentation value.
- Stabilizing it now would overpromise command, output, file-format, and runtime compatibility.
- Renaming the bin is not justified in this audit; the settled project decision is `sigil`.

---

## Stabilization Requirements

Before CLI can be stable:

1. Confirm `sigil` is the final bin name.
2. Freeze command names and required positional arguments.
3. Freeze exit-code behavior.
4. Freeze JSON output shapes for automation.
5. Decide compatibility policy for `.sigil` syntax.
6. Decide compatibility policy for `.sigil.js` module loading.
7. Document Bun/runtime requirements clearly.
8. Collect real-world usage from at least one project workflow.

---

## 1.0 Recommendation

Keep CLI available but experimental through the pre-1.0 period.

Do not split into `@sigil/cli` before core 1.0.

Do not stabilize CLI before real-world usage proves the command model.
