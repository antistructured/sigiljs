# Pre-1.0 Contract Method Freeze Audit

**Package:** `@weipertda/sigiljs` v0.12.0  
**Pass:** 2 — Contract Instance Method Freeze Audit

---

## Scope

Audited public methods on contract objects returned by `sigil()`, `sigil.exact()`, and `Sigil` template factories.

Files inspected:

- `src/sigil.js`
- `src/projections/`
- `src/testing/`
- `index.d.ts`
- `docs/api.md`
- `docs/stability.md`
- `README.md`
- `tests/public-api.test.js`
- `tests/public-api-surface.test.js`
- `tests/testing-helpers.test.js`
- `examples/`

Live contract object audit found these own public-looking keys:

```txt
assert
ast
cases
check
compile
describe
diff
kind
mock
name
normalized
options
parse
raw
safeParse
serialize
source
test
toFormConstraints
toJSONSchema
toOpenAPI
toTypeScript
transform
validator
version
withMetadata
```

Internal data properties (`ast`, `raw`, `source`, `normalized`, `options`, `validator`) exist on runtime objects but should not be treated as stable public API.

---

## Method Classification

| Method | Pillar | Current status | Runtime behavior documented | Type declared | Test coverage | 1.0 recommendation | Blockers before stabilization |
|--------|--------|----------------|-----------------------------|---------------|---------------|--------------------|-------------------------------|
| `check(value)` | Enforce | stable | yes | yes | yes | stable core | none |
| `assert(value)` | Enforce | stable | yes | yes | yes | stable core | freeze thrown error shape |
| `parse(value)` | Enforce | stable | yes | yes | yes | stable core | freeze transform/error semantics |
| `safeParse(value)` | Enforce | stable | yes | yes | yes | stable core | freeze success/failure result shape |
| `transform(fn)` | Transform | stable candidate | partially | yes | yes | stable with clarified semantics | document that output is validated against same contract shape |
| `serialize(value)` | Transform/Boundary | stable candidate | yes, but historically confused | yes | yes | stable only after explicit behavior lock | preserve no-transform behavior or rename before 1.0 if policy changes |
| `withMetadata(meta)` | Metadata | stable candidate | yes | yes | yes | stable core | freeze metadata fields (`name`, `version`, `description`, `tags`) |
| `version(v)` | Metadata | stable candidate | yes | yes | yes | stable core | clarify it is metadata shorthand |
| `describe()` | Project/Describe | stable | yes | yes | yes | stable core | freeze description object shape enough for projections |
| `toJSONSchema()` | Project | stable | yes | yes | yes | stable core | document supported JSON Schema subset |
| `toTypeScript(name?)` | Project | stable | yes | yes | yes | stable core | document generated type limits |
| `toOpenAPI()` | Project | stable | yes | yes | yes | stable core | document OpenAPI schema subset |
| `toFormConstraints()` | Project/Forms | experimental | yes | yes, `@experimental` | yes | keep experimental | needs real form/UI usage and output-shape confidence |
| `mock(options?)` | Prove | stable candidate | yes | yes | yes | stable structural proof helper | semantic realism remains limited |
| `cases(options?)` | Prove | stable candidate | yes | yes | yes | stable structural proof helper | freeze `{ valid, invalid }` shape |
| `test(cases?)` | Prove | stable candidate | yes | yes | yes | stable structural proof helper | freeze summary object shape |
| `diff(other)` | Lifecycle/Prove | stable candidate | yes | yes | yes | stable core after direction docs | direction semantics must stay documented |
| `compile()` | Performance | stable candidate | yes | yes | public surface tests | stable core or advanced stable | clarify validator return shape and caching expectations |

---

## Internal Runtime Properties

These exist on contract objects but should remain internal implementation details, not documented stable API:

- `ast`
- `raw`
- `source`
- `normalized`
- `options`
- `validator`

They are intentionally absent from `SigilContract<T>` in `index.d.ts`.

---

## Findings

- Enforcement methods are ready as stable core candidates.
- Projection methods are mostly stable, with `toFormConstraints()` remaining experimental.
- Prove methods are useful stable candidates, but their output shapes should be frozen before 1.0.
- `transform()` and `serialize()` need exact public semantics in docs because previous blocks settled that `serialize()` does not apply transforms.
- `mock()` is structurally valid but not semantically meaningful; this limitation should remain documented.

---

## 1.0 Recommendations

Stable core candidates:

- `check`
- `assert`
- `parse`
- `safeParse`
- `describe`
- `toJSONSchema`
- `toTypeScript`
- `toOpenAPI`
- `mock`
- `cases`
- `test`
- `diff`
- `compile`
- `withMetadata`
- `version`

Stable after explicit behavior lock:

- `transform`
- `serialize`

Experimental:

- `toFormConstraints`

Internal-only:

- `ast`
- `raw`
- `source`
- `normalized`
- `options`
- `validator`

Blockers before 1.0:

- Freeze `safeParse()` result shape.
- Freeze `SigilValidationError` JSON/error fields.
- Freeze `cases()` and `test()` result shapes.
- Decide whether `compile()` is a stable user-facing method or an advanced public escape hatch.
- Keep `toFormConstraints()` experimental until real usage proves the shape.
