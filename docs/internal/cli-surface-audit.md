# CLI Surface Audit

**Block:** CLI Workflow Contracts  
**Package:** `@weipertda/sigiljs`

---

## Summary

A full CLI already exists. It is implemented, tested, and documented. The block must extend — not replace — the current CLI surface.

---

## Current CLI files

| File | Description |
|------|-------------|
| `src/playground.js` | Main CLI entry point — 427 lines, fully implemented |
| `tests/cli.test.js` | CLI tests — 407 lines, 16+ test cases |
| `docs/cli.md` | CLI reference docs — 271 lines, all commands documented |
| `examples/workflows/` | 5 runnable CLI workflow examples with README |

---

## Current `package.json` bin entries

```json
{
  "bin": {
    "sigil": "./src/playground.js"
  }
}
```

The bin is named `sigil` (not `sigiljs`). This is the existing convention; the block spec's suggestion of `sigiljs` is superseded by the existing published bin.

---

## Current CLI commands

| Command | Status | Description |
|---------|--------|-------------|
| `check` | exists | Validate JSON against `.sigil` file — human/JSON output |
| `parse` | exists | Parse JSON through contract — prints trusted data |
| `safe-parse` | exists | Parse without exit-nonzero — prints `{ success, data/error }` |
| `describe` | exists | Print contract description JSON |
| `json-schema` | exists | Print JSON Schema projection |
| `types` | exists | Print TypeScript type declaration |
| `openapi` | exists | Print OpenAPI projection |
| `mock` | exists | Print deterministic valid sample data |
| `diff` | exists | Compare two `.sigil` contract files |
| `cases` | **missing** | Generate valid/invalid test cases |
| `test` | **missing** | Run contract test report |
| `form` (projection) | **missing** | Print form constraint projection |

---

## Current CLI examples

`examples/workflows/` directory contains 5 runnable workflows:
- `cli-check-api-response/` — validate unknown API data
- `cli-generate-types/` — project TypeScript
- `cli-generate-json-schema/` — project JSON Schema
- `cli-diff-contracts/` — compare contracts
- `cli-ai-output-check/` — validate AI structured output

---

## Current CLI docs

`docs/cli.md` covers all current commands with examples, schema file format, and workflow examples. The doc references `examples/workflows/`.

No `docs/cli/` multi-page directory exists yet.

---

## Current CLI tests

`tests/cli.test.js` tests 16+ scenarios:
- help output
- check (valid/invalid, JSON output)
- describe (valid, missing file, invalid contract)
- json-schema
- openapi
- types (inferred/explicit name)
- parse (valid/invalid/JSON output)
- safe-parse (success/failure)
- mock
- diff (human/JSON output)
- bin command smoke test

No `tests/cli-workflows.test.js` exists yet.

---

## Whether CLI exists

**Yes.** Fully implemented at `src/playground.js`.

---

## Whether CLI is published through `package.json`

**Yes.** `"bin": { "sigil": "./src/playground.js" }`.

---

## Whether CLI has dependencies

**None.** Uses only `bun`/Node built-ins (`node:path`, `node:os`, `node:fs/promises`, Bun's `$`, `file`, `write`). Zero runtime dependencies.

---

## Whether CLI consumes public contract APIs

**Partially.** The CLI loads contracts from `.sigil` text files using the template-string parser (`T(strings)` from `./index.js`). This is the legacy template-literal approach. It does not yet support JS module exports (`import { default } from './contract.js'`).

The `readSigil()` function compiles `.sigil` text strings — it does not use `import()` dynamic module loading.

---

## Gaps vs. block spec

| Gap | Priority |
|-----|----------|
| JS module loading (`export default sigil.exact({...})`) | high |
| `cases` CLI command | medium |
| `test` CLI command | medium |
| `form` projection command | low |
| `--export` flag for named exports | medium |
| `examples/cli/` with JS contract fixtures | medium |
| `docs/cli/` multi-page docs | medium |
| `tests/cli-workflows.test.js` | medium |

---

## Recommended scope for this block

1. **Add JS module contract loading** — support `.sigil.js` files via dynamic `import()`.
2. **Add `cases` and `test` commands** — expose Prove pillar commands.
3. **Add `form` projection command** — expose `toFormConstraints()`.
4. **Add `--export` flag** — support named exports.
5. **Create `examples/cli/`** — JS module contract fixtures and data files.
6. **Create `docs/cli/`** — multi-page docs (overview, contract-files, projections, validation, prove, diff).
7. **Create `tests/cli-workflows.test.js`** — JS module loading tests + new commands.
8. **All internal docs** — workflow model, entry decision, extraction readiness, containment report.
