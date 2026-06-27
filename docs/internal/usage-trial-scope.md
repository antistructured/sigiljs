# Usage Trial Scope

**Block:** Real-World Usage Trial  
**Pass:** 1 — Usage Trial Scope Design  
**Package:** `@weipertda/sigiljs` v0.16.0  
**Suggested target:** v0.17.0

---

## Goal

Validate SigilJS ergonomics in realistic consumer workflows outside the core-library mindset.

The previous release-candidate dry run proved the package artifact works. This trial asks whether the developer experience works when SigilJS is used naturally in small application-shaped workflows.

---

## Non-Goals

This block does not:

- cut `1.0.0`
- add new public APIs
- add new projection targets
- add new CLI commands
- add database helpers
- add AI provider helpers
- split packages
- stabilize CLI, HTTP helpers, or form constraints
- add runtime dependencies to the SigilJS package

---

## Workflows to Validate

Minimum usage workflows:

1. stable core JavaScript usage
2. stable core TypeScript usage
3. CLI workflow
4. HTTP request/response boundary
5. form value validation + constraint projection
6. database read/write boundary
7. AI structured output validation

---

## Stable-Core Usage to Validate

The stable-core trials should exercise application-style usage of:

- `sigil.exact()`
- `optional()`
- `union()`
- `oneOf()`
- `realType()`
- `parse()`
- `safeParse()`
- `assert()`
- `check()`
- `describe()`
- `toJSONSchema()`
- `toTypeScript()`
- `toOpenAPI()`
- `mock()`
- `cases()`
- `test()`
- `diff()`

No experimental API should be required for the stable-core ergonomics trial.

---

## Experimental Surfaces to Exercise

The trial will exercise these surfaces only as experimental usage evidence:

- `sigil` CLI
- `.sigil` and `.sigil.js` contract file workflows
- `httpContract()`
- `contract.toFormConstraints()`

Exercise does not imply stabilization.

---

## Friction Recording

Each trial report should record friction under these categories:

- API naming
- input/output shape clarity
- runtime error readability
- TypeScript ergonomics
- command-line ergonomics
- path/CWD assumptions
- projection usefulness
- docs/example sufficiency
- places where application logic remains necessary

The aggregate friction log will classify each item as:

- blocker before 1.0
- should fix before 1.0
- can defer
- keep experimental
- needs real-world user feedback

---

## Blocker Criteria

A finding is a blocker before 1.0 if it shows:

- a stable-core API is awkward enough to cause likely misuse
- a stable-core API's documented behavior does not match real usage
- package imports or TypeScript declarations fail in realistic consumer code
- an error shape or result shape is insufficient for application handling
- docs would lead a consumer into a broken workflow

---

## Acceptable Pre-1.0 Friction

The following are acceptable during this block if documented:

- CLI rough edges while CLI remains experimental
- HTTP helper awkwardness while `httpContract()` remains experimental
- form metadata gaps while `toFormConstraints()` remains experimental
- conservative TypeScript inference when explicit generics work
- no database helper if direct contracts remain understandable
- no AI provider helper if `toJSONSchema()` + `safeParse()` remain sufficient
- application-level constraints such as "at least one optional update field"

---

## Trial Artifact Policy

Reusable, runnable trial files should be checked in under `trials/` because they become future validation examples.

Purely temporary package-install or generated-output files should remain under `.tmp/` and be cleaned up unless specifically needed for debugging.

---

## Expected Output of the Block

This block should produce:

- trial workspaces under `trials/`
- per-workflow trial reports under `docs/internal/`
- aggregate friction log
- docs/recipes gap review
- final usage trial report
- final verification output

---

## Scope Decision

This block gathers evidence for the remaining 1.0 blockers. It may recommend an Ergonomics Fix Pack, Public Release Prep, or deeper Experimental Surface Field Trial, but it does not perform those future blocks.
