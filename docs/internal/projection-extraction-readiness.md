# Projection Extraction Readiness

Status: draft

## 1. Current package name

- `@weipertda/sigiljs`

## 2. Current projection methods

- `toJSONSchema()`
- `toTypeScript(name)`
- `toOpenAPI()`
- `toFormConstraints()`

## 3. Stable projection source

Projection supports should derive from `describe()`.

- `toJSONSchema()` consumes the stable description
- `toTypeScript(name)` consumes the stable description
- `toOpenAPI()` derives from `toJSONSchema()`
- `toFormConstraints()` consumes the stable description

All source policy is documented in:

`docs/internal/contract-model.md`

## 4. JSON Schema readiness

Readiness indicator: ready for extraction.

Current modifiers:

- primitive contracts
- literal contracts
- literal unions
- arrays
- objects incl modal extensions
- exact mode
- contract metadata mapped
- legacy unknown/fallbacks included

Technical fact: there are no parser internals or runtime enforcement in this projection.

## 5. TypeScript readiness

Readiness indicator: ready for extraction.

Current modifiers:

- string emission
- exact object projection
- array/object Base clauses
- optional fields
- literal unions
- named sigil references included
- metadata defaults included
- metadata references fallback to registry names

Technical fact: zero TypeScript compiler dependency today

Strategic caution: field order assumptions are implicit, caller-controlled, and not yet contract-enforced.

## 6. OpenAPI readiness

Readiness indicator: schema-level ready, document-level not ready.

Current capability:

- schema projection through JSON Schema
- nested contracts
- deterministic output

Not yet available:

- full documents
- route tables
- parameters or request/response operation metadata

## 7. Projection error handling

Readiness indicator: ready for extraction.

Current modifiers:

- `SigilProjectionError`
- fields defined
- unsupported kinds handled
- broad descriptors handled

## 8. Remaining blockers

Blocker A: projection APIs are not yet stabilized after heavy deletion.

Blocker B: forms projection is still experimental.

Blocker C: callers still depend on internal aliases like `Sigil` and `sigil` in tests.

Blocker D: `httpContract()` is present, but it has not been validated as a stable public boundary.

## 9. Recommended extraction order

If extraction is approved:

1. `@sigil/json-schema`
2. `@sigil/ts`
3. `@sigil/openapi`
4. `@sigil/testing`
5. `@sigil/ai`
6. `@sigil/forms`
7. `@sigil/http`

## 10. Recommendation: split or stay single package

Stay single package until `0.4.0`.

Reasons:

- modular source already exists
- zero runtime dependency is intact
- extraction is technically possible now
- API lifetimes are not yet meaningful enough to justify consumer-facing package boundaries

Preferred transition trigger:

> Split if API breakage continues to fall after more natural usage.
