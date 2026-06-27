# Pre-1.0 Type Declaration Consistency Audit

**Package:** `@weipertda/sigiljs` v0.12.0  
**Pass:** 4 — Type Declaration Consistency Audit

---

## Scope

Audited `index.d.ts` against runtime exports, public docs, experimental docs, package metadata, and TypeScript smoke tests.

Files inspected:

- `index.d.ts`
- `src/index.js`
- `src/sigil.js`
- `src/http.js`
- `docs/api.md`
- `docs/stability.md`
- `docs/experimental.md`
- `docs/internal/type-declaration-readiness-report.md`
- `tests/typescript-declarations/`
- `package.json`

Verification run:

```txt
bun run check:types
```

Result: pass.

---

## Runtime Export Coverage

Runtime exports from `src/index.js`:

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

All runtime exports are declared in `index.d.ts`.

No nonexistent public exports were found in `index.d.ts`.

---

## Declaration Stability Coverage

| Declaration | Runtime match | Stability marking | Notes |
|-------------|---------------|-------------------|-------|
| `sigil` | yes | stable candidate | generic defaults to `unknown` |
| `sigil.exact` | yes | stable candidate | only object API attached helper |
| `Sigil` | yes | documented deprecated/preferred-alternative in types | runtime remains supported |
| `S` / `T` | yes | `@deprecated` | aliases of `Sigil` |
| `optional` | yes | stable candidate | helper returns opaque definition marker |
| `union` | yes | stable candidate | returns opaque definition marker |
| `oneOf` | yes | stable candidate | literal helper |
| `pipe` | yes | stable candidate | field-level transform helper |
| `trim` | yes | stable candidate | field-level trim transform |
| `realType` | yes | stable candidate | runtime type detector |
| `real` / `Real` | yes | `@deprecated` | aliases of `realType` |
| `SigilValidationError` | yes | stable candidate | error shape should be frozen before 1.0 |
| `httpContract` | yes | `@experimental` | must remain experimental before real-world usage |

---

## Contract Method Coverage

`SigilContract<T>` declares stable candidate methods:

- `check`
- `assert`
- `parse`
- `safeParse`
- `transform`
- `serialize`
- `withMetadata`
- `describe`
- `toJSONSchema`
- `toTypeScript`
- `toOpenAPI`
- `mock`
- `cases`
- `test`
- `diff`
- `compile`
- `version`

`toFormConstraints()` is declared and marked `@experimental`.

Runtime-only internal properties intentionally omitted from the interface:

- `ast`
- `raw`
- `source`
- `normalized`
- `options`
- `validator`

---

## Fixes Made

Small declaration consistency fix:

- Updated the `serialize()` declaration comment from “applies registered transforms” to “does not apply registered transforms,” matching runtime behavior and settled docs.

No type-level behavior changes were made.

---

## Package Metadata

`package.json` declaration metadata is correct:

```json
{
  "types": "./index.d.ts",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "default": "./src/index.js"
    }
  }
}
```

`index.d.ts` is included in the package `files` array.

---

## Type Smoke Coverage

Consumer-style TypeScript smoke tests cover:

- core usage
- projections
- Prove helpers
- experimental HTTP helper declarations

Current status:

```txt
$ tsc --noEmit -p tests/typescript-declarations/tsconfig.json
```

Exit code: `0`.

---

## Findings

- Declarations match the runtime export list.
- Experimental declarations are clearly marked.
- Conservative inference is documented.
- TypeScript declarations should be treated as public support, not as a promise of deep static contract inference.
- Legacy aliases are typed as deprecated; public docs should align with that deprecation posture before 1.0.

---

## 1.0 Recommendations

- Keep declaration coverage aligned with the runtime export list.
- Do not add deep inference before 1.0 unless it is low-risk and covered by consumer-style tests.
- Keep `httpContract` and `toFormConstraints()` marked `@experimental`.
- Decide whether `Sigil`, `S`, `T`, `real`, and `Real` deprecation language in public docs should match the declaration comments.
