# Public Export Audit

Audit date: 2026-06-20
Package: `@weipertda/sigiljs` 0.4.0
Entry point: `src/index.js` → `package.json` `exports["."]`
Sources inspected: `src/index.js`, `src/sigil.js`, `src/http.js`, `src/core/realType.js`, `src/core/errors.js`, `docs/api.md`, `docs/sigils.md`, `README.md`, `tests/`, `examples/`, `docs/*.md`

## Scope

Only symbols accessible through the package entry point (`@weipertda/sigiljs`) are listed.
Symbols exported inside `src/` but not re-exported through `src/index.js` are recorded under **Internal exports only**.
Symbols attached to exported constructors as properties are listed under **Attached constructor methods**.

## Named exports

| Export | Status | Purpose | Notes |
|---|---|---|---|
| `Sigil` | stable | tagged-template contract factory | primary template API; extensive docs, examples, tests |
| `S` | stable | alias for `Sigil` | documented in `docs/sigils.md` |
| `T` | stable | alias for `Sigil` | documented in `docs/sigils.md`; used in tests |
| `sigil` | stable | object-definition contract factory | primary plain-JS API; extensive docs, examples, tests |
| `optional` | stable | optional field helper | object-definition API |
| `union` | stable | primitive union helper | object-definition API |
| `oneOf` | stable | literal union helper | object-definition API |
| `pipe` | stable | transform composition helper | documented in `docs/api.md` |
| `trim` | stable | string trimming transform helper | documented in `docs/api.md` |
| `httpContract` | experimental | HTTP boundary helper | extraction readiness report: not validated as stable boundary |
| `realType` | stable | runtime type detection utility | dedicated docs page, examples |
| `real` | stable | alias for `realType` | exported for ergonomic use |
| `Real` | stable | alias for `realType` | exported for ergonomic use |
| `SigilValidationError` | stable | structured validation error | thrown by `assert()` / `parse()` / `serialize()` |

## Attached constructor methods (not standalone exports)

These are accessed through exported constructors and are part of the public surface, but they are not separately named exports from `src/index.js`.

| Attached symbol | Status | Purpose |
|---|---|---|
| `Sigil.exact` | stable | exact-mode tagged-template factory |
| `Sigil.meta(metadata)` | stable | metadata-attached tagged-template factory |
| `Sigil.named(name)` / `Sigil.define(name)` | stable | globally registered named template factory |
| `Sigil.collection(definitions)` | stable | grouped reusable sigils with local resolution |
| `sigil.exact(definition, metadata?)` | stable | exact-mode object-definition factory |

## Contract instance methods

Every contract object returned by `Sigil`, `sigil()`, or `sigil.exact()` exposes this stable shape:

| Method | Status | Purpose |
|---|---|---|
| `check(value, options?)` | stable | returns boolean |
| `assert(value, options?)` | stable | validate and return trusted data; throws `SigilValidationError` |
| `parse(value, options?)` | stable | validate, transform, and re-validate; throws `SigilValidationError` |
| `safeParse(value, options?)` | stable | non-throwing validate; returns `{ success, data?, error? }` |
| `serialize(value, options?)` | stable | boundary-safe validate; throws `SigilValidationError` |
| `transform(fn)` | stable | derived contract with transformation pipeline |
| `withMetadata(metadata)` | stable | derived contract with updated metadata |
| `version(version)` | stable | shorthand metadata versioning |
| `describe()` | stable | returns stable contract description object |
| `toJSONSchema(options?)` | stable | projects to JSON Schema |
| `toTypeScript(name, options?)` | stable | projects to TypeScript type declaration |
| `toOpenAPI(options?)` | stable | projects to OpenAPI schema |
| `toFormConstraints(options?)` | experimental | projects basic form metadata; not yet stable |
| `mock(options?)` | stable | deterministic valid sample value |
| `cases(options?)` | stable | deterministic valid/invalid test cases |
| `diff(other)` | stable | deterministic lifecycle diff entries |
| `compile()` | stable | returns compiled boolean validator |

## Internal exports only

These are exported inside `src/` files but are **not** re-exported through `src/index.js` and are therefore not publicly accessible through the package entry point.

| Symbol | Source | Purpose |
|---|---|---|
| `createValidationError(details)` | `src/core/errors.js` | internal factory for `SigilValidationError` payload |
| `projectionError({...})` | `src/projection-error.js` | internal projection error factory |
| `unsupportedProjectionKind(...)` | `src/projection-error.js` | internal unsupported-kind guard |
| `projectJSONSchema(description)` | `src/projections/json-schema.js` | internal JSON Schema engine |
| `projectTypeScript(description, options)` | `src/projections/typescript.js` | internal TypeScript engine |
| `projectOpenAPI(description)` | `src/projections/openapi.js` | internal OpenAPI engine |
| `projectFormConstraints(description)` | `src/projections/forms.js` | internal forms project engine |
| `projectMock(description, options)` | `src/projections/mock.js` | internal mock engine |
| `projectCases(description, options)` | `src/projections/cases.js` | internal test-cases engine |
| `assert(astOrSigil, value, opts)` | `src/core/assert.js` | internal validation orchestrator |
| `validate(astOrSigil, value, opts)` | `src/core/validate.js` | internal boolean validator |
| `parse(input, options)` | `src/core/parser.js` | internal schema parser |
| `tokenize(input)` | `src/core/tokenizer.js` | internal tokenizer |
| `normalize(ast)` | `src/core/normalize.js` | internal AST normalizer |
| `compile(ast)` | `src/core/compile.js` | internal validator compiler |
| `getAstRegistry(ast)` | `src/core/compile.js` | internal AST registry accessor |
| `partial(ast)` | `src/core/partial.js` | internal partial evaluation |
| `register(name, sigil)` | `src/core/registry.js` | internal global registry writer |
| `resolve(name)` | `src/core/registry.js` | internal global registry reader |
| `clear()` | `src/core/registry.js` | internal global registry reset |
| `canonicalize(ast)` | `src/core/cache.js` | internal AST canonicalizer |
| `validatorCache` | `src/core/cache.js` | internal compiled-validator cache |

## Accidental / unknown exports

None detected.
`src/index.js` is the sole package entry point and re-exports only the symbols above.
No symbol is exported from the package boundary without explicit intent.

## Alias policy notes

- `S` and `T` are convenience aliases for `Sigil`.  
  They are intentionally exported and documented, but they add surface area if extraction ever occurs.
- `real` and `Real` are convenience aliases for `realType`.  
  Same extraction-surface consideration applies.

## Findings

1. **No accidental exports.** The public surface is fully enumerated by `src/index.js`.
2. **One experimental export:** `httpContract`. It is already documented as experimental in `docs/api.md`.
3. **One experimental contract method:** `toFormConstraints()`.
4. **Aliases add surface area** (`S`, `T`, `real`, `Real`). They are classified stable because they are already shipped and documented, but they are the strongest candidates for deprecation discussion if package extraction advances.
