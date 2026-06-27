# Type Declaration Readiness Report

**Block:** TypeScript Declaration Readiness  
**Package:** `@weipertda/sigiljs` v0.12.0  
**Release theme:** TypeScript declaration support

---

## 1. Current package name

`@weipertda/sigiljs` — unchanged.

No package split occurred. No `@sigil/types`, `@sigil/ts`, `@sigil/core`, or `@types/*` package was created.

---

## 2. Declaration strategy

**Chosen strategy:** Option A — handwritten root `index.d.ts`.

Reasoning:

- SigilJS source remains plain JavaScript.
- The public API surface is small enough for a handwritten declaration file.
- No TypeScript source conversion is required.
- No runtime dependency is required.
- No publish-time declaration generation pipeline is required.

Rejected options:

- Generated declarations from JSDoc — too weak for dynamic contract APIs.
- TypeScript source/build pipeline — incompatible with this block's JS-first constraint.

---

## 3. Declaration files

Created:

- `index.d.ts`

The declaration file covers:

- core exports: `sigil`, `Sigil`, `S`, `T`, `optional`, `union`, `oneOf`, `pipe`, `trim`, `realType`, `real`, `Real`, `SigilValidationError`
- `SigilContract<T>` instance methods
- parse/safeParse result types
- projection return types
- Prove pillar return and option types
- experimental `httpContract()` types

---

## 4. Package metadata

Updated `package.json`:

- added top-level `"types": "./index.d.ts"`
- updated `"exports"["."]` to include `"types": "./index.d.ts"`
- added `index.d.ts` to `"files"`
- added `check:types` script
- bumped package version to `0.12.0`

---

## 5. Stable API coverage

Stable public APIs declared:

- `sigil<T>()`
- `sigil.exact<T>()`
- `Sigil` template-literal factory
- `Sigil.exact`, `Sigil.meta`, `Sigil.named`, `Sigil.define`, `Sigil.collection`
- `optional()`
- `union()`
- `oneOf()`
- `pipe()`
- `trim()`
- `realType()` and aliases
- `SigilValidationError`

Stable contract methods declared:

- `check()`
- `assert()`
- `parse()`
- `safeParse()`
- `transform()`
- `serialize()`
- `withMetadata()`
- `version()`
- `describe()`
- `toJSONSchema()`
- `toTypeScript()`
- `toOpenAPI()`
- `mock()`
- `cases()`
- `test()`
- `diff()`
- `compile()`

Internal accessors such as `ast`, `raw`, `source`, `normalized`, `validator`, and `options` were intentionally not promoted in the declaration interface.

---

## 6. Experimental API coverage

Experimental public APIs declared and marked with `@experimental` comments:

- `httpContract()`
- `HttpContractOptions`
- `HttpContract`
- `contract.toFormConstraints()`
- `FormConstraints`
- `FormFieldConstraint`

CLI type decision:

- The `sigil` bin does not require TypeScript declarations.
- It remains a terminal workflow surface, not a programmatic API.
- CLI remains experimental.

---

## 7. Type inference limitations

Declarations are intentionally conservative.

Known limitations:

- `sigil({ ... })` defaults to `SigilContract<unknown>` unless callers provide a generic.
- The declaration file does not infer precise object shapes from every contract definition.
- Runtime validation remains authoritative.
- `SigilDescription`, JSON Schema, and OpenAPI shapes are open records rather than fully modeled schemas.
- `safeParse()` failure uses `error: unknown` because non-core helpers such as `httpContract.safeParseRequest()` may return plain `Error` objects.

Recommended TypeScript usage:

```ts
const User = sigil<User>({ name: String })
const trusted = User.parse(input)
```

---

## 8. Type smoke verification

Created consumer-style TypeScript smoke files:

- `tests/typescript-declarations/basic-usage.ts`
- `tests/typescript-declarations/projections.ts`
- `tests/typescript-declarations/prove.ts`
- `tests/typescript-declarations/experimental-http.ts`
- `tests/typescript-declarations/tsconfig.json`

Added script:

```bash
bun run check:types
```

Verification result:

```txt
$ tsc --noEmit -p tests/typescript-declarations/tsconfig.json
```

Exit code: `0`.

---

## 9. Pack verification

`npm pack --dry-run` includes the declaration file:

```txt
npm notice 13.0kB index.d.ts
npm notice name: @weipertda/sigiljs
npm notice version: 0.12.0
npm notice filename: weipertda-sigiljs-0.12.0.tgz
npm notice total files: 284
```

---

## 10. Runtime dependency status

Runtime dependencies remain zero:

```txt
dependencies {}
```

A dev-only `typescript` dependency was added for declaration smoke tests. This does not affect runtime dependencies or package consumers.

---

## 11. Remaining blockers

Resolved by this block:

- TypeScript consumers no longer receive missing declaration errors.

Remaining non-TypeScript blockers:

- CLI is experimental and has no confirmed real-world usage.
- `mock()` values are structurally valid but not semantically meaningful.
- HTTP helpers and form constraints remain experimental.
- Conservative type inference may be improved after real TypeScript usage.

---

## 12. Recommendation

TypeScript declarations are ready for public package consumption.

Recommended next steps:

- Stay single package.
- Do not convert source to TypeScript.
- Continue improving inference only after real-world TypeScript usage shows what is needed.
- Proceed next to a Pre-1.0 API Freeze Audit.
