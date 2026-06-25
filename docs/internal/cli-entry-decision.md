# CLI Entry Decision

**Block:** CLI Workflow Contracts  
**Package:** `@weipertda/sigiljs`

---

## Decision: Option A (already enacted) — experimental CLI exposed through `package.json`

The CLI is already exposed via `"bin": { "sigil": "./src/playground.js" }`. This block hardens the existing CLI rather than making the exposure decision.

---

## Bin name

The bin is named `sigil`. The block spec suggested `sigiljs` but the existing published bin is `sigil`. The existing convention is maintained.

---

## Experimental status

The CLI is currently documented in `docs/cli.md` and referenced from `examples/workflows/README.md`. It is marked as experimental in the existing docs:

> "The CLI is dependency-free and intentionally small. A future package may split this into `@sigil/cli`, but not until the core API is stable."

The CLI should be explicitly listed in `docs/experimental.md` if not already present.

---

## What this block adds

- JS module contract loading (`.sigil.js` files)
- `cases` and `test` Prove commands
- `form` projection command
- `--export` flag for named exports
- `examples/cli/` JS module fixtures
- `docs/cli/` multi-page docs
- `tests/cli-workflows.test.js`

---

## What would justify extraction to `@sigil/cli`

- The core API is stable (1.0.0)
- At least one version cycle with no breaking CLI command changes
- Real-world usage has validated the file-loading model
- User demand for a standalone CLI package has been confirmed
