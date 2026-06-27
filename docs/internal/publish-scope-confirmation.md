# Publish Scope Confirmation

**Block:** Publish Readiness Gate — Manual Virtual Sub-Agent Workflow  
**Pass:** 1 — Publish Scope Confirmation  
**Virtual sub-agent:** publish-scope-agent  
**Package:** `@weipertda/sigiljs`  
**Version:** `0.18.0`

---

## Scope Confirmed

This gate prepares the final human-reviewed publish decision for:

```txt
@weipertda/sigiljs@0.18.0
```

Release type:

```txt
public 0.x release
```

Release theme:

```txt
Publish readiness gate
```

This is not a feature block and does not change public API behavior.

---

## Stable Core Status

The stable core is ready for broader public feedback.

Stable public pillars remain:

- Define
- Enforce
- Transform
- Project
- Prove

Stable-core public usage is represented by:

- `sigil()` / `sigil.exact()`
- `parse()` / `safeParse()` / `assert()` / `check()`
- `transform()` / `pipe()` / `trim()` / `serialize()`
- `describe()` / `toJSONSchema()` / `toTypeScript()` / `toOpenAPI()`
- `mock()` / `cases()` / `test()` / `diff()`
- `SigilValidationError`
- `realType()`
- bundled `index.d.ts`

---

## Experimental Surfaces

These surfaces remain experimental and subject to change before `1.0.0`:

- `sigil` CLI
- `.sigil` text contract format
- `httpContract()`
- `contract.toFormConstraints()`

No experimental API is promoted by this gate.

---

## What This Release Claims

This release claims:

- SigilJS is ready for broader public `0.x` usage feedback.
- Stable core behavior has been hardened and verified.
- Public docs and examples are coherent enough for serious `0.x` adoption.
- Package contents are intentional.
- Runtime dependencies remain zero.
- The package remains a single package: `@weipertda/sigiljs`.

---

## What This Release Does Not Claim

This release does not claim:

- `1.0.0` stability
- frozen CLI compatibility
- stable `.sigil` text-format compatibility
- stable `httpContract()` semantics
- stable `toFormConstraints()` semantics
- deep TypeScript object-definition inference
- framework adapters
- UI adapters
- ORM/database adapters
- AI provider SDK adapters
- package extraction into `@sigil/*`

---

## Files Inspected

- `package.json`
- `README.md`
- `CHANGELOG.md`
- `docs/stability.md`
- `docs/experimental.md`
- `docs/known-limitations.md`
- `docs/internal/public-release-prep-report.md`
- `docs/internal/final-verification-summary-0.18.x-public-release-prep.md`

---

## Blockers

None.

Publish scope is clear and remains correctly positioned as public `0.x`, not `1.0.0`.
