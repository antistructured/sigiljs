# Trial Workspace Setup

**Block:** Real-World Usage Trial  
**Pass:** 2 — Trial Workspace Setup  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Goal

Create a structured place for real-world usage trials that can remain checked in as runnable validation artifacts.

---

## Created Workspace

```txt
trials/
├── README.md
├── stable-core/
├── typescript-consumer/
├── cli-workflow/
├── http-runtime/
├── form-constraints/
├── database-boundary/
└── ai-output/
```

---

## Artifact Policy

The `trials/` directory is kept because it documents repeatable, application-shaped usage evidence. Temporary generated outputs should stay under `.tmp/` and be cleaned up.

---

## Dependency Policy

No runtime dependency was added to SigilJS. Trial files should remain dependency-free unless a future field trial intentionally isolates a framework dependency inside a trial workspace.

---

## Package Runtime Dependency Check

`package.json` still has no `dependencies` field entries. Runtime dependencies remain zero.

---

## Blockers

None.
