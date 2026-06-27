# Public Release Scope Audit

**Block:** 0.18.x Public Release Prep  
**Pass:** 1 — Public Release Scope Audit  
**Package:** `@weipertda/sigiljs`  
**Release target:** `0.18.0`  
**Theme:** public 0.x release prep

---

## Release Positioning

Core message:

```txt
SigilJS is ready for broader public 0.x usage, but not yet a 1.0.0 release.
```

This release prep block validates public readiness for a serious `0.x` release line. It does not claim long-term 1.0 stability.

---

## Stable Core Status

Stable core status: ready for broader public usage feedback.

The following have already been completed in prior blocks:

- stable core hardening
- stable core regression matrix
- release candidate dry run
- real-world usage trial
- ergonomics fix pack
- TypeScript declaration readiness
- final verification with lint, tests, type check, and pack dry run

Stable public pillars:

- Define
- Enforce
- Transform
- Project
- Prove

Stable core examples:

- `sigil()` / `sigil.exact()`
- `parse()` / `safeParse()` / `assert()` / `check()`
- `transform()` / `pipe()` / `trim()` / `serialize()`
- `describe()` / `toJSONSchema()` / `toTypeScript()` / `toOpenAPI()`
- `mock()` / `cases()` / `test()` / `diff()`
- conservative TypeScript declarations through `index.d.ts`

---

## Experimental Surfaces

These remain experimental for `0.18.0`:

- `sigil` CLI
- `.sigil` text contract format
- `httpContract()`
- `contract.toFormConstraints()`

They are intentionally available for usage and feedback, but their command names, output shapes, loading semantics, adapter expectations, and projection details may change before `1.0.0`.

---

## Known Limitations

Known limitations that remain honest public-release notes:

- CLI is Bun-first and experimental.
- `.sigil.js` loading is CWD-sensitive.
- TypeScript declarations are conservative and do not infer every object-definition shape.
- `mock()` output is structurally valid, not semantically realistic.
- `serialize()` validates but does not apply transforms.
- no `@sigil/*` package split exists.
- no framework, UI, ORM, database driver, or AI provider SDK adapters exist.
- `httpContract()` needs more real route/framework evidence before stabilization.
- `toFormConstraints()` needs real UI/form adapter evidence before stabilization.

---

## What This Release Is Ready For

This release is ready for:

- broader public `0.x` adoption and feedback
- stable-core runtime contract usage in real JavaScript projects
- TypeScript consumers using explicit generics and bundled declarations
- boundary validation for APIs, forms, database rows, AI structured outputs, config, and CLI inputs through stable direct contracts
- experimentation with CLI, HTTP, and form projection surfaces with clear warnings

---

## What This Release Is Not Claiming

This release does not claim:

- `1.0.0` stability
- frozen CLI compatibility
- stable `httpContract()` semantics
- stable `toFormConstraints()` semantics
- deep TypeScript inference
- framework adapters
- provider SDK helpers
- database or ORM integration
- package extraction into `@sigil/*`

---

## Remaining Before 1.0

Known pre-1.0 blockers:

- real CLI field usage before CLI stabilization
- final `.sigil` loading/syntax compatibility policy
- real HTTP runtime/framework usage before stabilizing `httpContract()`
- real form/UI usage before stabilizing `toFormConstraints()`
- broader public usage feedback on stable core
- final 1.0 compatibility and deprecation decisions

---

## Scope Boundary For This Block

Allowed:

- version and package metadata prep
- README polish
- docs navigation polish
- quickstart review
- examples/trials packaging decision
- npm package contents audit
- changelog and release notes
- limitations/experimental review
- release gate script decision
- final verification

Not allowed:

- feature expansion
- new public APIs
- new CLI commands
- experimental API stabilization
- package split
- runtime dependencies
- `1.0.0` versioning

---

## Blocker Assessment

No scope blocker remains.

Proceed with `0.18.0` public release prep.
