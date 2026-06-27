# Stable Core Surface

**Block:** Stable Core Hardening  
**Package:** `@weipertda/sigiljs` v0.14.0  
**Pass:** 1 — Stable Core Surface Reconfirmation

---

## Purpose

This document reconfirms the future stable-core surface before hardening behavior, tests, declarations, and docs.

This block is scoped to existing stable-core semantics. It does not add features, split packages, stabilize experimental surfaces, or add runtime dependencies.

---

## Stable Public Exports

These exports are future stable-core candidates:

| Export | Role | Hardening status |
|--------|------|------------------|
| `sigil` | primary object-definition constructor | stable candidate |
| `sigil.exact` | primary exact-object constructor | stable candidate |
| `optional` | optional field helper | stable candidate |
| `union` | union helper | stable candidate |
| `oneOf` | literal union helper | stable candidate |
| `pipe` | field transform helper | stable candidate |
| `trim` | string trim transform helper | stable candidate |
| `realType` | runtime type detector | stable candidate |
| `SigilValidationError` | structured validation error | harden shape in this block |

---

## Stable Contract Methods

These contract methods are stable-core candidates:

| Method | Pillar | Hardening focus |
|--------|--------|-----------------|
| `check(value)` | Enforce | current boolean result semantics |
| `assert(value)` | Enforce | thrown validation error shape |
| `parse(value)` | Enforce / Transform | thrown validation error shape; transform behavior |
| `safeParse(value)` | Enforce / Transform | result union shape; no throw on validation failure |
| `describe()` | Project | deterministic description output |
| `toJSONSchema()` | Project | deterministic SigilJS JSON Schema subset |
| `toTypeScript(name?)` | Project | deterministic string projection |
| `toOpenAPI()` | Project | deterministic schema-level output |
| `transform(fn)` | Transform | parse-time transform semantics |
| `serialize(value)` | Transform / Boundary | validation-only, no-transform semantics |
| `mock(options?)` | Prove | deterministic structural sample semantics |
| `cases(options?)` | Prove | `{ valid, invalid }` output shape |
| `test(cases?)` | Prove | summary report shape |
| `diff(other)` | Lifecycle / Prove | A-perspective diff direction remains documented |
| `withMetadata(meta)` | Metadata | metadata propagation in stable projections |
| `version(v)` | Metadata | metadata shorthand |
| `compile()` | Advanced stable candidate | validator function shape remains advanced/low-level |

---

## Experimental Exports / Methods

These are explicitly out of stable-core hardening and remain experimental:

| Surface | Exposure | Status |
|---------|----------|--------|
| `httpContract()` | root export | experimental |
| `toFormConstraints()` | contract method | experimental |
| `sigil` CLI bin | package bin | experimental |
| `.sigil` files | CLI input format | experimental |
| `.sigil.js` files | CLI input format | experimental |

This block may verify they remain labeled experimental, but will not stabilize or expand them.

---

## Legacy Aliases

These aliases are exported and typed, but are not primary stable-core documentation targets:

| Alias | Target | Policy work |
|-------|--------|-------------|
| `Sigil` | template-literal constructor | choose primary/advanced/legacy policy |
| `S` | `Sigil` | legacy alias policy |
| `T` | `Sigil` | legacy alias policy |
| `real` | `realType` | legacy alias policy |
| `Real` | `realType` | legacy alias policy |

---

## Deferred Surfaces

Deferred until after stable-core hardening and real-world usage:

- `@sigil/*` package extraction
- framework HTTP middleware
- UI form adapters
- ORM/database helpers
- provider-specific AI helpers
- deep TypeScript inference
- semantic mock data generation

---

## Out of Scope For This Block

- New contract helpers
- New projection targets
- New CLI commands
- HTTP/form/CLI feature expansion
- database helpers
- AI helpers
- package splitting
- TypeScript source conversion
- runtime dependencies

---

## Hardening Focus

This block locks down:

1. `SigilValidationError` shape
2. `safeParse()` result shape
3. `sigil` vs `Sigil` policy
4. legacy alias policy
5. `transform()` / `serialize()` semantics
6. core projection output contracts
7. Prove output contracts
8. type declaration alignment
9. public docs alignment

