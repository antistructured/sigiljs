# CLI Containment Report

**Block:** CLI Workflow Contracts  
**Package:** `@weipertda/sigiljs`

---

## Summary

The CLI surface is contained, verified, and safe to ship as experimental. All tasks are complete. Tests pass. Lint is clean. Pack is clean. No runtime dependencies. No package split.

**Decision: CLI remains experimental. Stay single package. Do not extract `@sigil/cli` yet.**

---

## 1. Current package name

`@weipertda/sigiljs` — unchanged. No split.

---

## 2. CLI status

Experimental. Published via `"bin": { "sigil": "./src/playground.js" }`.

---

## 3. CLI bin entry

```json
{
  "bin": {
    "sigil": "./src/playground.js"
  }
}
```

The bin is named `sigil`. No `sigiljs` alias.

---

## 4. Public CLI commands

| Command | Added | Tested |
|---------|-------|--------|
| `check` | pre-block | ✅ |
| `parse` | pre-block | ✅ |
| `safe-parse` | pre-block | ✅ |
| `describe` | pre-block | ✅ |
| `json-schema` | pre-block | ✅ |
| `types` | pre-block | ✅ |
| `openapi` | pre-block | ✅ |
| `form` | this block | ✅ |
| `mock` | pre-block | ✅ |
| `cases` | this block | ✅ |
| `test` | this block | ✅ |
| `diff` | pre-block | ✅ |

New flags added: `--export <name>`, `--out <path>`

---

## 5. Experimental status

Marked experimental in:
- `docs/experimental.md` — CLI listing added
- `docs/cli.md` — "experimental" reference
- `docs/cli/overview.md` — "Status: Experimental" at top

---

## 6. Dependency status

**Zero runtime dependencies.** Bun built-ins only.

Confirmed: `package.json` `"dependencies": {}`.

---

## 7. Test coverage summary

| File | Tests |
|------|-------|
| `tests/cli.test.js` | 22 |
| `tests/cli-workflows.test.js` | 17 |

Total: **39 CLI-specific tests**

---

## 8. Docs consistency summary

| File | Status |
|------|--------|
| `docs/cli.md` | pre-existing, unchanged |
| `docs/cli/overview.md` | Created |
| `docs/cli/contract-files.md` | Created |
| `docs/cli/projections.md` | Created |
| `docs/cli/validation.md` | Created |
| `docs/cli/prove.md` | Created |
| `docs/cli/diff.md` | Created |
| `docs/experimental.md` | Updated with CLI listing |
| `README.md` | 6 new docs links added |
| `examples/cli/` | Created with contracts + data + README |

---

## 9. Package exposure summary

The CLI is exposed via the `sigil` bin. It is intentionally experimental. No accidental stable-API promotion. The `src/playground.js` file is the single CLI entry point.

---

## 10. Release readiness

| Gate | Result |
|------|--------|
| `bun test` | **493 pass, 0 fail** |
| `bun run lint` | **exit 0 (clean)** |
| `npm pack --dry-run` | **clean, 246 files** |
| Runtime dependencies | **0** |
| New top-level JS exports | **0** |
| Package split | **None** |

---

## 11. Recommendation

**CLI remains experimental. Stay single package. Do not extract `@sigil/cli` yet. Proceed to Release/Public Adoption Hardening after this block.**

---

## Files created or modified

| File | Change |
|------|--------|
| `src/playground.js` | Added JS module loading, form/cases/test commands, --export/--out flags |
| `tests/cli-workflows.test.js` | Created — 17 tests |
| `examples/cli/contracts/user.sigil.js` | Created |
| `examples/cli/contracts/old-user.sigil.js` | Created |
| `examples/cli/contracts/new-user.sigil.js` | Created |
| `examples/cli/data/valid-user.json` | Created |
| `examples/cli/data/invalid-user.json` | Created |
| `examples/cli/README.md` | Created |
| `docs/cli/overview.md` | Created |
| `docs/cli/contract-files.md` | Created |
| `docs/cli/projections.md` | Created |
| `docs/cli/validation.md` | Created |
| `docs/cli/prove.md` | Created |
| `docs/cli/diff.md` | Created |
| `docs/experimental.md` | Updated — CLI listing added |
| `README.md` | 6 new docs links |
| `docs/internal/cli-surface-audit.md` | Created |
| `docs/internal/cli-workflow-model.md` | Created |
| `docs/internal/cli-entry-decision.md` | Created |
| `docs/internal/cli-extraction-readiness.md` | Created |
| `docs/internal/cli-containment-report.md` | Created (this file) |
