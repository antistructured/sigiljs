# Type Declaration Strategy — @weipertda/sigiljs

> **Status:** Decision recorded — implementation pending
> **Relates to:** `type-surface-audit.md`

---

## Decision

**Option A: Handwritten root `index.d.ts`**

A single, manually authored TypeScript declaration file placed at the package root (`index.d.ts`). The package `types` field in `package.json` will be set to point at it.

---

## Rationale

| Factor | Analysis |
|--------|----------|
| Source language | Pure JavaScript (ESM). No TypeScript source to infer from. |
| API surface size | Small and stable (~10 exports, ~20 methods). Handwriting is tractable. |
| Build step | Zero — no compiler, no transform pipeline, no `tsc`. A hand-authored `.d.ts` requires no build at all. |
| Alternatives considered | `tsc --allowJs --declaration --emitDeclarationOnly` produces weak types for a dynamic API like this; `tsup` or `rollup-plugin-dts` adds unnecessary toolchain complexity. Neither fits the zero-dependency, Bun-first philosophy. |
| Generics depth | `sigil()` infers types from plain object definitions at runtime. Replicating that inference statically requires complex conditional/mapped types. Conservative `unknown`-based types are correct and honest for v0.10.x. |

---

## File Layout

```
@weipertda/sigiljs/
├── index.d.ts          ← NEW: handwritten type declarations
├── src/
│   └── index.js        ← unchanged (source of truth stays JS)
├── package.json
└── ...
```

No changes to `src/`. The `.js` files remain the canonical implementation. `index.d.ts` is a parallel description, not a generated artifact.

---

## `package.json` Declaration Metadata

The package points to the declaration file with both top-level `"types"` metadata and an `"exports"["."]["types"]` condition:

```json
{
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "default": "./src/index.js"
    }
  },
  "types": "./index.d.ts"
}
```

> Both the top-level `"types"` field (for legacy TypeScript resolution) and the `"exports"["."]["types"]` condition (for `moduleResolution: bundler` / `node16`) should be set for maximum compatibility.

---

## Known Limitations

| Limitation | Impact | Future path |
|------------|--------|-------------|
| `sigil({ ... })` defaults to `SigilContract<unknown>` unless a generic is supplied | No automatic per-field inference from definition objects | Deferred; requires conditional/mapped type machinery |
| `parse()` / `safeParse()` return the caller-supplied generic `T`, defaulting to `unknown` | Users should write `sigil<User>(...)` for typed output | Same as above — deferred |
| `mock()` returns the caller-supplied generic `T`, defaulting to `unknown` | No static shape without generics | Deferred |
| `transform(fn)` keeps the same contract type | Transform output is validated against the same contract shape | Intentional conservative typing |
| Internal accessors are omitted | No types for `ast`, `raw`, `source`, etc. | Intentional — internal surface |

These are **honest conservative types**, not errors. A `SigilContract<unknown>` that returns `unknown` from `parse()` is correct by default; callers can opt into typed consumption with an explicit generic. Fabricating automatic inference that does not match the runtime definition model would be misleading.

---

## Source Language — No Conversion

The `src/` directory **remains JavaScript**. There is no plan to convert to TypeScript.

Benefits retained:
- Zero compile step for contributors
- Bun can run `.js` files directly without `ts-node` or `bun --loader`
- No `tsconfig.json` drift
- Existing zero-dependency constraint is preserved at the source level

TypeScript users get ambient types from `index.d.ts` without the package itself depending on the TypeScript compiler at runtime or build time.

---

## No Package Split

The package will **not** be split into:
- `@weipertda/sigiljs` (runtime, no types)
- `@types/sigiljs` (DefinitelyTyped or separate package)

Reasons:
- The public API is small enough that bundled types are conventional and expected
- A `@types/` package requires a separate publish workflow and version sync
- Bundled types are the modern Node/npm recommendation for first-party packages
- `index.d.ts` at the root with a `types` field is the simplest, most discoverable approach

---

## Implementation Checklist

- [x] Write `index.d.ts` at package root
- [x] Update `package.json`: add `"types": "./index.d.ts"` and update `"exports"` with `"types"` condition
- [x] Add `index.d.ts` to the `"files"` array in `package.json`
- [x] Smoke-test with `tsc --noEmit` against TypeScript consumer files
- [ ] Document in release notes under next release

---

## References

- Audit: [`docs/internal/type-surface-audit.md`](./type-surface-audit.md)
- CLI decision: [`docs/internal/type-cli-decision.md`](./type-cli-decision.md)
- TypeScript handbook: [Declaration Files — Publishing](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)
