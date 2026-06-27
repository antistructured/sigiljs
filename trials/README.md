# SigilJS Real-World Usage Trials

Small runnable consumer-style workflows used to validate SigilJS ergonomics before a future 1.0.0.

These trials are intentionally application-shaped but dependency-light. They are not new public APIs and they do not stabilize experimental surfaces.

## Workspaces

- `stable-core/` — stable JavaScript core ergonomics
- `typescript-consumer/` — TypeScript declaration ergonomics
- `cli-workflow/` — experimental CLI workflow evidence
- `http-runtime/` — request/response boundary usage
- `form-constraints/` — form validation + experimental constraint projection
- `database-boundary/` — database read/write boundary patterns without a database driver
- `ai-output/` — provider-neutral AI structured-output validation

## Rules

- Keep files small and runnable.
- Prefer imports from `../../src/index.js` for checked-in repo trials.
- Do not add runtime dependencies to the SigilJS package.
- If a trial needs a dependency later, isolate it inside the trial workspace and document it.
