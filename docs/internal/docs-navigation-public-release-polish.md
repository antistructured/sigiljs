# Docs Navigation Public Release Polish

**Block:** 0.18.x Public Release Prep  
**Pass:** 4 — Docs Index + Navigation Polish  
**Package:** `@weipertda/sigiljs`  
**Release target:** `0.18.0`

---

## Files Inspected

- `docs/README.md`
- `docs/api.md`
- `docs/quickstart.md`
- `docs/typescript.md`
- `docs/diff.md`
- `docs/stability.md`
- `docs/known-limitations.md`
- `docs/experimental.md`
- `docs/recipes/`
- `docs/cli/`
- `docs/forms/`
- `docs/database/`
- AI docs under `docs/ai/` and `docs/projections/ai-structured-output.md`
- `examples/README.md`
- `trials/README.md`

---

## Navigation Status

The docs index provides a clear new-user path:

1. Introduction
2. Quickstart
3. Sigils
4. Public API Reference
5. TypeScript Usage
6. Stability Map
7. Known Limitations

Stable core docs are discoverable from both `README.md` and `docs/README.md`.

TypeScript and `diff()` guides are directly linked from the docs index and README/API context.

Recipes, examples, and trials are separated:

- `docs/recipes/` for public recipe documentation
- `examples/` for runnable examples
- `trials/` for internal consumer-style evidence before 1.0

Internal reports are listed as internal history only and are not required for normal users.

---

## Changes Made

Fixed one stale docs-index link:

- `docs/projections/typescript.md` → `docs/typescript.md`

The missing target did not exist, while `docs/typescript.md` is the current public TypeScript usage guide.

---

## Link Verification

Mechanical link check over `README.md` and `docs/README.md` found:

```txt
no missing README/docs index links
```

---

## Experimental Navigation

Experimental surfaces are discoverable through:

- `docs/experimental.md`
- `docs/projections/http.md`
- `docs/projections/forms.md`
- `docs/cli/overview.md`

The docs index does not imply CLI, `httpContract()`, or `toFormConstraints()` are stable.

---

## Blocker Assessment

No docs-navigation blocker remains for public `0.18.0` release prep.
