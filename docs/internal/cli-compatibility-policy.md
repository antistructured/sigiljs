# CLI Compatibility Policy

**Block:** Ergonomics Fix Pack  
**Pass:** 3 — CLI Compatibility Policy  
**Package:** `@weipertda/sigiljs`  
**Observed version:** `0.16.0`

---

## Decision

**Chosen option:** Option A — CLI is Bun-first experimental.

Policy:

```txt
The `sigil` bin remains exposed for 0.x usage.
It is Bun-first and experimental.
Command names, output formats, exit-code contracts, CWD/module-loading behavior, and `.sigil` text-format compatibility are not frozen before 1.0.
```

---

## Current Runtime Expectations

The published bin points to:

```txt
src/playground.js
```

The file has a Bun shebang:

```txt
#!/usr/bin/env bun
```

The implementation imports Bun APIs:

```txt
import { file, write } from 'bun'
```

Therefore the CLI should be documented as Bun-first. Node is supported for the package runtime import surface, but the current CLI implementation itself requires Bun.

---

## Supported Contract File Formats

### Preferred: `.sigil.js`

`.sigil.js` module files are the preferred practical workflow for real projects because they use normal JavaScript modules and can share contracts with application code.

Supported current behavior:

- default export loading
- single named export auto-selection
- explicit named export selection through `--export <name>`
- CWD-relative dynamic import resolution

Caveat: CWD-relative module loading can surprise users when a command is run from outside the expected project root.

### Experimental: `.sigil`

`.sigil` text files are supported by the CLI, but remain experimental and Bun-specific because they are compiled through the template-literal path.

Use `.sigil` for small terminal workflows, not as the recommended long-term project format before compatibility is frozen.

---

## Current Command Inventory

Current direct commands:

- `check`
- `parse`
- `safe-parse`
- `describe`
- `json-schema`
- `types`
- `openapi`
- `form`
- `mock`
- `cases`
- `test`
- `diff`

There is no `project <target>` command.

Projection commands are direct commands:

```txt
json-schema
types
openapi
form
```

---

## Current Flag Inventory

Current flags:

- `--json` for selected automation-friendly output paths
- `--export <name>` for `.sigil.js` named exports
- `--out <path>` for writing projection/prove output to a file

Flag parsing is hand-rolled and experimental.

---

## Working Directory Assumptions

`.sigil.js` module paths are resolved relative to `process.cwd()`.

Policy before stabilization:

- run commands from the project root when using relative paths
- prefer `.sigil.js` imports that match the command's working directory expectations
- use absolute paths if CWD is ambiguous

---

## Bin Name Policy

The current bin name is:

```txt
sigil
```

Do not rename it in this block.

Before any future 1.0 guarantee, decide whether the core package should continue exposing the CLI or whether a future package split is justified by real usage.

---

## Compatibility Promise for 0.x

For 0.x, users can try the CLI, but should expect possible changes to:

- command names
- flags
- human-readable output text
- JSON output shapes
- exit-code guarantees
- `.sigil` text syntax
- module-loading behavior
- CWD-relative resolution
- packaged-bin runtime requirements

Docs should call this out anywhere CLI workflows are shown.

---

## What Needs Evidence Before Stabilization

Before the CLI can be stable, SigilJS needs real usage evidence for:

- installed package workflows using `sigil`
- `.sigil.js` files in real projects
- whether `.sigil` text files are useful enough to freeze
- automation expectations for `--json` output
- CI usage and exit-code expectations
- CWD/module resolution expectations
- whether direct projection commands are preferable to a grouped `project` command

---

## Non-Goals

This pass does not:

- add a CLI command
- rename the bin
- stabilize the CLI
- change output shapes
- change exit codes
- add Node CLI support
- add framework/build-system integration

---

## Blocker Assessment

No blocker for continued 0.x CLI exposure.

The CLI remains an experimental Bun-first workflow until field evidence justifies stabilization.
