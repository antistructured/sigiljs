# Public Positioning Pack

**Package:** `@weipertda/sigiljs` v0.10.0

---

## One-line description

```
Executable data contracts for JavaScript runtime boundaries.
```

## Short paragraph

SigilJS lets you define structure once, then enforce, transform, project, and prove it across APIs, forms, databases, AI outputs, and CLI workflows. One contract object, five pillars, zero runtime dependencies.

## Long paragraph

SigilJS is an executable data contract system for JavaScript. You define a contract once using a plain JavaScript object or template syntax, and get back a contract object you can use to enforce runtime data at any boundary — API responses, form submissions, database rows, AI outputs, or CLI inputs. The same contract projects into JSON Schema, TypeScript types, and OpenAPI schemas, generates deterministic test fixtures with `mock()`, and produces structured test cases with `cases()`. Contracts can be compared across versions with `diff()` to catch breaking changes before shipping. SigilJS has zero runtime dependencies and works in any JavaScript runtime that supports ESM.

## Taglines

- Define structure once. Enforce, transform, project, and prove it everywhere.
- Executable data contracts for JavaScript.
- One contract. Every boundary.
- Runtime data trust at the boundary.

## Short tagline

```
Define structure once. Project it everywhere.
```

## GitHub repo description

```
Executable data contracts for JavaScript runtime boundaries. Zero dependencies.
```

## npm description

```
Executable data contracts for JavaScript runtime boundaries.
```

## Boundary-focused bullets

- Turn unknown API responses into trusted runtime data
- Validate form submissions before business logic sees them
- Enforce database read/write shapes at persistence boundaries
- Project LLM structured output into verified contract data
- Generate JSON Schema, TypeScript, and OpenAPI from one contract
- Run terminal contract workflows with the experimental CLI

## Comparison-safe positioning

SigilJS is not trying to replace TypeScript. TypeScript is compile-time. SigilJS focuses on runtime data boundaries — the places where your code receives data from the outside world at runtime and needs to trust it before using it.

SigilJS is not a Zod replacement. Zod is a mature TypeScript-first validation library with a rich ecosystem. SigilJS is a smaller, plain-JavaScript-first contract system for teams that want projection and CLI workflows alongside runtime validation, with zero runtime dependencies.

SigilJS is not an ORM, a web framework, or a schema registry. It validates data shapes at runtime boundaries. It does not connect to databases, run queries, or manage infrastructure.

## What to avoid saying

Do not say:
- "Zod killer" or "better than Zod"
- "Type-safe replacement for TypeScript"
- "Production-ready framework"
- "All-in-one validation platform"
- "Magic"

## When to recommend SigilJS

SigilJS is a good fit when you:
- need runtime validation at multiple boundary types (API, form, database, AI)
- want one contract that projects into multiple output formats
- want deterministic contract-level test fixtures
- want a zero-dependency ESM library
- want terminal-based contract workflows
- work in JavaScript (not TypeScript-first) environments

SigilJS is not a good fit when you:
- need deep TypeScript inference from schema definitions
- need a mature ecosystem of plugins and integrations
- are already happy with Zod and don't need CLI or projection workflows
