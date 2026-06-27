# Pre-1.0 Freeze Report

**Block:** Pre-1.0 API Freeze Audit  
**Package:** `@weipertda/sigiljs` v0.13.0  
**Release theme:** Pre-1.0 API freeze audit

---

## 1. Current Package Name

```txt
@weipertda/sigiljs
```

The package remains a single package. No `@sigil/*` extraction occurred in this block.

---

## 2. Current Version

```txt
0.13.0
```

This version is used for the audit release theme.

---

## 3. Stable Core Candidates

Stable core candidates are the APIs intended to become the future 1.0 surface after final hardening.

### Constructor / definition APIs

- `sigil`
- `sigil.exact`
- `Sigil` template-literal syntax, supported but secondary to `sigil()` in new docs
- `optional`
- `union`
- `oneOf`
- `pipe`
- `trim`
- `realType`
- `SigilValidationError`

### Contract methods

- `check`
- `assert`
- `parse`
- `safeParse`
- `transform`
- `serialize`
- `withMetadata`
- `version`
- `describe`
- `toJSONSchema`
- `toTypeScript`
- `toOpenAPI`
- `mock`
- `cases`
- `test`
- `diff`
- `compile`, pending final wording as stable vs advanced/low-level

### Stable core posture

The stable core should stay small, runtime-first, dependency-free, and centered on executable data contracts.

---

## 4. Experimental APIs

Experimental APIs are available for real-world use, but may change before 1.0.

| API / Surface | Current exposure | Recommendation |
|---------------|------------------|----------------|
| `httpContract()` | root export | keep experimental |
| `contract.toFormConstraints()` | contract method | keep experimental |
| `sigil` CLI bin | package bin | keep exposed as experimental |
| `.sigil` text files | CLI input format | keep experimental |
| `.sigil.js` module files | CLI input format | keep experimental |

Do not stabilize these without real-world usage evidence.

---

## 5. Internal-only Surfaces

The following should remain internal-only:

- parser and tokenizer internals
- validator/compiler implementation details
- registry/cache internals
- projection helper functions under `src/projections/`
- internal test generation helpers
- runtime contract internals: `ast`, `raw`, `source`, `normalized`, `options`, `validator`
- projection-specific error helpers that are not package-root exports

Public access should remain through documented package exports and documented contract instance methods.

---

## 6. Deferred APIs / Packages

No package split should happen before core 1.0.

Deferred boundaries:

- `@sigil/core`
- `@sigil/cli`
- `@sigil/http`
- `@sigil/forms`
- `@sigil/db`
- `@sigil/ai`
- `@sigil/types`

Deferred feature families:

- framework-specific HTTP middleware
- UI form component adapters
- ORM/database adapters
- provider-specific AI SDK helpers
- semantic mock data generation
- deep TypeScript inference from every object-definition shape

---

## 7. Deprecation Candidates

Deprecation candidates before 1.0:

| API | Current role | Recommendation |
|-----|--------------|----------------|
| `S` | alias of `Sigil` | keep legacy-only or formally deprecate before 1.0 |
| `T` | alias of `Sigil` | keep legacy-only or formally deprecate before 1.0 |
| `real` | alias of `realType` | prefer `realType`; keep legacy-only or remove before 1.0 if safe |
| `Real` | alias of `realType` | prefer `realType`; keep legacy-only or remove before 1.0 if safe |

No deprecations or removals were executed in this block.

---

## 8. Required Decisions Before 1.0

Must decide/freeze before 1.0:

1. Stable core export names.
2. `Sigil` vs `sigil` public policy.
3. Legacy alias policy for `S`, `T`, `real`, and `Real`.
4. `SigilValidationError` fields and `toJSON()` shape.
5. `safeParse()` success/failure shape.
6. `parse()` / `transform()` / `serialize()` behavior contract.
7. `mock()`, `cases()`, and `test()` output shapes.
8. Projection output compatibility expectations for JSON Schema, TypeScript, and OpenAPI.
9. Whether `compile()` is stable public API or advanced/low-level API.
10. Whether CLI remains exposed in the core package during 1.0.
11. Whether HTTP helpers and form constraints remain experimental at 1.0.

---

## 9. TypeScript Declaration Status

Status: public declarations are present and usable.

Current declaration support:

- root `index.d.ts`
- top-level `types` metadata in `package.json`
- `exports["."].types`
- declaration file included in package files
- consumer-style smoke tests under `tests/typescript-declarations/`
- `check:types` script

Important limitations:

- declarations are intentionally conservative
- `sigil<T>(...)` supports caller-supplied generics
- no full static inference from every object-definition shape yet
- `httpContract` and `toFormConstraints()` remain marked experimental

---

## 10. CLI Status

Status: exposed and tested, but experimental.

Current bin:

```json
{
  "sigil": "./src/playground.js"
}
```

Current command surface:

- `check`
- `parse`
- `safe-parse`
- `describe`
- `json-schema`
- `types`
- `openapi`
- `form`
- `mock`
- `cases`
- `test`
- `diff`

Stabilization blockers:

- real workflow usage
- command/output compatibility policy
- exit-code compatibility policy
- `.sigil` syntax compatibility policy
- Bun/runtime portability decision

Recommendation: keep CLI exposed as experimental; do not stabilize before real-world usage.

---

## 11. Runtime Dependency Status

Runtime dependencies remain zero.

`package.json` has no `dependencies` field. Existing `devDependencies` are development/test-only.

No runtime dependency was added in this block.

---

## 12. Test / Pack Status

Final verification is performed in Pass 11.

Expected final gates:

- `bun run lint`
- `bun test`
- `bun run check:types`
- `npm pack --dry-run`

Pack requirements:

- package remains `@weipertda/sigiljs`
- version is `0.13.0`
- `index.d.ts` is included
- no package split occurs

---

## 13. Recommendation

Do not cut 1.0 yet.

Continue using 0.x releases while collecting real-world usage on CLI workflows, HTTP helpers, form constraints, and TypeScript declaration ergonomics.

Keep the stable core small.

Do not extract `@sigil/*` packages yet.

The next block should be **Stable Core Hardening**, focused on the highest-priority stable-core decisions found in this audit:

- error object shape stability
- `transform()` / `serialize()` behavior
- projection output contracts
- `Sigil` vs `sigil` policy
- `mock()` / `cases()` / `test()` output stability

---

## Final Freeze Position

SigilJS is in a good pre-1.0 posture, but not yet ready for a `1.0.0` guarantee.

The project should first harden stable-core behavior and keep experimental edges explicitly outside the 1.0 promise.

---

## Addendum — Stable Core Hardening

The follow-up Stable Core Hardening block targeted the highest-priority stable-core blockers identified in this report.

Resolved or substantially hardened:

- `SigilValidationError` shape
- `safeParse()` result shape
- `sigil` vs `Sigil` policy
- legacy alias policy for `S`, `T`, `real`, and `Real`
- `transform()` / `serialize()` semantics
- `describe()`, `toJSONSchema()`, `toTypeScript()`, and `toOpenAPI()` output contracts
- `mock()`, `cases()`, and `test()` output contracts
- TypeScript declaration alignment for hardened stable-core shapes

The recommendation remains: do not cut 1.0 yet. Proceed with a Stable Core Regression Matrix or Real-World Usage Trial while keeping CLI, HTTP helpers, and form constraints experimental.
