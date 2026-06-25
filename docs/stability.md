# Stability Map

**Package:** `@weipertda/sigiljs` v0.10.0

This page documents what is stable, what is experimental, and what is intentionally deferred.

---

## Stable core

The following APIs are stable. They will not change in a breaking way before 1.0.0 unless a critical bug requires it.

### Contract constructors

| API | Notes |
|-----|-------|
| `sigil(definition)` | Primary object-definition API |
| `sigil.exact(definition)` | Exact mode (strict field validation) |
| `Sigil` | Template-literal contract syntax |
| `optional(contract)` | Mark a field optional |
| `union(a, b, ...)` | Union type |
| `oneOf(...literals)` | Literal union / enum |
| `pipe(contract, ...transforms)` | Field-level transform composition |
| `trim()` | String trim transform |

### Contract methods

| Method | Notes |
|--------|-------|
| `parse(value)` | Throws `SigilValidationError` on invalid input |
| `safeParse(value)` | Returns `{ success, data }` or `{ success, error }` |
| `assert(value)` | Throws on invalid, returns void |
| `check(value)` | Returns boolean |
| `describe()` | Returns stable contract description model |
| `toJSONSchema()` | JSON Schema projection |
| `toTypeScript(name?)` | TypeScript type declaration |
| `toOpenAPI()` | OpenAPI schema projection |
| `transform(fn)` | Returns new contract with transform |
| `withMetadata(meta)` | Attach name/version/description/tags |
| `serialize(value)` | Validate and return (applies transforms) |
| `mock(options?)` | Deterministic valid sample value |
| `cases(options?)` | `{ valid, invalid }` test case sets |
| `test(cases)` | Run and report contract behavior |
| `diff(other)` | Structural change report |
| `version(v)` | Version contract |
| `named(name)` | Named sigil reference |
| `compile()` | Compiled validator |

### Error types

| Type | Notes |
|------|-------|
| `SigilValidationError` | Structured error with `path`, `expected`, `actual`, `code` |

### Utilities

| API | Notes |
|-----|-------|
| `realType(value)` | Runtime type detection |

---

## Experimental APIs

The following APIs are exported and tested but may change before 1.0.0.

| API | What it does | Docs |
|-----|-------------|------|
| `httpContract()` | Framework-neutral HTTP boundary helper | [docs/projections/http.md](projections/http.md) |
| `contract.toFormConstraints()` | Form field metadata projection | [docs/projections/forms.md](projections/forms.md) |
| `sigil` CLI (`sigil` bin) | Terminal contract workflows | [docs/cli.md](cli.md) |

Do not rely on these for long-term API stability unless you are prepared to update with minor releases.

---

## Internal-only

The following are implementation details that are not public API:

- `src/core/` — parser internals
- `src/projections/forms.js` internal function signatures
- `src/testing/` internal test runner utilities
- `SigilProjectionError` (internal projection error type)

---

## Deferred package extraction

The following future packages are planned but intentionally deferred:

| Package | Status | Blocker |
|---------|--------|---------|
| `@sigil/cli` | deferred | Needs stable core + real usage |
| `@sigil/http` | deferred | Needs proven adapter patterns |
| `@sigil/forms` | deferred | Needs real-world usage data |
| `@sigil/db` | deferred | No adapter demand confirmed |
| `@sigil/ai` | deferred | No provider-specific helper needed yet |

No extraction will occur until the core API reaches 1.0.0.

---

## Known limitations

See [`docs/known-limitations.md`](known-limitations.md) for a full list.

Key limitations:
- `.sigil` template-literal CLI loading is Bun-specific
- JS module CLI loading uses CWD-relative URL resolution
- HTTP helpers, form constraints, and CLI are experimental
- No ORM, framework middleware, or UI adapters exist
