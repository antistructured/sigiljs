# Package Split Readiness Report

Status: **not ready to split yet**.

SigilJS now has the right architectural direction for future packages: `describe()` is the projection bridge, JSON Schema / TypeScript / OpenAPI projections are tested, and the CLI can exercise the projection commands. The implementation should still remain a single package until the projection contracts, package boundaries, and dependency story are stable enough that external packages would not need private internals.

Recommended near-term action: **keep shipping `sigil` as one package and treat `@sigil/core`, `@sigil/json-schema`, `@sigil/ts`, and `@sigil/openapi` as planned package boundaries, not repository folders yet.**

## Evidence reviewed

- Public exports in `src/index.js`
- Contract object and projection implementation in `src/sigil.js`
- HTTP boundary helper in `src/http.js`
- Package metadata in `package.json`
- Stable description shape in [Internal Contract Model](internal/contract-model.md)
- Current policy docs: [Package Split Policy](package-split.md) and [v1 Readiness](v1-readiness.md)
- Projection docs and tests:
  - `tests/describe-model.test.js`
  - `tests/json-schema.test.js`
  - `tests/typescript-projection.test.js`
  - `tests/openapi-projection.test.js`
  - `tests/projection-consistency.test.js`
  - `tests/cli.test.js`

## Readiness summary

| Candidate package    | Readiness  | Recommendation                                                                                                         |
| -------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| `@sigil/core`        | Medium     | Define the future core boundary now, but do not split until internal AST/parser/compiler surfaces are clearly private. |
| `@sigil/json-schema` | Medium     | Keep in core until JSON Schema options, reference handling, metadata behavior, and compatibility targets are stable.   |
| `@sigil/ts`          | Medium     | Keep in core until TypeScript output formatting, naming, reference semantics, and file-emission scope are settled.     |
| `@sigil/openapi`     | Low/Medium | Keep in core; current `toOpenAPI()` is intentionally a JSON Schema clone and not yet a distinct OpenAPI adapter.       |

## Stable APIs

These APIs are good candidates for the eventual `@sigil/core` public surface.

### Define

- `Sigil`, `S`, `T`
- `sigil()` object definitions
- `sigil.exact()` and `Sigil.exact`
- `optional()`
- `union()`
- `oneOf()`
- `Sigil.define()` / `Sigil.named()`
- `Sigil.collection()`

Why this is stable enough to keep refining:

- Template syntax and object-definition syntax both produce the same contract object shape.
- Plain object definitions are adapters into the existing contract pipeline, not a parallel compiler.
- Scoped collections are already isolated from the global named registry.

### Enforce

- `check(value)`
- `assert(value)`
- `parse(value)`
- `safeParse(value)`
- `serialize(value)`
- `SigilValidationError`

Why this is stable enough to keep refining:

- `check()` remains the boolean fast path.
- `parse()` / `assert()` expose path-aware diagnostics through `SigilValidationError`.
- `safeParse()` returns stable result objects without throwing.

### Transform

- `transform(fn)`
- `pipe(definition, ...transforms)`
- `trim()`

Why this is stable enough to keep refining:

- The safety rule is explicit: validate input → transform → validate output.
- Transform metadata appears in `describe()` as counts and paths, not function bodies.

### Project bridge

- `describe()`

Why this is the most important stable seam:

- JSON Schema, TypeScript, OpenAPI, forms, mocks, cases, and lifecycle diffs all consume `describe()` or projections derived from it.
- The model covers primitives, literals, arrays, objects, optionals, unions, exact mode, references, metadata, and transform metadata.
- `tests/projection-consistency.test.js` now verifies agreement across `describe()`, `toJSONSchema()`, `toTypeScript()`, and `toOpenAPI()` for required fields, optional fields, literal unions, exact mode, arrays, and nested objects.

### Current projection APIs

These are stable enough for candidate-v1 use, but not yet stable enough to move into separate packages:

- `toJSONSchema()`
- `toTypeScript(name)`
- `toOpenAPI()`
- `toFormConstraints()`
- `mock()`
- `cases()`
- `diff(other)`

## Unstable APIs and seams

### Internal parser/compiler/AST shape

Current contract objects expose implementation details:

- `ast`
- `normalized`
- `validator`
- `options`
- `source` / `raw`

These are useful today for tests and diagnostics, but they are not good cross-package dependencies. Future projection packages should not import parser/compiler internals or read `ast` / `normalized`; they should consume `describe()`.

Recommendation:

- Treat `ast`, `normalized`, and parser/compiler modules as private implementation details before splitting.
- Decide whether `validator`, `source`, `raw`, and `options` are public contract-object properties or compatibility-only fields.

### JSON Schema projection details

`toJSONSchema()` currently supports the important MVP shapes:

- primitives
- arrays
- objects
- required / optional fields
- exact mode as `additionalProperties: false`
- literals and literal unions
- primitive unions
- named references as `$ref`
- metadata as `title`, `description`, `x-version`, and `x-tags`

Remaining unstable areas:

- JSON Schema draft/version target is not declared.
- `$defs` emission and reference collection are not yet a full schema-document story.
- Numeric/string constraints beyond type shape are not represented.
- Unknown / any / never behavior is intentionally minimal.
- Metadata extension keys are still policy, not ecosystem contract.

### TypeScript projection details

`toTypeScript(name)` is intentionally emit-only and dependency-free.

Remaining unstable areas:

- No `.d.ts` file emission API yet.
- Object property names are emitted directly; escaping/quoting for non-identifier property keys is not yet specified.
- Formatting is intentionally simple and may change.
- Named-reference semantics depend on current registry behavior.
- Optional metadata emits a doc comment, but naming/title semantics are not final.

### OpenAPI projection details

`toOpenAPI()` currently returns a fresh clone of `toJSONSchema()` output.

Remaining unstable areas:

- OpenAPI version target is not declared.
- The package does not yet distinguish OpenAPI 3.0 vs 3.1 schema differences.
- Operation-level helpers are still minimal and live in `httpContract()`.
- Request/response docs, content-types, status codes, parameters, and route metadata are not a mature adapter surface.

### Lifecycle diff scope

`diff(other)` is useful and tested, but intentionally narrow:

- object contracts only
- top-level field changes and practical nested object-property changes
- exact-mode changes
- no nested compatibility scoring
- no semantic-version classification beyond change `impact`

This should stay in core for now or be documented as experimental before any lifecycle package split.

### CLI package boundary

The CLI is useful and now supports:

- `check`
- `describe`
- `json-schema`
- `types`
- `openapi`
- `mock`
- `diff`

But it should not be split yet. It still depends on file-based `.sigil` template syntax and has no plugin/config story. A future `@sigil/cli` can exist after projection package boundaries settle.

## Blockers before package split

1. **Declare the v1 public contract object shape.**
   - Decide which enumerable properties are public vs compatibility-only.
   - Avoid forcing future packages to rely on `ast`, `normalized`, or parser internals.

2. **Freeze the `describe()` schema.**
   - Document every `kind` and field in a machine-readable or highly explicit reference.
   - Include metadata and transform metadata as stable submodels.
   - Add versioning policy for future `describe()` model changes.

3. **Define projection compatibility targets.**
   - JSON Schema draft target.
   - OpenAPI version target.
   - TypeScript output target/scope.

4. **Complete reference/document emission policy.**
   - Decide how named references produce `$defs` in JSON Schema packages.
   - Decide how TypeScript packages emit referenced aliases across files.
   - Decide how OpenAPI packages compose component schemas.

5. **Separate package-private implementation from public adapters.**
   - Projection code currently lives in `src/sigil.js` with contract construction, transforms, mocks, cases, and diffs.
   - Before splitting, extract internal projection helpers behind public description-input functions or package-local adapters.

6. **Clarify distribution and namespace migration.**
   - Current package name is `sigil`.
   - Future package names use `@sigil/*` in docs.
   - A namespace transition plan is needed before publishing split packages.

7. **Avoid premature dependency decisions.**
   - Core should remain zero-runtime-dependency.
   - `@sigil/ts` may eventually justify TypeScript as an optional/dev dependency, but current emit-only projection does not.
   - `@sigil/openapi` may eventually justify OpenAPI-specific utilities, but current clone projection does not.

## Recommended package boundaries

### `@sigil/core`

Owns runtime contract definition and enforcement.

Recommended exports:

- `Sigil`, `S`, `T`
- `sigil`, `optional`, `union`, `oneOf`
- `pipe`, `trim`
- `SigilValidationError`
- `realType`
- `httpContract` only if HTTP remains framework-neutral core; otherwise move it later to `@sigil/http`
- contract methods:
  - `check`
  - `assert`
  - `parse`
  - `safeParse`
  - `serialize`
  - `transform`
  - `withMetadata`
  - `describe`

Should not require:

- JSON Schema-specific logic
- TypeScript-specific logic
- OpenAPI-specific logic
- CLI code
- benchmark or example code

### Future `@sigil/json-schema` package (does not exist yet)

Owns JSON Schema projection from the public description model.

Recommended API shape:

```txt
// hypothetical future package API, not available today
toJSONSchema(contractOrDescription, options)
```

Responsibilities:

- JSON Schema draft/version options
- `$defs` / references / schema document output
- metadata mapping
- compatibility tests for supported JSON Schema target(s)

Should consume:

- `contract.describe()` or a plain description object

Should not consume:

- parser AST
- normalized compiler internals

### Future `@sigil/ts` package (does not exist yet)

Owns TypeScript declaration generation.

Recommended API shape:

```txt
// hypothetical future package API, not available today
toTypeScript(contractOrDescription, { name: 'User' })
```

Responsibilities:

- declaration formatting
- identifier/property escaping
- named-reference alias handling
- optional `.d.ts` file emission helpers
- future TypeScript integration without adding TypeScript concerns to runtime core

Should remain dependency-light. TypeScript itself is not required for the current emit-only MVP.

### Future `@sigil/openapi` package (does not exist yet)

Owns OpenAPI schema and operation helpers.

Recommended API shape:

```txt
// hypothetical future package API, not available today
toOpenAPI(contractOrDescription, options)
operation({ request, response, method, path })
```

Responsibilities:

- OpenAPI 3.0 / 3.1 compatibility decisions
- component schema generation
- request/response operation objects
- route metadata, status codes, content types, parameters
- framework-adapter integration points later

Should consume:

- `contract.describe()`
- JSON Schema adapter output when appropriate

Should not be created while `toOpenAPI()` is only a clone of JSON Schema output.

## Recommended sequencing

1. Keep one package through v1 candidate stabilization.
2. Publish/maintain a formal `describe()` model reference.
3. Extract projection helpers internally by input type, but keep them in the same package.
4. Add projection option objects without breaking current methods.
5. Stabilize JSON Schema document/reference output.
6. Stabilize TypeScript naming/escaping/file-output behavior.
7. Stabilize OpenAPI version and operation-helper behavior.
8. Only then create split packages, with `sigil` re-exporting or depending on the split packages during migration.

## Final recommendation

Do **not** split yet.

SigilJS is ready for a package-boundary design document, not package creation. The safest path is to keep projections in core while hardening `describe()` as the public contract model. Once external packages can consume only `describe()` and each projection has a clear compatibility target, the split into `@sigil/core`, `@sigil/json-schema`, `@sigil/ts`, and `@sigil/openapi` will be low-risk and useful rather than cosmetic.
