# Projection Boundary Audit

Block: Projection Extraction Readiness  
Package identity: `@weipertda/sigiljs` remains the single package for this audit. No `@sigil/*` packages are introduced here.

## Scope

This audit checks whether the current projection-facing methods consume the stable contract description model instead of parser-specific AST internals.

Inspected areas:

- `src/sigil.js`
- `src/http.js`
- `src/core/`
- `src/playground.js`
- `docs/internal/contract-model.md`
- `tests/projections/projection-compatibility.test.js`
- projection-adjacent tests under `tests/`

The architectural boundary remains:

```txt
sigil definition
↓
contract object
↓
describe()
↓
projection functions
```

The parser AST is not the projection API.

## Current Projection Methods

| Method | Status | Primary implementation | Source model | Extraction readiness |
| --- | --- | --- | --- | --- |
| `describe()` | Present | `src/sigil.js` | Stable description generated from normalized contract internals | Mostly ready as the contract-model bridge, but still colocated with contract construction |
| `toJSONSchema()` | Present | `src/projections/json-schema.js` via `src/sigil.js` wrapper | `sigil.describe()` | Internally modular and ready for later extraction planning |
| `toTypeScript(name)` | Present | `src/projections/typescript.js` via `src/sigil.js` wrapper | `sigil.describe()` plus registry-name collection from description references | Internally modular; registry resolution is now an explicit option passed by the wrapper |
| `toOpenAPI()` | Present | `src/projections/openapi.js` via `src/sigil.js` wrapper | `sigil.describe()` projected through JSON Schema | Internally modular as a thin OpenAPI-compatible clone layer |
| `httpContract(...).toOpenAPI()` | Present | `src/http.js` | request/response contracts' `toOpenAPI()` methods | Ready as an HTTP helper adapter, not as the core OpenAPI projector itself |
| `toFormConstraints()` | Present | `src/projections/forms.js` via `src/sigil.js` wrapper | `sigil.describe()` | Internally modular; experimental surface should be documented before future package extraction |
| `toMarkdown()` | Absent | Not implemented | N/A | Not ready; if added, it must consume `describe()` |
| `mock()` | Present | `src/projections/mock.js` via `src/sigil.js` wrapper | `sigil.describe()` plus explicit resolver option for references | Internally modular and ready for later testing-helper extraction planning |
| `cases()` | Present | `src/projections/cases.js` via `src/sigil.js` wrapper | `sigil.describe()` plus explicit resolver option for references | Internally modular and ready for later testing-helper extraction planning |
| `diff(other)` | Present | `src/sigil.js` | `sigil.describe()` and `other.describe()` | Mostly ready; currently intentionally object-only |

## Method Findings

### `describe()`

1. **Consumes `describe()` or stable model data?** It creates the stable model. It consumes the normalized contract representation and emits plain description objects.
2. **Touches parser-specific AST internals?** It does not consume raw parser AST directly at the public method boundary, but it does depend on the normalized internal node shape through `describeContract()` / `describeNode()`.
3. **Deterministic output?** Yes. Properties, union variants, metadata fields, and transform metadata are emitted in stable source order.
4. **Preserves metadata?** Yes. Contract metadata and transform metadata are cloned into the top-level `metadata` field when present.
5. **Handles unsupported contract kinds clearly?** Partially. Unknown internal node kinds become `{ kind: node.kind ?? 'unknown' }` instead of throwing.
6. **Could it be moved to a separate module later?** Yes, but it is the bridge layer rather than a projection package. A future extraction should keep `describe()` near core contract construction or expose a small internal `describeContract()` module.

Evidence:

- Contract method wiring: `src/sigil.js:93`
- Description bridge: `src/sigil.js:499`
- Node-to-description mapping: `src/sigil.js:528`
- Contract model docs: `docs/internal/contract-model.md:1`

### `toJSONSchema()`

1. **Consumes `describe()` or stable model data?** Yes. The contract method calls `toJSONSchema(sigil.describe())`.
2. **Touches parser-specific AST internals?** No. The projector switches on description `kind` values.
3. **Deterministic output?** Yes. Object properties, required arrays, union variants, and metadata key order are emitted deterministically.
4. **Preserves metadata?** Yes. `name`, `description`, `version`, and `tags` are projected as `title`, `description`, `x-version`, and `x-tags`.
5. **Handles unsupported contract kinds clearly?** Partially. `any` and `unknown` intentionally project to `{}`, `never` projects to `{ not: {} }`, and unrecognized kinds fall back to `{}` without an error.
6. **Could it be moved to a separate module later?** Yes. It already accepts a description object and can be moved under an internal projection module without changing public API.

Evidence:

- Contract method wiring: `src/sigil.js:106`
- Projector implementation: `src/projections/json-schema.js:1`
- Metadata projection: `src/projections/json-schema.js:41`
- Compatibility tests: `tests/projections/projection-compatibility.test.js:126`

### `toTypeScript(name)`

1. **Consumes `describe()` or stable model data?** Yes. It stores `const described = sigil.describe()` and passes that to `toTypeScriptDeclaration()`.
2. **Touches parser-specific AST internals?** No. Type generation uses the description model.
3. **Deterministic output?** Yes. Output is string-only and follows description property/variant order.
4. **Preserves metadata?** Partially. `description`, `version`, and `tags` are emitted as a JSDoc comment. `metadata.name` is not used when an explicit type name is passed.
5. **Handles unsupported contract kinds clearly?** Partially. Unsupported description kinds emit `unknown`.
6. **Could it be moved to a separate module later?** Yes. It now lives in an internal module and receives registry/reference lookup as an explicit option from the contract wrapper.

Evidence:

- Method boundary: `src/sigil.js:107`
- Registry-name collection and type declaration implementation: `src/projections/typescript.js:1`
- Type expression implementation: `src/projections/typescript.js:57`
- Compatibility tests: `tests/projections/projection-compatibility.test.js:129`

### `toOpenAPI()`

1. **Consumes `describe()` or stable model data?** Indirectly. Contract `toOpenAPI()` calls `sigil.toJSONSchema()`, which calls `sigil.describe()`.
2. **Touches parser-specific AST internals?** No.
3. **Deterministic output?** Yes. It deep-clones deterministic JSON Schema output.
4. **Preserves metadata?** Yes, because metadata has already been projected by `toJSONSchema()`.
5. **Handles unsupported contract kinds clearly?** Same as JSON Schema, because it delegates to JSON Schema output.
6. **Could it be moved to a separate module later?** Yes. It is currently a thin clone layer and could live in an OpenAPI projection module that accepts a description or JSON Schema-compatible projection.

Evidence:

- Method boundary: `src/sigil.js:109`
- Clone implementation: `src/projections/openapi.js:3`
- Compatibility tests: `tests/projections/projection-compatibility.test.js:128`
- HTTP adapter usage: `src/http.js:23`

### `httpContract(...).toOpenAPI()`

1. **Consumes `describe()` or stable model data?** Indirectly. It calls `request.toOpenAPI()` and `response.toOpenAPI()`.
2. **Touches parser-specific AST internals?** No.
3. **Deterministic output?** Yes. The operation object shape is static and embeds deterministic schemas.
4. **Preserves metadata?** Yes, through request/response schema projections.
5. **Handles unsupported contract kinds clearly?** It delegates unsupported schema behavior to the contract-level OpenAPI projection and validates that inputs look like Sigil contracts.
6. **Could it be moved to a separate module later?** Yes, as a framework-neutral HTTP/OpenAPI adapter after core projection modules are separated.

Evidence:

- HTTP contract guard: `src/http.js:1`
- HTTP OpenAPI adapter: `src/http.js:23`
- Public method: `src/http.js:58`

### `toFormConstraints()`

1. **Consumes `describe()` or stable model data?** Yes. It calls `toFormConstraints(sigil.describe())`.
2. **Touches parser-specific AST internals?** No.
3. **Deterministic output?** Yes. Object field constraints follow description property order.
4. **Preserves metadata?** No. This helper emits field constraints only.
5. **Handles unsupported contract kinds clearly?** Partially. Non-object contracts return `{}`; unsupported field kinds fall back to `{ type: 'text' }`.
6. **Could it be moved to a separate module later?** Yes, but it should first be documented as experimental or formalized as a forms projection surface.

Evidence:

- Method boundary: `src/sigil.js:110`
- Form constraint implementation: `src/projections/forms.js:1`
- Tests: `tests/forms-projection.test.js:11`

### `toMarkdown()`

1. **Consumes `describe()` or stable model data?** Not applicable; method is absent.
2. **Touches parser-specific AST internals?** Not applicable.
3. **Deterministic output?** Not applicable.
4. **Preserves metadata?** Not applicable.
5. **Handles unsupported contract kinds clearly?** Not applicable.
6. **Could it be moved to a separate module later?** Yes, if implemented as a `describe()` consumer.

Recommended policy: do not add `toMarkdown()` just to satisfy extraction readiness. If a future docs projection is added, implement it as a separate description-to-Markdown projector and wire the contract method through `sigil.describe()`.

### `mock()`

1. **Consumes `describe()` or stable model data?** Yes. It calls `mockValue(sigil.describe())`.
2. **Touches parser-specific AST internals?** No.
3. **Deterministic output?** Yes. Arrays use one element, objects include required fields only, unions choose the first variant, and literal unions choose the first literal.
4. **Preserves metadata?** No. It generates data values, not projection metadata.
5. **Handles unsupported contract kinds clearly?** Partially. Unsupported kinds return `undefined`; unresolved references also return `undefined`.
6. **Could it be moved to a separate module later?** Yes. It now lives in an internal module and receives reference resolution as an explicit option from the contract wrapper.

Evidence:

- Method boundary: `src/sigil.js:112`
- Mock implementation: `src/projections/mock.js:1`
- Compatibility tests: `tests/projections/projection-compatibility.test.js:192`

### `cases()`

1. **Consumes `describe()` or stable model data?** Yes. It calls `casesFor(sigil.describe())`.
2. **Touches parser-specific AST internals?** No.
3. **Deterministic output?** Yes. Valid cases come from deterministic `mock()` behavior and invalid cases use fixed type/literal/object mutations.
4. **Preserves metadata?** No. It generates test values, not projection metadata.
5. **Handles unsupported contract kinds clearly?** Partially. Unsupported invalid values fall back to `null`; unresolved references can produce `undefined`.
6. **Could it be moved to a separate module later?** Yes, with explicit reference resolution passed into the testing helper package boundary.

Evidence:

- Method boundary: `src/sigil.js:113`
- Cases implementation: `src/projections/cases.js:3`
- Invalid-value implementation: `src/projections/cases.js:10`
- Compatibility tests: `tests/projections/projection-compatibility.test.js:212`

### `diff(other)`

1. **Consumes `describe()` or stable model data?** Yes. It calls `diffContracts(sigil.describe(), describeOtherContract(other))`, and `describeOtherContract()` requires `other.describe()`.
2. **Touches parser-specific AST internals?** No.
3. **Deterministic output?** Yes. Entries are emitted in deterministic object property order with stable `kind`, `path`, and `impact` fields.
4. **Preserves metadata?** Yes. Metadata changes are emitted as lifecycle diff entries for `name`, `version`, `description`, and `tags`.
5. **Handles unsupported contract kinds clearly?** Yes for current scope. Non-object root contracts throw `Contract diff currently supports object contracts only`; non-Sigil `other` values throw `Contract diff requires another Sigil contract`.
6. **Could it be moved to a separate module later?** Yes. It already works on plain description objects after the contract method boundary.

Evidence:

- Method boundary: `src/sigil.js:112`
- Other-contract guard: `src/sigil.js:584`
- Diff implementation: `src/sigil.js:591`
- Unsupported root-kind error: `src/sigil.js:592`
- Tests: `tests/contract-diff.test.js:5`

## Source Dependency Summary

| Projection area | Direct source dependencies today | Parser/AST dependency risk |
| --- | --- | --- |
| Description bridge | `src/sigil.js`, normalized internal nodes | Expected internal bridge risk; this is not a package projection yet |
| JSON Schema | Description objects only, isolated in `src/projections/json-schema.js` | Low |
| TypeScript | Description objects plus explicit `resolve` option from the wrapper | Low/medium because reference resolution still depends on core registry behavior, but the module boundary is explicit |
| OpenAPI | Description objects projected through JSON Schema, isolated in `src/projections/openapi.js` | Low |
| HTTP OpenAPI adapter | Contract `toOpenAPI()` methods | Low |
| Forms | Description objects only, isolated in `src/projections/forms.js` | Low |
| Mock/testing helpers | Description objects plus explicit `resolve` option from the wrapper | Low/medium because reference resolution still depends on core registry behavior, but the module boundary is explicit |
| Diff | Description objects only | Low |

No audited projection method directly imports `src/core/parser.js`, `src/core/normalize.js`, `src/core/compile.js`, or `src/core/validate.js`. Those internals are used by contract construction, validation, and `describe()` bridge generation, not by the projection algorithms after the description boundary.

## Extraction-Readiness Assessment

Current state after internal module separation: **extraction-ready at the algorithm boundary and internally modular at the file boundary, while still intentionally kept inside one package.**

Strengths:

- Projection methods are already routed through `describe()` or through another stable projection derived from `describe()`.
- Projection outputs are deterministic and covered by snapshot-style expectations.
- Contract metadata is preserved in JSON Schema, OpenAPI, TypeScript comments, and lifecycle diffs.
- `diff()` already rejects unsupported root kinds clearly.
- `docs/internal/contract-model.md` defines the stable model and future package policy.

Risks/blockers:

1. **Reference resolution is explicit but still core-backed.** `toTypeScript()`, `mock()`, and `cases()` now receive a `resolve` option from the contract wrapper; future packages should keep that resolver/context seam public or adapter-based.
2. **Unsupported-kind behavior is inconsistent.** JSON Schema falls back to `{}`, TypeScript falls back to `unknown`, forms fall back to text or `{}`, mock/cases may return `undefined`/`null`, and diff throws for unsupported root kinds.
3. **`toFormConstraints()` exists but is not part of the requested future package list by name.** It maps naturally to `@sigil/forms`, but it should be formalized before extraction.
4. **`toMarkdown()` is absent.** This is acceptable for the current block; adding it should be a future feature, not an audit side effect.

## Recommended Cleanup Tasks

These are ordered to support the remaining Projection Extraction Readiness block without splitting packages:

1. Standardize unsupported-kind handling per projection:
   - JSON Schema/OpenAPI: document `{}` for unknown/any-like descriptions or throw for malformed descriptions.
   - TypeScript: document `unknown` fallback or throw for malformed descriptions.
   - Forms/testing helpers: document current fallback behavior or make unsupported references explicit.
   - Diff: keep clear thrown errors for unsupported root kinds.
2. Add/keep snapshot-style projection tests around a rich contract that exercises metadata, exact mode, nested objects, arrays, primitive unions, literal unions, optionals, references, `mock()`, and `cases()`.
3. Update `docs/internal/contract-model.md` and public projection architecture docs after module separation, without creating new packages.

## Conclusion

SigilJS projection systems are stable enough to prepare for eventual extraction and now have internal module seams for active projections. The key boundary remains correct: projections consume `describe()` or a stable projection derived from it rather than parser AST internals.

The next readiness step should be projection hardening inside the existing `@weipertda/sigiljs` package, not package splitting.
