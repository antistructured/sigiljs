# SigilJS — AG-Agent Build Contract

## Project North Star

SigilJS is an executable data contract system for JavaScript.

Its final role is to become the contract layer between JavaScript runtime data and every system boundary.

System boundaries include:

- API requests
- API responses
- database reads
- database writes
- forms
- events
- queues
- webhooks
- local storage
- AI tool calls
- LLM structured outputs
- config files
- plugin systems

SigilJS is not merely a validator.

A validator checks data.

A Sigil contract defines, enforces, transforms, and projects structure.

## Positioning Language

Use this language consistently:

- Primary category: **Executable data contracts**
- Positioning: **SigilJS is an executable data contract system for JavaScript.**
- Core phrase: **Define structure once. Project it everywhere.**
- Punchline: **A sigil is not a schema. It is a contract object.**
- Boundary phrase: **SigilJS is the contract layer between JavaScript runtime data and every system boundary.**

## The Four Pillars

SigilJS has four architectural pillars.

### 1. Define

Declare structure in plain JavaScript.

```js
const User = sigil({
  id: Number,
  name: String,
})
```

### 2. Enforce

Validate and parse runtime data.

```js
User.parse(input)
User.safeParse(input)
User.assert(input)
```

### 3. Transform

Normalize data into a trusted shape.

```js
User.transform(input)
User.serialize(user)
```

### 4. Project

Generate other structural representations.

```js
User.toJSONSchema()
User.toTypeScript()
User.toOpenAPI()
```

Projection is the category expansion.

Without projection, SigilJS is a validator.

With projection, SigilJS becomes a contract system.

---

# Intended Final Package Architecture

The intended final ecosystem is:

```txt
@sigil/core
  runtime contract engine

@sigil/ts
  TypeScript definition projection

@sigil/json-schema
  JSON Schema projection

@sigil/openapi
  OpenAPI projection

@sigil/forms
  form constraint projection

@sigil/ai
  structured output enforcement for LLM apps

@sigil/http
  request/response contract middleware

@sigil/testing
  fixtures, contract tests, fuzz cases
```

Do not create this monorepo immediately.

First prove the core contract object inside the existing package. Split packages only after the public API stabilizes.

---

# Global AG-Agent Rules

These rules apply to every phase.

## Do Not Rebuild

SigilJS already exists.

Do not regenerate the project.

Do not rewrite the parser/compiler/runtime from scratch.

Make incremental, scoped changes.

## Runtime Constraints

- Bun-first
- ESM
- pure JavaScript
- zero runtime dependencies
- no TypeScript source requirement
- no build step required for core usage
- StandardJS-compatible style if linting is active

## Architecture Constraints

- Functional Core / Imperative Shell
- Data-Oriented Programming
- stable object shapes
- flat data structures
- compiled validators
- memoized compilation
- small public API
- projection-oriented contract objects

## Agent Work Rule

For every task:

1. inspect existing files first
2. identify the smallest integration point
3. preserve existing public API
4. add tests before or with implementation
5. update docs/examples only when behavior changes
6. summarize changed files

## Existing Project Constraints

- Current package: `sigil`
- Test runner: Bun
- Runtime target: JavaScript / ESM
- Existing parser/compiler pipeline must be extended, not replaced:

```txt
Sigil string
→ tokenizer
→ parser
→ AST
→ normalize
→ partial evaluation
→ validator compiler
→ runtime validator
```

Preferred integration points:

- `src/sigil.js`
- `src/index.js`
- `src/core/compile.js`
- `src/core/assert.js`
- `src/core/registry.js`
- `src/core/normalize.js`
- `src/core/partial.js`

Do not restructure the repository or rename existing modules unless explicitly requested.

---

# Current Core Features to Preserve

These features already exist and must remain working while the project evolves:

- `Sigil`
- `S`
- optional legacy alias `T`
- `realType`
- current string sigil syntax
- compiled validators
- `.check(value)`
- `.assert(value)`
- `.validator`
- `.compile()`
- exact object mode via `Sigil.exact`
- reusable named sigils via `Sigil.define` / `Sigil.named`
- collection-local sigils via `Sigil.collection`
- path-aware validation errors via `SigilValidationError`
- Bun-native CLI playground

Expected public imports include:

```js
import { Sigil, S, realType } from 'sigil'
```

Optional existing alias:

```js
import { T } from 'sigil'
```

---

# Phase 1 — Contract Core Stabilization

## Goal

Stabilize the current contract runtime so future pillars can build safely on top.

## Pillars Covered

- Define
- Enforce

## Step 1.1 — Core API Audit

### Task

Inspect the current public API and document what exists.

Expected current exports:

```js
import { Sigil, S, realType } from 'sigil'
```

Optional existing alias:

```js
import { T } from 'sigil'
```

### Acceptance

Create or update internal notes/docs showing:

- exported functions
- Sigil object methods
- exact mode behavior
- named sigil behavior

## Step 1.2 — Stabilization Tests

### Task

Add focused tests for:

- compiled validator reuse
- exact object mode
- reusable named sigils
- named sigils inside objects
- named sigils inside arrays
- missing named sigil reference
- circular reference protection if implemented

### Acceptance

Tests must prove existing features are reliable before adding new behavior.

## Step 1.3 — Contract Object Shape

### Task

Normalize the Sigil contract object so every contract has a stable shape.

Recommended internal object shape:

```js
{
  kind: 'sigil.contract',
  name,
  source,
  ast,
  normalized,
  validator,
  options,
  check,
  assert,
  parse,
  safeParse,
  describe,
}
```

Do not expose internals unless already exposed.

### Acceptance

Every Sigil contract instance should have consistent methods and internal fields.

---

# Phase 2 — Define Pillar

## Goal

Make structure declaration clear, stable, and plain-JavaScript friendly.

## Pillar Covered

- Define

## Step 2.1 — Preserve Existing Sigil Template API

### Task

Keep existing syntax working:

```js
const User = Sigil`
{
  id: string
  name: string
}
`
```

### Acceptance

No breaking changes.

## Step 2.2 — Introduce Object Definition API

### Task

Add or prototype plain JavaScript declaration syntax:

```js
const User = sigil({
  id: Number,
  name: String,
})
```

Potential export:

```js
import { sigil } from 'sigil'
```

### Design Rule

This should produce the same kind of contract object as `Sigil`.

Template syntax and object syntax are two front doors into the same contract engine.

### Acceptance

This works:

```js
const User = sigil({
  id: Number,
  name: String,
})

User.check({ id: 1, name: 'D' })
```

## Step 2.3 — Define Primitive Mapping

### Task

Map native constructors to contract primitives.

```txt
String  → string
Number  → number
Boolean → boolean
BigInt  → bigint
Symbol  → symbol
Array   → array
Object  → object
```

### Acceptance

Native constructor definitions compile into the existing internal contract AST or normalized contract model.

## Step 2.4 — Define Optional Helper

### Task

Add an optional helper for object definition syntax.

Possible API:

```js
const User = sigil({
  id: Number,
  name: String,
  age: optional(Number),
})
```

Export:

```js
import { sigil, optional } from 'sigil'
```

### Acceptance

Optional fields work in object syntax and compile into the same semantics as template syntax.

## Step 2.5 — Define Union Helper

### Task

Add a union helper for object syntax.

```js
const User = sigil({
  id: union(String, Number),
})
```

### Acceptance

Object syntax union behavior matches template syntax:

```js
Sigil`string | number`
```

## Step 2.6 — Define Literal Helper

### Task

Add literal helper support.

Preferred public term:

```js
const Role = sigil({
  role: oneOf('admin', 'user'),
})
```

### Acceptance

Literal enum-like contracts work for strings, numbers, booleans, and null.

---

# Phase 3 — Enforce Pillar

## Goal

Make runtime contract enforcement strong, predictable, and developer-grade.

## Pillar Covered

- Enforce

## Step 3.1 — Add `parse()`

### Task

Add:

```js
User.parse(input)
```

Behavior:

- valid → returns trusted input/value
- invalid → throws `SigilValidationError`

This can initially alias `assert()`.

### Acceptance

```js
const user = User.parse(input)
```

returns input when valid.

## Step 3.2 — Add `safeParse()`

### Task

Add:

```js
User.safeParse(input)
```

Behavior:

```js
{
  success: true,
  data,
}
```

or:

```js
{
  success: false,
  error,
}
```

### Acceptance

No thrown exception from `safeParse()`.

## Step 3.3 — Improve `assert()`

### Task

Ensure:

```js
User.assert(input)
```

returns input when valid and throws when invalid.

### Acceptance

`assert()` and `parse()` are consistent.

## Step 3.4 — Path-Aware Errors

### Task

Add or harden `SigilValidationError`.

Target shape:

```js
{
  name: 'SigilValidationError',
  code: 'SIGIL_VALIDATION_FAILED',
  message: 'Expected number at user.age',
  path: ['user', 'age'],
  expected: 'number',
  actual: 'string',
}
```

### Critical Rule

Keep `check()` fast.

Do not add diagnostic overhead to the hot boolean path.

Use either:

- diagnostic validation mode for parse/assert
- separate diagnostic compiler
- lightweight context object only when needed

### Acceptance

Nested object and array failures report exact paths.

## Step 3.5 — Exact Mode Enforcement

### Task

Verify and harden:

```js
Sigil.exact`
{
  name: string
}
`
```

and object syntax equivalent:

```js
sigil.exact({
  name: String,
})
```

### Acceptance

Extra keys fail in exact mode.

Normal mode still allows extra keys.

## Step 3.6 — Boundary Enforcement Examples

### Task

Add examples for enforcement at boundaries:

```txt
examples/api-request.js
examples/api-response.js
examples/config-file.js
examples/webhook.js
examples/queue-message.js
examples/llm-structured-output.js
```

### Acceptance

Each example should be runnable with Bun and should show `parse`, `safeParse`, or `assert`.

---

# Phase 4 — Transform Pillar

## Goal

Allow contracts to normalize data into trusted shapes.

## Pillar Covered

- Transform

## Step 4.1 — Add `transform()`

### Task

Add contract-level transform pipeline.

Example:

```js
const User = sigil({
  id: Number,
  name: String,
}).transform((user) => ({
  ...user,
  name: user.name.trim(),
}))
```

Alternative if method chaining is not ready:

```js
const User = sigil(
  {
    id: Number,
    name: String,
  },
  {
    transform(user) {
      return {
        ...user,
        name: user.name.trim(),
      }
    },
  },
)
```

### Acceptance

`User.parse(input)` validates first, then returns transformed value.

## Step 4.2 — Add Field-Level Transform

### Task

Support transforms at field level.

Possible API:

```js
const User = sigil({
  name: pipe(String, trim()),
})
```

Do not overbuild pipeline yet.

Start minimal.

### Acceptance

Simple field normalization works.

## Step 4.3 — Add `serialize()`

### Task

Add:

```js
User.serialize(user)
```

Purpose:

Convert trusted internal value into boundary-safe output.

Example use cases:

- API responses
- database writes
- local storage
- logs

### Acceptance

Initial implementation may validate and return a normalized output.

## Step 4.4 — Unknown Key Behavior in Transform

### Task

For exact contracts, `transform()` should remove or reject unknown keys based on mode.

Recommended:

- loose mode: preserves unknown keys unless configured
- exact mode: rejects unknown keys
- future strip mode: removes unknown keys

Do not implement strip mode unless explicitly requested.

### Acceptance

Exact mode behavior remains consistent.

## Step 4.5 — Transform Safety

### Task

If transform output violates the contract, decide whether to revalidate.

Recommended default:

```txt
validate input → transform → validate output
```

Provide later optimization if needed.

### Acceptance

Invalid transform output should not silently produce untrusted data.

---

# Phase 5 — Project Pillar: Public Contract Description

## Goal

Introduce projection by first creating a stable public contract description.

## Pillar Covered

- Project

## Step 5.1 — Add `describe()`

### Task

Add:

```js
User.describe()
```

This returns a stable public contract description.

Do not return raw internal AST if AST is unstable.

Recommended shape:

```js
{
  kind: 'object',
  exact: false,
  properties: [
    {
      key: 'id',
      required: true,
      contract: { kind: 'number' },
    },
  ],
}
```

### Acceptance

`describe()` works for:

- primitives
- arrays
- objects
- optionals
- unions
- literals
- named sigils
- exact mode

## Step 5.2 — Canonical Contract Model

### Task

Create one normalized contract model that all projections use.

This is the structural source of truth.

### Acceptance

`toJSONSchema`, `toTypeScript`, `toOpenAPI`, `toMarkdown`, and future projections should consume `describe()` or the same stable model.

---

# Phase 6 — Project Pillar: JSON Schema

## Goal

Make the first serious projection.

## Future Package

Eventually:

```txt
@sigil/json-schema
```

For now, implement inside core or an internal module until the API stabilizes.

## Step 6.1 — Add `toJSONSchema()`

### Task

Add:

```js
User.toJSONSchema()
```

Support:

- string
- number
- boolean
- null
- arrays
- objects
- required fields
- optional fields
- exact mode via `additionalProperties: false`
- literal unions as `enum`
- primitive unions as `anyOf` or type arrays when safe

### Acceptance

This works:

```js
const User = sigil.exact({
  id: Number,
  name: String,
  role: oneOf('admin', 'user'),
})

User.toJSONSchema()
```

returns a valid JSON Schema-like object.

## Step 6.2 — Tests

### Task

Add tests for JSON Schema output.

### Acceptance

Snapshot tests are acceptable for projection outputs.

## Step 6.3 — Docs

### Task

Add:

```txt
docs/projections/json-schema.md
```

Explain:

> Projection turns a Sigil contract into another structural representation.

---

# Phase 7 — Project Pillar: TypeScript Projection

## Goal

Generate TypeScript definitions from Sigil contracts.

## Future Package

Eventually:

```txt
@sigil/ts
```

## Step 7.1 — Add `toTypeScript()`

### Task

Add:

```js
User.toTypeScript('User')
```

Output:

```ts
type User = {
  id: number
  name: string
}
```

### Design Rule

No TypeScript dependency.

This is string generation only.

### Acceptance

Supports:

- primitives
- arrays
- objects
- optional fields
- literal unions
- named sigil references

## Step 7.2 — Feedback Alignment

### Task

Document that TypeScript projection is not the same as IDE inference yet.

Position it as:

```txt
Define runtime contract first.
Project TypeScript definitions from it.
```

### Acceptance

Docs should be honest and clear.

---

# Phase 8 — Project Pillar: OpenAPI Projection

## Goal

Project contracts into OpenAPI-compatible schemas.

## Future Package

Eventually:

```txt
@sigil/openapi
```

## Step 8.1 — Build on JSON Schema

### Task

Implement:

```js
User.toOpenAPI()
```

using the JSON Schema projection as the base.

### Acceptance

OpenAPI projection should support request/response documentation examples.

## Step 8.2 — HTTP Contract Examples

### Task

Add examples:

```txt
examples/http-request-contract.js
examples/http-response-contract.js
```

### Acceptance

Examples show how one Sigil defines runtime enforcement and OpenAPI projection.

---

# Phase 9 — Forms Projection

## Goal

Project contracts into form constraints.

## Future Package

Eventually:

```txt
@sigil/forms
```

## Step 9.1 — Add Form Constraint Projection

### Task

Add experimental:

```js
User.toFormConstraints()
```

or keep as future adapter.

Output example:

```js
{
  name: {
    required: true,
    type: 'text',
  },
  age: {
    required: false,
    type: 'number',
  },
}
```

### Acceptance

Basic form metadata can be generated from contracts.

---

# Phase 10 — AI Structured Output Contracts

## Goal

Make SigilJS useful for LLM apps.

## Future Package

Eventually:

```txt
@sigil/ai
```

## Step 10.1 — Add AI Examples First

### Task

Before package work, add examples:

```txt
examples/llm-structured-output.js
examples/ai-tool-call.js
```

Example:

```js
const LeadIntent = sigil.exact({
  name: String,
  email: String,
  budget: optional(Number),
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
})

const lead = LeadIntent.parse(llmOutput)
```

### Acceptance

Examples show:

```txt
uncertain AI output → Sigil contract → trusted runtime object
```

## Step 10.2 — Add JSON Schema for AI APIs

### Task

Use `toJSONSchema()` to generate schemas compatible with structured output APIs.

### Acceptance

Docs show the bridge:

```txt
Sigil contract → JSON Schema → LLM structured output schema
```

## Step 10.3 — Future `repair()` Experiment

### Task

Do not implement immediately.

Design only:

```js
LeadIntent.repair(output, repairFn)
```

Possible flow:

```txt
parse fails
collect path-aware error
send repair prompt
reparse
```

### Acceptance

Keep as design note until core projection is mature.

---

# Phase 11 — HTTP Boundary Middleware

## Goal

Make request/response enforcement easy.

## Future Package

Eventually:

```txt
@sigil/http
```

## Step 11.1 — Framework-Agnostic HTTP Helpers

### Task

Design framework-neutral helpers first.

Example:

```js
const Login = httpContract({
  request: LoginRequest,
  response: LoginResponse,
})
```

### Acceptance

No Express/Fastify dependency in core.

## Step 11.2 — Middleware Adapters Later

### Task

Future adapters may include:

```txt
@sigil/http/express
@sigil/http/fastify
@sigil/http/hono
```

Do not add dependencies to core.

---

# Phase 12 — Testing Package

## Goal

Generate fixtures, contract tests, and fuzz cases.

## Future Package

Eventually:

```txt
@sigil/testing
```

## Step 12.1 — Add `mock()`

### Task

Add:

```js
User.mock()
```

Generate simple valid sample data.

### Acceptance

Works for:

- primitives
- arrays
- objects
- optionals
- literals
- named sigils

## Step 12.2 — Add `cases()`

### Task

Add:

```js
User.cases()
```

Return:

```js
{
  valid: [],
  invalid: [],
}
```

### Acceptance

Contract can generate basic valid and invalid test cases.

## Step 12.3 — Fuzz Cases Later

### Task

Design future fuzzing but do not overbuild early.

---

# Phase 13 — Contract Lifecycle

## Goal

Support changes over time.

## Step 13.1 — Add Contract Diff

### Task

Add:

```js
UserV2.diff(UserV1)
```

Detect:

- added fields
- removed fields
- changed field types
- optional-to-required changes
- required-to-optional changes

### Acceptance

Initial diff supports object contracts only.

## Step 13.2 — Migration Safety Docs

### Task

Document:

```txt
Use contract diffs to catch API and data model drift.
```

---

# Phase 14 — CLI

## Goal

Make contract workflows accessible outside code.

## Step 14.1 — CLI Foundation

### Task

Create or improve CLI:

```bash
sigil check schema.sigil data.json
sigil describe schema.sigil
sigil json-schema schema.sigil
sigil types schema.sigil
sigil mock schema.sigil
```

### Acceptance

CLI remains Bun-native and dependency-free where possible.

## Step 14.2 — CLI Package Later

Eventually:

```txt
@sigil/cli
```

Do not split until core is stable.

---

# Phase 15 — Package Split

## Goal

Move from single package to ecosystem packages only after API maturity.

## Step 15.1 — Keep Single Package Until Stable

### Task

Do not prematurely split packages.

Recommended split point:

```txt
after describe(), JSON Schema, TypeScript projection, and OpenAPI projection stabilize
```

## Step 15.2 — Future Package Split

Final package shape:

```txt
@sigil/core
@sigil/ts
@sigil/json-schema
@sigil/openapi
@sigil/forms
@sigil/ai
@sigil/http
@sigil/testing
```

### Acceptance

Each package has a clear reason to exist.

No package should exist just for aesthetics.

---

# Phase 16 — v1 Readiness

## Goal

Lock the core category and stabilize the public system.

## v1 Requirements

SigilJS v1 requires:

```txt
stable Define API
stable Enforce API
stable Transform API
stable Project API
stable error model
stable contract object model
stable projection model
docs for boundary use cases
tests for all pillars
credible benchmark story
clear package roadmap
```

## v1 Positioning

Use:

```txt
SigilJS is an executable data contract system for JavaScript.

Define structure once. Project it everywhere.
```

---

# Final March Order

Build in this exact order:

```txt
1. Stabilize current core
2. Add object definition API
3. Add parse/safeParse/assert consistency
4. Add path-aware errors
5. Add transform/serialize
6. Add describe()
7. Add toJSONSchema()
8. Add toTypeScript()
9. Add toOpenAPI()
10. Add AI structured output examples
11. Add mock/cases testing utilities
12. Add Sigil.collection()
13. Add contract diffing
14. Add CLI projection commands
15. Split into @sigil packages only after stabilization
16. Prepare v1
```

Do not skip `describe()`.

`describe()` is the bridge between core contracts and every projection package.

Without it, every projection becomes coupled to parser internals.

Note: if an item in the march order already exists in the current package, treat its phase as a hardening/stabilization pass rather than permission to rebuild it.

---

# Final AG Instruction

Implement SigilJS as a staged executable data contract system with four pillars: Define, Enforce, Transform, and Project.

Always extend the existing project incrementally.

Do not rebuild.

Do not split into packages until core APIs stabilize.

Every feature must strengthen one of the four pillars or support boundary enforcement.

The end goal is not a validator library.

The end goal is executable data contracts for JavaScript.
