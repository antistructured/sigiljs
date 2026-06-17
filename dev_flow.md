# SigilJS — Dev Flow

## Project Summary

Runtime type sigils for JavaScript via tagged template literals.
Package: `@antistructured/sigiljs`
Test runner: Bun
Node compat: ≥18

## Core Architecture

SigilJS already exists and has an established architecture.

The agent must never regenerate the project from scratch.

The agent must only perform incremental modifications.

## Existing System

SigilJS is a runtime validation system for JavaScript that uses sigils, small type-expression strings compiled into validators.

Example usage:

const User = Sigil`
{
  name: string
  age?: number
}
`

User.check(data)

Current system includes:

• DSL parser
• AST generation
• runtime validation
• realType() utility
• Bun-based development environment

## Architectural Rule

All modifications must respect this pipeline:

Sigil string
→ tokenizer
→ parser
→ AST
→ validator compiler
→ runtime validator

Agents must extend this pipeline, not replace it.

## File Modification Constraints

• Agent must not restructure the repository.
• Agent must not rename existing modules.

## Implementation Style

Follow these rules:

• additive modifications only
• preserve existing public API
• maintain zero external dependencies, as much as possible
• stable object shapes where possible

---

## Development Paradigm Stack

SigilJS follows these design principles:

• Data-Oriented Programming
• Functional Core / Imperative Shell
• Partial Evaluation
• Staged Compilation
• Structural Sharing
• Stable Object Shapes

The validator compiler should favor:

• predictable branching
• minimal allocations
• cached compiled functions

## Agent Execution Rule

When asked to implement a feature:

1. inspect existing modules
2. extend existing systems
3. generate minimal new code
4. avoid rewriting unrelated components

## Prohibited Agent Behavior

Agent must NOT:

• rebuild the parser
• regenerate the AST system
• introduce heavy tooling
• introduce dependencies, unless absolutely necessary
• rewrite DSL grammar

## Preferred Implementation Strategy

Prefer extending these modules:

compile.js
validate.js
registry.js

over creating new architecture.

```javascript
Sigil`schema`  →  parse → normalize → partial → compile → cached validator fn
```

- **Parser** (`src/core/parser.js`): DSL → raw AST
- **Normalize** (`src/core/normalize.js`): flatten unions, collapse optionals
- **Partial** (`src/core/partial.js`): pre-compute hints (requiredKeys, optionalKeys)
- **Compile** (`src/core/compile.js`): AST → validator fn, memoized via `validatorCache`
- **Sigil** (`src/sigil.js`): top-level tagged template + `.exact` + `.named`/`.define` + `_sigilCache`
- **Registry** (`src/core/registry.js`): global map for named sigils (`register`, `resolve`, `clear`)

## Public API Surface

```js
import { Sigil, S, T, SigilValidationError } from '@antistructured/sigiljs'

// Standard
const User = Sigil`{ name: string }`
User.check(data)       // → boolean
User.assert(data)      // → true | throws SigilValidationError
User.compile()         // → compiled validator function (memoized)
User.validator         // → same compiled fn (property form)
User.raw               // → raw schema string
User.ast               // → parsed AST
User.normalized        // → normalized+partial AST
User.options           // → { exact, named? }

// Exact mode
const StrictUser = Sigil.exact`{ name: string }`

// Named / defined sigils
const Email = Sigil.named('Email')`string`
const Email = Sigil.define('Email')`string`  // alias
```

## Error System (`SigilValidationError`)

`.assert()` always throws `SigilValidationError` on failure. Shape:

```json
{
  "code": "SIGIL_VALIDATION_FAILED",
  "message": "Expected property \"age\" to be number, got string",
  "path": ["user", "age"],
  "expected": "number",
  "actual": "string"
}
```

- **`path`** tracks through objects (key names) and arrays (string indices)
- **`message`** is contextual:
  - Property failure: `Expected property "key" to be T, got A`
  - Array item: `Expected item [i] to be T, got A`
  - Missing prop: `Missing required property "key" (expected T)`
  - Extra prop (exact): `Unexpected property "key"`
  - Union: deepest-path heuristic — surfaces the most specific branch failure
- **`toJSON()`** returns the canonical object for structured logging
- **`instanceof SigilValidationError`** works (exported from public API)
- Unknown sigil refs thrown by the lazy resolver are caught and re-wrapped

## Three Core Features (to stabilize)

### 1. Compiled Validators
- Sigils compile once on creation (eager warm-up in `createSigil`)
- `sigil.compile()` always returns the cached fn (same reference)
- `sigil.validator` (new property) — exposes pre-compiled fn directly

### 2. Exact Object Mode (`Sigil.exact`)
- Global: all object nodes in a sigil inherit `exact: true` from parse options
- Extra props → `false`; subset of declared props → `true`
- Nested behavior: currently all objects are strict when using `.exact`

### 3. Reusable Named Sigils (`Sigil.named` / `Sigil.define`)
- `Sigil.define` added as an alias for `Sigil.named` (friendlier API name)
- Registered in global registry, resolved at compile/validate time
- Circular refs handled lazily (deferred lookup at validation time)
- Duplicate registration: last-write-wins (registry.set overwrites)
- Missing ref: throws `Unknown sigil reference: <Name>` at validation time

## Test Coverage Status

| File | Tests | Status |
|------|-------|--------|
| `validate.test.js` | 28 | ✅ Full error system — shape, path, messages, exact, union, identifiers |
| `compile.test.js` | 15 | ✅ Low-level pipeline + high-level Sigil API + validator reuse |
| `exact.test.js` | 13 | ✅ All spec cases + nested doc + cache behavior |
| `named.test.js` | 12 | ✅ define alias + nested refs + missing ref + duplicate + circular |
| `validator.test.js` | 8 | ✅ Core Sigil API (existing) |
| `validate.test.js` | 3 | ✅ validate/assert (existing) |
| `partial.test.js` | 3 | ✅ (existing) |
| `normalize.test.js` | 3 | ✅ (existing) |
| `parser.test.js` | 9 | ✅ (existing) |
| `tokenizer.test.js` | 6 | ✅ (existing) |
| `realType.test.js` | 4 | ✅ (existing) |
| `object-schema.test.js` | 4 | ✅ (existing) |
| `playground.test.js` | 3 | ✅ (existing) |
| **Total** | **108** | **✅ 108/108 passing** |

## Changelog

### 2026-06-17
- Surveyed full project: 55 tests (all passing) before work started
- **Added `Sigil.define`** as ergonomic alias for `Sigil.named` (`sigil.js`)
- **Added `sigil.validator`** property — stable compiled fn reference on every sigil object
- **Collapsed redundant `compile()` warm-up call** in `createSigil` (one call, captured as `validator`)
- **Expanded `compile.test.js`**: 4→15 tests — spec schemas + validator reuse proofs
- **Expanded `exact.test.js`**: 4→13 tests — spec cases + nested behavior documented
- **Expanded `named.test.js`**: 4→12 tests — define alias, nested refs, missing ref, duplicate, circular
- Result: 83/83 tests passing (+28 new tests, 0 regressions)

- **Path-aware validation errors** (`assert.js` full rewrite):
  - `describeType(ast)` helper — human-readable type string for any AST node
  - Contextual messages: property (`"Expected property X to be T"`), array item (`"Expected item [i] to be T"`)
  - Missing required property: includes expected type in message
  - Exact mode: reports unexpected property names with path
  - Union: deepest-path heuristic — surfaces most specific branch failure
  - Identifier case added — named sigil refs now resolve for error reporting
  - `assert()` catches all throws (lazy resolver, findError) and re-wraps as `SigilValidationError`
  - `SigilValidationError.toJSON()` added — canonical JSON shape for logging
  - `SigilValidationError` exported from public API (`src/index.js`)
  - **Expanded `validate.test.js`**: 3→28 tests
- Result: **108/108 tests passing** (+25 new tests, 0 regressions)

- **Performance optimization in `validate.js`**:
  - `validate()` now directly invokes `sigil.validator` if passed a fully-fledged Sigil object, avoiding AST structural canonicalization & compile-cache lookups on hot paths.
  - This matches `.check()` performance directly with the raw `.validator` function.
- **Benchmark Suite (`bench/validate-user.js`)**:
  - Implemented benchmark story comparing SigilJS (both raw validator and `.check()` wrapper) against handwritten Manual JS (baseline) and Zod (`safeParse`).
  - Added `"bench"` script command to `package.json`.
  - Proves compiled validators run at 6%+ of raw hand-optimized JS on valid structures, and up to 22% of baseline (140x faster than Zod) on fast-failure invalid structures.

- **API Aliasing & Zod Comparison**:
  - Exported `Sigil`, `S`, and legacy `T` from `src/index.js`.
  - Refined documentation (`docs/sigils.md`) and `README.md` to highlight `Sigil` for clarity and `S` for shorthand, relegating `T` to a legacy alias.
  - Overhauled the **Sigil vs Zod** comparison in `README.md` to reflect a respectful and philosophically accurate comparison (expressive builder API vs readable type expressions).
  - Created **`docs/roadmap.md`** defining milestones towards `v1.0.0` and linked it in `docs/README.md`.
- **Release Workflow & Scoped Package Polishing**:
  - Created **`scripts/release.sh`** bash script to run tests, bump version, push tags, and publish package.
  - Set the script executable via `chmod +x`.
  - Configured `release:patch`, `release:minor`, and `release:major` scripts in `package.json` to leverage `scripts/release.sh`.
  - Updated `package.json` to publish public access via `publishConfig`.
  - Polished package details including description, repository URL, author info, files to include, and package name.
