# CLI Extraction Readiness Report

**Block:** CLI Workflow Contracts  
**Package:** `@weipertda/sigiljs`

---

## 1. Current package name

`@weipertda/sigiljs` — single package, no split.

---

## 2. CLI entry status

**Exposed** via `"bin": { "sigil": "./src/playground.js" }` in `package.json`.

---

## 3. CLI commands

| Command | Status |
|---------|--------|
| `check` | exists, tested |
| `parse` | exists, tested |
| `safe-parse` | exists, tested |
| `describe` | exists, tested |
| `json-schema` | exists, tested |
| `types` | exists, tested |
| `openapi` | exists, tested |
| `form` | new in this block, tested |
| `mock` | exists, tested |
| `cases` | new in this block, tested |
| `test` | new in this block, tested |
| `diff` | exists, tested |

---

## 4. CLI public surface

The CLI is published via the `sigil` bin. It is **experimental** — commands and flags may change before 1.0.0.

New in this block:
- `.sigil.js` JS module contract loading via dynamic `import()`
- `--export <name>` flag for named module exports
- `--out <path>` flag for file output
- `form` projection command
- `cases` prove command
- `test` prove command

---

## 5. Dependency status

**Zero runtime dependencies.** Uses only Bun built-ins (`bun`, `node:path`, `node:os`, `node:fs/promises`).

---

## 6. Contract loading status

Two loading paths:

| Path | Mechanism |
|------|-----------|
| `.sigil` text files | `compileSigil()` via template-literal path |
| `.sigil.js` JS modules | dynamic `import()` with URL resolution |

---

## 7. Projection workflow status

All projection commands consume public contract APIs:
- `describe()`, `toJSONSchema()`, `toTypeScript()`, `toOpenAPI()`, `toFormConstraints()`

---

## 8. Validation workflow status

All validation commands use `assert()`, `parse()`, `safeParse()`.

---

## 9. Prove workflow status

`mock()`, `cases()`, `test()` are all exposed via CLI commands.

---

## 10. Diff workflow status

`diff()` is exposed via `sigil diff`. Human and JSON output modes.

---

## 11. Testing status

| File | Tests |
|------|-------|
| `tests/cli.test.js` | 22 (original commands, `.sigil` format) |
| `tests/cli-workflows.test.js` | 17 (JS module loading, new commands, flags) |

Total: **39 CLI-specific tests**

---

## 12. Extraction blockers

| Blocker | Severity |
|---------|----------|
| Template-literal `.sigil` loading is Bun-specific | medium |
| JS module loading works but depends on `import()` URL resolution at CWD | medium |
| No confirmed real-world CLI usage data | high |
| `cases` and `test` commands are new and not yet battle-tested | medium |

---

## 13. Recommended future package shape

If `@sigil/cli` is eventually extracted:

```
@sigil/cli
  bin/sigil.js       — CLI entry point
  src/loader.js      — contract file loading
  src/commands/      — one file per command group
```

Adapters for specific package managers or environments might live in:
- `@sigil/cli-bun` — Bun-specific optimizations
- `@sigil/cli-node` — Node.js compatibility layer

---

## 14. Recommendation

**Stay single package. Do not extract `@sigil/cli` yet.**

The CLI is experimental and needs at least one minor release cycle of stability before extraction. The template-literal loading path is tightly coupled to the Bun runtime. When the core API stabilizes at 1.0.0, the extraction conversation becomes worth having.
