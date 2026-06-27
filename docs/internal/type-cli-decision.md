# CLI Type Declaration Decision — `sigil` bin

> **Status:** Decision recorded — no action required
> **Relates to:** `type-declaration-strategy.md`

---

## Decision

**The `sigil` CLI binary does not need TypeScript declarations.**

No `@types/sigil-cli` package, no CLI type exports, no declaration stubs for the bin entry point.

---

## Background

`package.json` registers a binary:

```json
{
  "bin": {
    "sigil": "./src/playground.js"
  }
}
```

This maps the `sigil` shell command to `src/playground.js`, a terminal-facing interactive tool (the "playground" / REPL-style runner).

---

## Reasoning

| Consideration | Assessment |
|---------------|------------|
| **Usage pattern** | The CLI is invoked from a terminal (`sigil run contract.js`, `sigil check ...`). It is not imported as a module by userland code. |
| **Programmatic API** | The CLI has no exported functions, no `import`-able surface. There is nothing to declare types for. |
| **TypeScript consumer impact** | Zero. A TypeScript project `import`ing `@weipertda/sigiljs` receives the programmatic API types from `index.d.ts`. The CLI is invisible to `import` statements. |
| **Stability** | The CLI is **experimental**. Its flags, subcommands, and output format may change between minor versions. Codifying a type surface would imply a stability contract that doesn't exist. |
| **Precedent** | CLI-only bins in the npm ecosystem (e.g. `prettier`, `eslint`) do not ship type declarations for their bin entry points. Types ship only for the programmatic/plugin APIs. |

---

## Explicit Non-Decisions

- ❌ No `@types/sigil-cli` package will be created or published
- ❌ No `sigil-cli.d.ts` or similar declaration stub
- ❌ No CLI-related exports added to `index.d.ts`
- ❌ No `CliOptions`, `CliCommand`, or similar types exposed to consumers
- ❌ No DefinitelyTyped (`@types/`) submission for the CLI surface

---

## CLI Experimental Status

The `sigil` CLI is considered **experimental** as of v0.10.0:

- Its command structure may change without a semver major bump
- Output format (stdout/stderr) is not part of the public contract
- It is primarily a development/debugging convenience tool
- It is included in the published package (`bin` in `files`) but carries no API stability guarantees

If the CLI is ever promoted to stable and gains a programmatic API (e.g. `import { run } from '@weipertda/sigiljs/cli'`), a separate type declaration entry in `exports` would be warranted at that point.

---

## References

- Strategy: [`docs/internal/type-declaration-strategy.md`](./type-declaration-strategy.md)
- Audit: [`docs/internal/type-surface-audit.md`](./type-surface-audit.md)
