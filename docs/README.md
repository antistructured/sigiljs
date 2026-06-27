# SigilJS Docs

Executable data contracts for JavaScript runtime boundaries.

---

## Getting started

- [Introduction](introduction.md) — what SigilJS is and why it exists
- [Quickstart](quickstart.md) — install and first contract
- [Sigils](sigils.md) — contract objects in depth
- [Exact Mode](exact-mode.md) — strict field validation
- [Public API Reference](api.md) — full stable + experimental API
- [TypeScript Usage](typescript.md) — explicit generics and conservative declarations
- [Stability Map](stability.md) — what's stable, what's experimental
- [Known Limitations](known-limitations.md) — honest constraints

SigilJS is written in JavaScript and ships TypeScript declarations for public API consumption. The declarations are conservative and describe the public runtime API without requiring TypeScript source or a build step.

---

## Core API

- [Public API Reference](api.md)
- [Objects](objects.md)
- [Optional fields](optional.md)
- [Arrays](arrays.md)
- [Named Sigils](named-sigils.md)
- [realType](realtype.md)
- [Exact Mode](exact-mode.md)
- [Compiled Validators](compiled-validators.md)
- [TypeScript Usage](typescript.md)
- [Contract Diff Usage](diff.md)

---

## Projections

- [Projections overview](projections.md)
- [JSON Schema](projections/json-schema.md)
- [OpenAPI](projections/openapi.md)
- [TypeScript Usage](typescript.md)
- [Forms Projection](projections/forms.md)
- [Testing Helpers](projections/testing.md)
- [Contract Lifecycle](projections/lifecycle.md)

---

## Testing / Prove

- [Contract-Driven Testing](testing.md)
- [Testing Helpers](projections/testing.md)
- [Contract Diff Usage](diff.md)

---

## Boundaries

- [API boundaries](boundaries/api.md)
- [Database boundaries](boundaries/database.md)
- [Form boundaries](boundaries/forms.md)
- [AI boundaries](boundaries/ai.md)
- [Config boundaries](boundaries/config.md)
- [Webhook boundaries](boundaries/webhooks.md)
- [Queue boundaries](boundaries/queues.md)
- [Event boundaries](boundaries/events.md)
- [Local storage boundaries](boundaries/local-storage.md)
- [Plugin boundaries](boundaries/plugins.md)
- [Boundary recipes](recipes/index.md)

---

## HTTP

- [HTTP Boundary Helpers](projections/http.md) — experimental

---

## Forms

- [Form Contracts](forms/form-contracts.md)
- [Form Constraints Projection](forms/form-constraints.md)
- [Form Validation](forms/form-validation.md)
- [Form Testing](forms/form-testing.md)
- [Forms Projection](projections/forms.md)

---

## Database

- [Record Contracts](database/record-contracts.md)
- [Insert Contracts](database/insert-contracts.md)
- [Update Contracts](database/update-contracts.md)
- [Persistence Diffs](database/persistence-diffs.md)
- [Database Testing](database/database-testing.md)

---

## AI

- [AI Structured Output Contracts](projections/ai-structured-output.md)
- [AI Tool Calls](ai/tool-calls.md)
- [AI Repair Loop](ai/repair-loop.md)
- [AI Boundaries](boundaries/ai.md)

---

## CLI

- [CLI Reference](cli.md)
- [CLI Overview](cli/overview.md)
- [Contract Files](cli/contract-files.md)
- [Projections](cli/projections.md)
- [Validation](cli/validation.md)
- [Prove](cli/prove.md)
- [Diff](cli/diff.md)

---

## Experimental APIs

- [Experimental APIs](experimental.md)
- [HTTP helpers](projections/http.md)
- [Form constraints](projections/forms.md)
- [CLI workflows](cli/overview.md)

---

## Package policy

- [SigilJS vs Zod](sigil-vs-zod.md)
- [Package Split Policy](package-split.md)
- [v1 Readiness](v1-readiness.md)
