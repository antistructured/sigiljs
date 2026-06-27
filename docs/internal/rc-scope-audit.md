# Release Candidate Scope Audit

**Block:** Release Candidate Dry Run  
**Pass:** 1 — Release Candidate Scope Audit  
**Package:** `@weipertda/sigiljs` v0.15.0  
**Suggested dry-run target:** v0.16.0  
**Theme:** Release candidate dry run for the hardened stable core

---

## Current Version

Current package version at audit start:

```txt
0.15.0
```

This block rehearses a serious 0.x release candidate path. It does **not** cut or claim `1.0.0`.

---

## Release Candidate Target

Suggested target for this block:

```txt
0.16.0
```

The target is a dry-run release candidate for package consumption and release readiness, not a feature release and not a 1.0 stabilization claim.

---

## Stable Core Scope

The dry run validates package consumption for the hardened stable core:

- Define: `sigil()`, `sigil.exact()`, `optional()`, `oneOf()`, `union()`
- Enforce: `parse()`, `safeParse()`, `assert()`, `check()`
- Transform: `transform()`, `pipe()`, `trim()`, `serialize()`
- Project: `describe()`, `toJSONSchema()`, `toTypeScript()`, `toOpenAPI()`
- Prove: `mock()`, `cases()`, `test()`, `diff()`
- TypeScript declaration consumption via `index.d.ts`
- Public import policy and legacy alias compatibility

The stable core is already hardened and protected by regression tests. This block checks whether it works as a package artifact.

---

## Experimental Scope

Experimental surfaces remain available but are not promoted:

- `httpContract()`
- `contract.toFormConstraints()`
- `sigil` CLI workflows
- `.sigil` text file format
- `.sigil.js` CLI module workflow

This dry run verifies these are honestly documented and smoke-tests packaged CLI availability, but it does not stabilize them.

---

## Out-of-Scope 1.0 Decisions

This block does not decide or complete:

- final `1.0.0` readiness
- final `compile()` 1.0 posture
- real HTTP framework adoption
- real UI/form adoption
- real production CLI workflow adoption
- package extraction into `@sigil/*`
- semantic mock-data generation
- framework, ORM, UI, or provider adapters

---

## Known Blockers Before 1.0

Known blockers remain:

- real-world stable-core ergonomics validation
- real CLI workflow usage
- real HTTP helper framework/runtime usage
- real form/UI usage for `toFormConstraints()`
- final `compile()` 1.0 posture decision
- continued package-split deferral until usage justifies it

---

## What This Dry Run Validates

This release candidate dry run validates:

- package artifact integrity
- package metadata coherence
- `npm pack` contents
- fresh local tarball install
- public package imports
- basic package usage outside the repo source tree
- TypeScript declaration consumption
- packaged CLI bin availability and representative commands
- examples and recipes remain runnable
- README/docs release clarity
- known limitations and experimental warnings remain honest

---

## What This Dry Run Does Not Validate

This dry run does not validate:

- production HTTP framework integration
- production form/UI component integration
- production CLI workflow ergonomics
- production database/ORM integration
- final 1.0 compatibility guarantee
- real ecosystem package extraction demand

---

## Recommendation Gate

If package artifact, install, import, CLI, type, examples, docs, lint, test, and pack checks pass, this block can recommend:

```txt
Ready for a serious 0.x release candidate.
Do not cut 1.0 yet.
Proceed next to Real-World Usage Trial.
```
