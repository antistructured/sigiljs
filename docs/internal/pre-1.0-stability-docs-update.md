# Pre-1.0 Stability Docs Update Report

**Package:** `@weipertda/sigiljs` v0.13.0  
**Pass:** 9 — Stability Docs Update

---

## Scope

Updated public-facing stability documentation based on the pre-1.0 audits and plans.

Files inspected:

- `docs/stability.md`
- `docs/experimental.md`
- `docs/known-limitations.md`
- `docs/api.md`
- `README.md`
- `docs/internal/pre-1.0-public-export-audit.md`
- `docs/internal/pre-1.0-contract-method-audit.md`
- `docs/internal/pre-1.0-experimental-surface-audit.md`
- `docs/internal/pre-1.0-change-list.md`
- `docs/internal/pre-1.0-deprecation-internalization-plan.md`

Files changed:

- `package.json`
- `README.md`
- `docs/stability.md`
- `docs/experimental.md`
- `docs/known-limitations.md`
- `docs/api.md`

---

## Docs Updated

### `docs/stability.md`

Reworked into a pre-1.0 stability map with:

- what 1.0 will mean
- stable core candidates
- TypeScript declaration status
- legacy aliases / pre-1.0 decisions
- experimental APIs and stabilization blockers
- internal-only surfaces
- deferred package extraction
- required decisions before 1.0
- known limitations

Added required language:

```txt
The stable core is the part of SigilJS intended to become the future 1.0 surface.

Experimental APIs are available for real-world use, but may change before 1.0.
```

### `README.md`

Updated status line:

- version `0.13.0`
- core API is a stable candidate for future 1.0
- HTTP helpers, form constraints, and CLI remain experimental

### `docs/api.md`

Updated top-level status labels:

- stable candidates: `0.13.0`
- experimental APIs: `0.13.0`

### `docs/experimental.md`

Updated experimental API version label to `0.13.0`.

### `docs/known-limitations.md`

Updated package version to `0.13.0` and clarified that `@sigil/*` entries are planned boundaries only, not current packages.

### `package.json`

Bumped to `0.13.0` for the audit release theme.

---

## Stability Posture After Update

Stable core candidates:

- object API and helper constructors
- enforcement methods
- core projection methods
- structural prove methods
- `realType`
- `SigilValidationError`
- conservative TypeScript declarations

Experimental surfaces:

- `httpContract()`
- `toFormConstraints()`
- `sigil` CLI
- `.sigil` file format

Deferred:

- `@sigil/*` package extraction
- framework/UI/ORM/provider adapters
- deep TypeScript inference

Pre-1.0 decision areas:

- `Sigil` vs `sigil` policy
- legacy aliases
- error/result shapes
- transform/serialize semantics
- Prove output shapes
- `compile()` stability
- CLI exposure policy

---

## Blockers

No blockers for docs update.

Remaining blockers are product/stability decisions before a future 1.0, not documentation gaps.
