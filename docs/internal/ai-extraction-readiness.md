# AI Extraction Readiness Report

Current package: `@weipertda/sigiljs`
Block context: Five-Pillar Model + AI Boundary Contracts

This report evaluates whether AI boundary helpers are ready for extraction into a future `@sigil/ai` package.
The recommendation should be read as a snapshot of readiness, not a roadmap.

## 1. Current package name

- Current primary package: `@weipertda/sigiljs`
- No `@sigil/ai`, `@sigil/testing`, or any scoped package exists
- The AI work lives inside core as docs, examples, and a small internal bridge helper

## 2. AI examples

Current AI examples are provider-neutral and offline-first:

- `examples/ai/ai-schema.js`
- `examples/ai/llm-structured-output.js`
- `examples/ai/lead-intent.js`
- `examples/ai/tool-call-create-ticket.js`
- `examples/ai/tool-call-schedule-followup.js`

These examples:

- import from `@weipertda/sigiljs`
- use deterministic fixture data
- do not call external services
- do not use OpenAI, Anthropic, Gemini, or provider SDKs
- show valid/invalid flows with path-aware diagnostics

## 3. AI public APIs

There is no `aiContract()` helper exported from `src/index.js`.
The recommended AI path uses stable public contract methods directly:

- `contract.toJSONSchema()`
- `contract.safeParse(output)`
- `contract.parse(output)`

Why this matters:
It keeps the public surface minimal.
AI workflows ride on proven APIs instead of requiring a separate package boundary.

## 4. AI experimental APIs

An internal helper exists:

- `src/ai.js` defines `aiSchema(contract, options = {})`

Status:
- Not exported from the public surface in `src/index.js`.
- Not documented as an experimental export in `docs/api.md`.
- Documented in `docs/projections/ai-structured-output.md` as an experimental convenience wrapper.
- Treated as example/docs-level only for this block.

No `aiContract()` helper is present.

Why this matters:
Keeping `aiSchema()` internal avoids locking in a wrapper shape before real usage surfaces the right abstraction.
It also limits extraction surface during early adoption.

## 5. JSON Schema dependency

AI boundary behavior depends on JSON Schema projection:

- `contract.toJSONSchema()` projects contracts to JSON Schema-like structures
- Providers may or may not consume every JSON Schema feature

Current state:
- stable public API
- tested
- deterministic
- provider-neutral outside any transport layer

Risk:
JSON Schema is not a universal structured-output interface.
Provider differences in strict mode, tool envelopes, and enum handling still require adapter code outside core.

## 6. Provider-specific behavior

There is no provider-specific behavior in current AI-related code.

Current guardrails:
- No SDK imports
- No network calls in examples or tests
- No provider enum helper
- No retry or repair policy

Core responsibility today:
define the schema candidate, validate output, report failure path.
Transport, retry, provider envelope, and prompt engineering remain outside core.

## 7. Repair-loop status

Repair-loop behavior is documented as a pattern, not implemented:

- `docs/ai/repair-loop.md` explains:
  - inspect `SigilValidationError`
  - use `path`, `expected`, `actual`
  - send an application-generated repair prompt
  - revalidate repaired output

Gate still closed:
- automatic integration with any model runtime
- automatic prompt construction
- automatic rewriting of output
- any network call from core

## 8. Testing status

Task 8 added `tests/ai-boundary.test.js` covering:

- valid LLM structured output via `safeParse()`
- invalid enum enforcement
- missing required field enforcement
- valid tool-call arguments
- invalid tool-call arguments
- JSON Schema projection bridge for AI-oriented contracts

These tests prove the current public APIs support provider-neutral AI boundaries.

## 9. Extraction blockers

- Limited surface: AI usage currently composes existing public APIs instead of requiring a new module
- No proven abstraction: `aiSchema()` has not been exported, so there is no stable AI-specific entrypoint to split
- No provider contract: provider behavior and schema compatibility remain unresolved
- No usage evidence yet: premature extraction would predict the wrong boundary
- Package policy: stay single package until stable demand and stable API shape justify a split

## 10. Recommendation

**Stay single package.**
**Do not extract `@sigil/ai` yet.**

Rationale:

- The best current AI path is direct usage of stable public APIs: `toJSONSchema()`, `safeParse()`, `parse()`
- This proves SigilJS works as an AI boundary contract system without needing a new package
- `aiSchema()` should remain internal or experimental until provider usage reveals the right abstraction
- A standalone package should be justified by one or more of:
  - enough AI-specific API surface that it cannot fit cleanly in core docs
  - provider adapters that need independent release cadence, which is explicitly out of scope now
  - strong user demand for installing AI boundary contracts separately

**What would justify future extraction:**

- stabilized experimental AI API surface with multiple exported helpers
- provider adapters that are clearly separable without weakening the core message
- a stable JSON Schema schema-subset profile negotiated from real provider usage
- broader adoption showing the helper abstraction is stable across multiple projects

For now, keep AI boundary behavior inside `@weipertda/sigiljs`, continue documenting provider-neutral usage patterns, and revisit only when core APIs show enough AI-specific surface to sustain extraction without splitting the story.
