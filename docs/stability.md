# Stability Map

**Package:** `@weipertda/sigiljs` v0.18.0

This page documents what is a stable core candidate, what is experimental, what is internal, and what is intentionally deferred before a future `1.0.0`.

SigilJS is written in JavaScript and ships TypeScript declarations for public API consumption. The declarations are part of the public package surface, while the implementation remains plain JavaScript.

---

## What 1.0 will mean

A future `1.0.0` will mean the stable core API is trusted for long-term use and will not change in a breaking way without a major version.

The stable core is the part of SigilJS intended to become the future 1.0 surface.

Experimental APIs are available for real-world use, but may change before 1.0.

SigilJS should enter 1.0 with a small, trusted stable core and clearly marked experimental edges.

---

## Stable core candidates

The following APIs are stable candidates for the future 1.0 core. They are documented, tested, and expected to remain unless a pre-1.0 audit or hardening pass finds a critical issue.

### Contract constructors

| API | Notes |
|-----|-------|
| `sigil(definition)` | Primary object-definition API |
| `sigil.exact(definition)` | Exact mode (strict field validation) |
| `Sigil` | Template-literal contract syntax; supported, but `sigil()` is preferred in new docs |
| `optional(contract)` | Mark a field optional |
| `union(a, b, ...)` | Union type |
| `oneOf(...literals)` | Literal union / enum |
| `pipe(contract, ...transforms)` | Field-level transform composition |
| `trim()` | String trim transform |

### Contract methods

| Method | Notes |
|--------|-------|
| `parse(value)` | Throws `SigilValidationError` on invalid input; applies transforms |
| `safeParse(value)` | Returns `{ success: true, data }` or `{ success: false, error }` |
| `assert(value)` | Throws on invalid input |
| `check(value)` | Returns boolean |
| `describe()` | Returns structural contract description model |
| `toJSONSchema()` | JSON Schema projection |
| `toTypeScript(name?)` | TypeScript type declaration projection |
| `toOpenAPI()` | OpenAPI-compatible schema projection |
| `transform(fn)` | Returns new contract with transform; output is validated against the same contract shape |
| `withMetadata(meta)` | Attach name/version/description/tags |
| `serialize(value)` | Validates and returns; does **not** apply transforms |
| `mock(options?)` | Deterministic structurally valid sample value |
| `cases(options?)` | `{ valid, invalid }` test case sets |
| `test(cases)` | Contract self-test summary object |
| `diff(other)` | Structural change report; direction is from the caller's perspective |
| `version(v)` | Metadata shorthand for contract version |
| `named(name)` | Named sigil reference through template helpers |
| `compile()` | Advanced compiled-validator access; pre-1.0 stabilization candidate as a contract method, not a root export |

### Error types

| Type | Notes |
|------|-------|
| `SigilValidationError` | Structured error with frozen stable fields `{ code, message, path, expected, actual }` |

### Utilities

| API | Notes |
|-----|-------|
| `realType(value)` | Runtime type detection |

### TypeScript declarations

| Surface | Notes |
|---------|-------|
| `index.d.ts` | Conservative TypeScript declarations for public API consumption |
| `SigilContract<T>` | Caller-supplied generic type model; no deep definition-object inference yet |

---

## Legacy aliases / pre-1.0 decisions

The following aliases exist for compatibility but should not be used in new docs or examples:

| API | Status | 1.0 posture |
|-----|--------|-------------|
| `S` | legacy supported alias of `Sigil` | keep exported but deprecated in types; do not use in new docs |
| `T` | legacy supported alias of `Sigil` | keep exported but deprecated in types; do not use in new docs |
| `real` | legacy supported alias of `realType` | keep exported but deprecated in types; do not use in new docs |
| `Real` | legacy supported alias of `realType` | keep exported but deprecated in types; do not use in new docs |

---

## Experimental APIs

The following APIs are exported and tested but may change before 1.0.0.

| API | What it does | Docs | Stabilization blocker |
|-----|-------------|------|-----------------------|
| `httpContract()` | Framework-neutral HTTP boundary helper | [docs/projections/http.md](projections/http.md) | Needs real framework/runtime usage |
| `contract.toFormConstraints()` | Form field metadata projection | [docs/projections/forms.md](projections/forms.md) | Needs real UI/form usage |
| `sigil` CLI (`sigil` bin) | Terminal contract workflows | [docs/cli.md](cli.md) | Needs real workflow usage and frozen output/exit contracts |
| `.sigil` file format | CLI text contract format | [docs/cli/contract-files.md](cli/contract-files.md) | Needs syntax compatibility policy |

Do not rely on these for long-term API stability unless you are prepared to update with minor releases.

---

## Internal-only

The following are implementation details that are not public API:

- `src/core/` parser, registry, cache, and validator internals
- `src/projections/` internal projection function signatures
- `src/testing/` internal test runner utilities
- `SigilProjectionError` and projection helper errors
- Runtime contract properties: `ast`, `raw`, `source`, `normalized`, `options`, `validator`
- Low-level compiler functions such as `src/core/compile.js`'s `compile()` export

Public access should stay through package exports and documented contract methods only.

---

## Deferred package extraction

The following future packages are planned boundaries only and do not exist yet:

| Package | Status | Blocker |
|---------|--------|---------|
| `@sigil/cli` | deferred | Needs stable core + real CLI usage |
| `@sigil/http` | deferred | Needs proven adapter patterns |
| `@sigil/forms` | deferred | Needs real-world UI/form usage data |
| `@sigil/db` | deferred | No adapter demand confirmed |
| `@sigil/ai` | deferred | No provider-specific helper needed yet |
| `@sigil/types` | deferred | Bundled `index.d.ts` is sufficient for now |

No extraction will occur until the core API reaches 1.0.0 and real usage justifies separate packages.

---

## Required decisions before 1.0

- Confirm stable core export names.
- Confirm stable core behavior with a regression matrix.
- Gather real-world usage before stabilizing CLI, HTTP helpers, or form constraints.
- Keep `contract.compile()` advanced and document that the low-level compiler is not a root export.
- Decide whether CLI remains exposed in the core package during 1.0.
- Keep HTTP helpers and form constraints experimental unless real usage proves readiness.

---

## Known limitations

See [`docs/known-limitations.md`](known-limitations.md) for a full list.

Key limitations:

- `.sigil` template-literal CLI loading is Bun-specific
- JS module CLI loading uses CWD-relative URL resolution
- TypeScript declarations are conservative and do not yet infer every object-definition shape
- `mock()` values are structurally valid but not semantically meaningful
- HTTP helpers, form constraints, and CLI are experimental
- No ORM, framework middleware, UI adapters, or provider SDK helpers exist
