# Experimental Boundary Guard Report

**Block:** Stable Core Regression Matrix  
**Pass:** 9 — Experimental Boundary Guard Matrix  
**Package baseline:** `@weipertda/sigiljs` v0.14.0

---

## Goal

Verify that experimental SigilJS surfaces remain clearly labeled, contained, and excluded from stable-core promotion during the regression matrix block.

Experimental surfaces checked:

- `httpContract()`
- `contract.toFormConstraints()`
- `sigil` CLI workflows
- `.sigil` text contract file format

---

## Files inspected

- `docs/experimental.md`
- `docs/stability.md`
- `README.md`
- `docs/known-limitations.md`
- `docs/projections/http.md`
- `docs/projections/forms.md`
- `docs/cli.md`
- `docs/cli/contract-files.md`
- `docs/forms/form-contracts.md`
- `index.d.ts`
- `package.json`
- focused regression tests added in this block

---

## Files changed

- `docs/cli.md`
- `docs/cli/contract-files.md`
- `docs/internal/experimental-boundary-guard-report.md`

---

## Findings

### `httpContract()`

Status: **contained / experimental**

Evidence:

- Listed in `docs/experimental.md` as experimental.
- Listed in `docs/stability.md` under Experimental APIs.
- Dedicated docs at `docs/projections/http.md` begin with `Status: Experimental`.
- README lists HTTP helpers under Experimental features, not in the quickstart.
- `index.d.ts` marks `HttpContractOptions`, `HttpContract`, and `httpContract()` with `@experimental`.
- Regression tests assert `httpContract` remains exported but do not promote it to stable.

No action needed.

### `toFormConstraints()`

Status: **contained / experimental**

Evidence:

- Listed in `docs/experimental.md` as experimental.
- Listed in `docs/stability.md` under Experimental APIs.
- Dedicated docs at `docs/projections/forms.md` begin with `Status: Experimental`.
- README lists form constraints under Experimental features.
- `index.d.ts` marks `toFormConstraints()` with `@experimental`.
- Projection regression tests keep it as an experimental smoke, not a stable-core guarantee.

No action needed.

### CLI workflows

Status: **contained / experimental**

Evidence:

- Listed in `docs/experimental.md` as experimental.
- Listed in `docs/stability.md` under Experimental APIs.
- README CLI section explicitly says the CLI is experimental.
- `docs/known-limitations.md` warns that CLI commands, flags, and output formats may change before 1.0.0.
- `docs/cli.md` now includes an explicit top-level experimental status warning.

Action taken:

- Added a top-level status note to `docs/cli.md`.

### `.sigil` text contract file format

Status: **contained / experimental**

Evidence:

- Listed in `docs/experimental.md` as part of CLI workflow support.
- Listed in `docs/stability.md` as an experimental surface with syntax compatibility still pending.
- `docs/known-limitations.md` documents Bun-specific `.sigil` loading.
- `docs/cli/contract-files.md` now includes an explicit top-level experimental status warning.

Action taken:

- Added a top-level status note to `docs/cli/contract-files.md`.

---

## README exposure check

README exposure is acceptable:

- Stable quickstart uses `sigil.exact()`, `safeParse()`, and stable helpers.
- HTTP helpers are not presented as quickstart/stable usage.
- Form constraints appear only in the stable API quick map with `(experimental)` and in the Experimental features section.
- CLI is explicitly labeled experimental.
- Future `@sigil/*` extraction is described as deferred.

---

## Package split check

No docs claim any `@sigil/*` package currently exists.

Docs describe future package extraction only as deferred/planned boundary language:

- `@sigil/cli`
- `@sigil/http`
- `@sigil/forms`
- `@sigil/db`
- `@sigil/ai`
- `@sigil/types`

This is consistent with the no-package-split policy.

---

## TypeScript declaration check

`index.d.ts` preserves experimental markings:

- `toFormConstraints()` has `@experimental`.
- `HttpContractOptions` has `@experimental`.
- `HttpContract` has `@experimental`.
- `httpContract()` has `@experimental`.

No declaration change was required.

---

## Regression-test posture

Focused regression tests added in this block treat experimental APIs as boundary guards:

- `tests/regression-projection-api.test.js` smokes `toFormConstraints()` but labels it experimental.
- `tests/regression-public-exports.test.js` confirms `httpContract` is exported as an experimental HTTP boundary helper.
- `tests/typescript-declarations/stable-core.ts` confirms experimental HTTP declarations compile without treating HTTP as stable core.

---

## Blockers

None.

Remaining pre-1.0 limitations are expected and documented:

- HTTP helpers need real framework/runtime usage.
- Form constraints need real UI/form usage.
- CLI workflows need real workflow usage and frozen output/exit contracts.
- `.sigil` file format needs syntax compatibility policy before stabilization.

---

## Recommendation

Keep `httpContract()`, `toFormConstraints()`, CLI workflows, and `.sigil` files experimental through this block.

Do not promote any experimental surface to stable core during the Stable Core Regression Matrix block.
