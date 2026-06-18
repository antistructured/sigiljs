# Roadmap

SigilJS is evolving toward an executable data contract system for JavaScript.

The near-term goal is to keep one stable core package while the contract object shape, `describe()` model, and first projection APIs mature.

v1 positioning:

```txt
SigilJS is an executable data contract system for JavaScript.

Define structure once. Project it everywhere.
```

See [v1 Readiness](v1-readiness.md) for the stabilization checklist.

## Done

- Primitive, literal, union, array, optional, and object type expressions
- `.check()` boolean validation
- `.assert()` with path-aware diagnostics
- `.parse()` / `.safeParse()` boundary enforcement
- Exact object mode
- Named sigils for reusable and recursive contracts
- `Sigil.collection()` for scoped reusable groups
- Contract-level and field-level transforms
- Stable `describe()` model for projections
- JSON Schema projection
- TypeScript string projection
- OpenAPI-compatible projection
- Forms constraint projection
- HTTP boundary helpers
- AI structured-output examples
- Deterministic testing helpers with `mock()` and `cases()`
- Object contract lifecycle diffs
- File-based Bun-native CLI commands
- Compiled validator cache and hot-path fast paths
- `realType()` runtime type helper

## Near term

- Polish public docs and examples
- Keep benchmark coverage current
- Stabilize the projection contract model across real examples
- Improve CLI ergonomics without splitting packages yet
- Add more examples for API boundaries, config validation, and contract lifecycle checks

## Package split policy

Do not prematurely split packages.

SigilJS should remain a single package until the stable public surfaces are mature enough for ecosystem packages to consume without depending on internals.

Recommended split point:

- `describe()` is stable
- JSON Schema projection is stable
- TypeScript projection is stable
- OpenAPI projection is stable

Future package shape:

- `@sigil/core` — runtime contract definition, validation, transforms, and stable `describe()` model
- `@sigil/json-schema` — JSON Schema projection and schema-specific compatibility behavior
- `@sigil/ts` — TypeScript declaration/file generation without a runtime TypeScript dependency
- `@sigil/openapi` — OpenAPI operation/schema helpers and HTTP documentation utilities
- `@sigil/forms` — form metadata and UI/framework adapter constraints
- `@sigil/ai` — LLM structured-output, tool-call, and repair-flow helpers
- `@sigil/http` — HTTP request/response boundary helpers and framework adapters
- `@sigil/testing` — fixture generation, cases, fuzzing, and test-runner integrations
- `@sigil/cli` — command distribution once CLI behavior is stable

Each package needs a clear reason to exist. No package should exist just for aesthetics.

See [Package Split Policy](package-split.md).

## Possible later work

- Nested contract diffs and compatibility scoring
- Fuzzing with deterministic seeds
- More collection ergonomics
- Safer public registry tooling
- Common format helpers such as uuid/email/url as opt-in contracts
- More benchmark scenarios against handwritten checks and popular validators
- Stabilized grammar reference before v1.0

## Non-goals for now

- Premature package splitting
- A full docs site
- A full REPL or TUI
- A large transformation/refinement framework
- Replacing TypeScript or Zod in every use case
