# Pre-1.0 Public Export Freeze Audit

**Package:** `@weipertda/sigiljs` v0.12.0  
**Pass:** 1 — Public Export Freeze Audit

---

## Scope

Audited the package entrypoint and public export documentation before a future 1.0 freeze.

Files inspected:

- `src/index.js`
- `src/sigil.js`
- `src/http.js`
- `src/core/realType.js`
- `src/core/errors.js`
- `index.d.ts`
- `docs/api.md`
- `docs/stability.md`
- `docs/experimental.md`
- `README.md`
- `tests/public-api.test.js`
- `tests/public-api-surface.test.js`
- `package.json`

Live export audit:

```txt
Real
S
Sigil
SigilValidationError
T
httpContract
oneOf
optional
pipe
real
realType
sigil
trim
union
```

---

## Export Classification

| Export | Source | Runtime exported | Type declared | Docs status | Test status | Freeze classification | 1.0 recommendation |
|--------|--------|------------------|---------------|-------------|-------------|-----------------------|--------------------|
| `sigil` | `src/sigil.js` via `src/index.js` | yes | yes | stable/preferred | public API tests | stable candidate | make primary 1.0 object API |
| `sigil.exact` | property on `sigil` | yes | yes | stable/preferred | public API tests | stable candidate | keep as primary strict object API |
| `Sigil` | `src/sigil.js` via `src/index.js` | yes | yes | stable but not preferred | public API tests | stable candidate with policy decision | keep supported; document `sigil()` as preferred |
| `S` | alias of `Sigil` | yes | yes, deprecated | docs mention legacy | alias tests | legacy candidate | deprecate or keep legacy-only before 1.0 |
| `T` | alias of `Sigil` | yes | yes, deprecated | docs mention legacy | alias tests | legacy candidate | deprecate or keep legacy-only before 1.0 |
| `optional` | `src/sigil.js` via `src/index.js` | yes | yes | stable | public API tests | stable candidate | keep |
| `union` | `src/sigil.js` via `src/index.js` | yes | yes | stable | public API tests | stable candidate | keep |
| `oneOf` | `src/sigil.js` via `src/index.js` | yes | yes | stable | public API tests | stable candidate | keep |
| `pipe` | `src/sigil.js` via `src/index.js` | yes | yes | stable | public API surface tests | stable candidate | keep; verify transform docs before 1.0 |
| `trim` | `src/sigil.js` via `src/index.js` | yes | yes | stable | public API surface tests | stable candidate | keep |
| `httpContract` | `src/http.js` via `src/index.js` | yes | yes, `@experimental` | experimental | public + HTTP tests | experimental | keep experimental; do not stabilize before real usage |
| `realType` | `src/core/realType.js` via `src/index.js` | yes | yes | stable | public API tests | stable candidate | keep |
| `real` | alias of `realType` | yes | yes, deprecated | not consistently documented | no direct alias test | legacy candidate | deprecate or document legacy-only before 1.0 |
| `Real` | alias of `realType` | yes | yes, deprecated | not consistently documented | no direct alias test | legacy candidate | deprecate or document legacy-only before 1.0 |
| `SigilValidationError` | `src/core/errors.js` via `src/index.js` | yes | yes | stable | public API tests | stable candidate | keep; freeze error shape before 1.0 |

---

## Internal APIs Not Exported

Public surface tests explicitly verify these are not exported:

- parser internals: `tokenize`, `normalize`, `validate`, `parse`
- projection internals: `projectJSONSchema`, `projectTypeScript`, `projectOpenAPI`, `projectFormConstraints`, `projectMock`, `projectCases`
- registry/cache internals: `register`, `resolve`, `clear`, `validatorCache`, `getAstRegistry`
- projection error helpers: `projectionError`, `unsupportedProjectionKind`

These should remain internal.

---

## Findings

- The runtime export list is small and auditable.
- `index.d.ts` covers all runtime exports.
- `httpContract` is the only exported experimental named API.
- `S`, `T`, `real`, and `Real` are legacy aliases and should not be highlighted in new docs.
- `Sigil` remains supported but the preferred modern API is `sigil()` / `sigil.exact()`.

---

## 1.0 Recommendations

Stable core candidates:

- `sigil`
- `sigil.exact`
- `optional`
- `union`
- `oneOf`
- `pipe`
- `trim`
- `realType`
- `SigilValidationError`

Supported but needs policy wording:

- `Sigil` template-literal API

Legacy/deprecation candidates:

- `S`
- `T`
- `real`
- `Real`

Experimental:

- `httpContract`

Blockers before 1.0:

- Decide whether legacy aliases remain indefinitely, become deprecated, or are removed before 1.0.
- Freeze `SigilValidationError` object shape.
- Keep `httpContract` experimental unless real-world adapter usage justifies stabilization.
