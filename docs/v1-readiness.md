# v1 Readiness

SigilJS v1 should lock the core category and stabilize the public system.

Positioning:

```txt
SigilJS is an executable data contract system for JavaScript.

Define structure once. Project it everywhere.
```

## v1 readiness checklist

| Requirement                  | Current status                 | Evidence                                                                                                     |
| ---------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Stable Define API            | In progress / candidate stable | `Sigil`, `S`, `T`, `sigil()`, `optional()`, `union()`, `oneOf()`, `Sigil.define()`, `Sigil.collection()`     |
| Stable Enforce API           | In progress / candidate stable | `check()`, `assert()`, `parse()`, `safeParse()`, `serialize()`                                               |
| Stable Transform API         | In progress / candidate stable | `transform()`, `pipe()`, `trim()`, validate → transform → validate safety rule                               |
| Stable Project API           | In progress / candidate stable | `describe()`, `toJSONSchema()`, `toTypeScript()`, `toOpenAPI()`, `toFormConstraints()`                       |
| Stable error model           | In progress / candidate stable | `SigilValidationError` with `code`, `message`, `path`, `expected`, `actual`                                  |
| Stable contract object model | In progress / candidate stable | Contract shape documented in [Core API Audit](core-api-audit.md) and tested in `tests/contract-core.test.js` |
| Stable projection model      | In progress / candidate stable | `describe()` is the public bridge; projections consume it instead of parser internals                        |
| Docs for boundary use cases  | Covered                        | [Examples](examples.md), HTTP helpers, AI structured output, CLI, lifecycle docs                             |
| Tests for all pillars        | Covered                        | Define, Enforce, Transform, Project, lifecycle, CLI, and helper tests                                        |
| Credible benchmark story     | Covered for candidate v1       | `bench/validate-user.js`, `bench/validate-array.js`, `bench/validate-nested.js`; benchmark docs below        |
| Clear package roadmap        | Covered                        | [Package Split Policy](package-split.md)                                                                     |

## Pillar stability targets

### Define

Define APIs must stay coherent across template syntax and plain JavaScript definitions:

```js
const User = Sigil`{ id: number, name: string }`;

const AlsoUser = sigil({
  id: Number,
  name: String,
});
```

v1 requirement:

- preserve tagged-template syntax
- preserve object-definition syntax
- preserve named sigils and scoped collections
- avoid parallel compiler paths where possible

### Enforce

Enforcement APIs must remain predictable:

```js
User.check(data); // boolean fast path
User.parse(data); // trusted value or SigilValidationError
User.safeParse(data); // result object, never throws
User.assert(data); // trusted value or SigilValidationError
```

v1 requirement:

- `check()` stays boolean-only and fast
- diagnostic work stays on assert/parse paths
- `SigilValidationError` shape remains stable

### Transform

Transform APIs must preserve the safety rule:

```txt
validate input → transform → validate output
```

v1 requirement:

- transformations never silently return untrusted output
- exact mode rejects unknown keys before transform
- loose mode preserves unknown keys

### Project

Projection APIs must build from the public description model:

```txt
contract → describe() → projection
```

v1 requirement:

- `describe()` remains the stable projection bridge
- JSON Schema, TypeScript, OpenAPI, and Forms projections do not depend on parser internals
- future packages consume public descriptions, not private AST shapes

## Error model

`SigilValidationError` should remain stable for v1:

```js
{
  code: 'SIGIL_VALIDATION_FAILED',
  message,
  path,
  expected,
  actual,
}
```

The error model supports API boundaries, config validation, CLI diagnostics, LLM repair flows, and developer-grade test assertions.

## Contract object model

The contract object model is the public runtime shape. It is documented in [Core API Audit](core-api-audit.md) and guarded by `tests/contract-core.test.js`.

A v1 contract should expose one coherent executable object for:

- validation
- enforcement
- transforms
- projections
- testing helpers
- lifecycle diffs

## Projection model

`describe()` is the bridge between runtime contracts and projection packages.

Current projections:

- JSON Schema: `toJSONSchema()`
- TypeScript: `toTypeScript(name)`
- OpenAPI-compatible schema: `toOpenAPI()`
- Forms: `toFormConstraints()`

Future projection packages should split only after this model is stable.

## Boundary docs

Boundary use cases are already represented by runnable examples and docs:

- API requests and responses
- config files
- webhooks
- queue messages
- HTTP request/response contracts
- LLM structured output
- AI tool calls
- CLI file workflows
- contract lifecycle diffs

See [Examples](examples.md).

## Tests by pillar

Representative coverage:

| Pillar                                | Test files                                                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Define                                | `tests/define-object.test.js`, `tests/named.test.js`, `tests/collection.test.js`                                                                                         |
| Enforce                               | `tests/enforce-pillar.test.js`, `tests/assert-errors.test.js`, `tests/validate.test.js`                                                                                  |
| Transform                             | `tests/transform-pillar.test.js`                                                                                                                                         |
| Project                               | `tests/describe-model.test.js`, `tests/json-schema.test.js`, `tests/typescript-projection.test.js`, `tests/openapi-projection.test.js`, `tests/forms-projection.test.js` |
| HTTP / AI / Testing / Lifecycle / CLI | `tests/http-contract.test.js`, `tests/testing-helpers.test.js`, `tests/contract-diff.test.js`, `tests/cli.test.js`                                                       |

## Benchmark story

Benchmarks are intentionally simple and local. They are not a scientific claim, but they are credible smoke coverage for v1 readiness.

Current benchmark scripts:

```bash
bun run bench/validate-user.js
bun run bench/validate-array.js
bun run bench/validate-nested.js
```

They compare:

- handwritten manual validation
- compiled `sigil.validator`
- public `sigil.check()`

Scenarios:

- flat user object
- array of objects
- nested order object

v1 benchmark goal:

- keep `.check()` and `.validator` near the handwritten baseline for common runtime validation cases
- keep benchmarks repeatable and easy to run locally
- avoid overclaiming against other libraries until benchmark methodology is formalized

## Package roadmap

No package split before stable core APIs.

Future ecosystem packages and reasons are documented in [Package Split Policy](package-split.md).

## v1 positioning

Use this language consistently:

```txt
SigilJS is an executable data contract system for JavaScript.

Define structure once. Project it everywhere.
```

Avoid positioning SigilJS as only a validator. Runtime validation is one capability of the broader contract system.
