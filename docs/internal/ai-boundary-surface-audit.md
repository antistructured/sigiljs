# AI Boundary Surface Audit

Audit date: 2026-06-21  
Package: `@weipertda/sigiljs`  
Block: Five-Pillar Model + AI Boundary Contracts — Task 2

## 1. Current AI Examples

| File | Status | Description |
|------|--------|-------------|
| `examples/boundaries.js` | Example | Contains `AiToolCall` and `LlmIntent` contract demos with JSON Schema projection and runtime enforcement. |
| `examples/published/ai-output.js` | Published example | Minimal copy-paste-safe example showing `safeParse()` on LLM output. |
| `examples/testing/ai-output-cases.js` | Testing example | Uses `mock()` and `test()` on a `LeadIntent` contract to demonstrate contract-driven AI output testing. |

## 2. Current AI Helpers

| Helper | Source | Status |
|--------|--------|--------|
| `contract.toJSONSchema()` | `src/projections/json-schema.js` | Stable — used as the bridge to AI structured-output APIs |
| `contract.describe()` | `src/core/describe.js` | Stable — feeds projection |
| `contract.parse()` / `safeParse()` / `assert()` | `src/core/*` | Stable — runtime enforcement |
| `contract.mock()` | `src/projections/mock.js` | Stable — valid sample generation for test fixtures |
| `contract.cases()` | `src/projections/cases.js` | Stable — valid/invalid case generation |
| `contract.test()` | `src/testing/test-runner.js` | Stable — contract behavior report |

No dedicated AI helper module exists yet.

## 3. Current JSON Schema Behavior Relevant to AI

`toJSONSchema()` already covers the shapes most AI structured-output APIs accept:

- primitives → `{ type: '<kind>' }`
- `null` → `{ type: 'null' }`
- `boolean` → `{ type: 'boolean' }`
- `bigint` → `{ type: 'integer' }`
- literals → `{ const: value }` or `{ enum: [...] }`
- primitive unions → `{ type: ['string', 'number', ...] }`
- mixed unions → `{ anyOf: [...] }`
- objects → `{ type: 'object', properties: { ... }, required: [...] }`
- exact objects → `additionalProperties: false`
- arrays → `{ type: 'array', items: ... }`
- named references → `$ref: '#/$defs/<Name>'`
- metadata → `title`, `description`, `x-version`, `x-tags`
- broad `Object` → `{ type: 'object' }`
- broad `Array` → `{ type: 'array' }`

This is sufficient for typical tool-call parameter schemas and LLM structured output schemas without adding a new projection target.

## 4. Exported AI APIs

None.

No `aiContract()`, `repair()`, or provider-specific helper is exported. The public API surface exposed through `src/index.js` does not include any AI-specific symbol.

## 5. Network Calls in Examples

No.

All current AI examples run offline:
- `examples/boundaries.js` — local `JSON.parse()` and contract enforcement only
- `examples/published/ai-output.js` — local object only
- `examples/testing/ai-output-cases.js` — local fixture generation only

No `fetch()`, `WebSocket`, or provider SDK appears in any example.

## 6. Missing Tests

- No dedicated test file for AI boundary behavior.
- `examples/boundaries.js` is not executed by the test runner.
- No test asserts that `AiToolCall.toJSONSchema()` produces a schema compatible with a representative tool-call payload.
- No test asserts that `LlmIntent.safeParse()` handles a representative LLM structured output.
- No test asserts that generated cases (`mock()`, `cases()`) match an AI-style contract shape.

## 7. Stable / Experimental / Internal Classification

| Surface | Classification |
|---------|---------------|
| `docs/projections/ai-structured-output.md` | Stable docs |
| `examples/boundaries.js` AI sections | Example only |
| `examples/published/ai-output.js` | Example only |
| `examples/testing/ai-output-cases.js` | Example only |
| `docs/projections/ai-structured-output.md` `repair()` section | Design note / future |
| JSON Schema projection for AI | Stable projection |
| Any new `aiContract()` helper (proposed) | Deferred intentionally to preserve stable API surface |

## 8. Recommended Scope for This Block

Keep AI work small and additive. Do not introduce provider-specific code, network calls, or new runtime dependencies.

Recommended additions for this block:

1. `aiContract()` experimental helper — wrapper around existing stable APIs (`describe()`, `toJSONSchema()`, `parse()`, `safeParse()`, `assert()`, `mock()`, `cases()`, `test()`) with an explicit experimental stability warning.
2. AI tool-call example that stays local and offline.
3. AI boundary tests that validate schema projection and runtime enforcement using local fixtures only.
4. `docs/projections/ai-boundaries.md` — practical AI boundary docs.
5. Design note for a future `repair()` loop that stays inside the experimental helper or future `@sigil/ai` scope.

Do not add:
- provider SDK imports
- network examples
- `src/ai/` package boundary yet
- `@sigil/ai` extraction yet
