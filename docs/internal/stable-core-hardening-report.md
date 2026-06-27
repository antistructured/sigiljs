# Stable Core Hardening Report

**Block:** Stable Core Hardening  
**Package:** `@weipertda/sigiljs` v0.14.0  
**Release theme:** Stable core hardening

---

## 1. Current Package Name

```txt
@weipertda/sigiljs
```

The package remains a single package. No `@sigil/*` extraction occurred.

---

## 2. Current Version

```txt
0.14.0
```

This block uses `0.14.0` as the stable-core hardening target.

---

## 3. Stable Core APIs Hardened

Stable-core candidates hardened in this block:

- `sigil()`
- `sigil.exact()`
- `Sigil`
- `optional()`
- `union()`
- `oneOf()`
- `pipe()`
- `trim()`
- `realType()`
- `SigilValidationError`
- `parse()`
- `assert()`
- `safeParse()`
- `transform()`
- `serialize()`
- `describe()`
- `toJSONSchema()`
- `toTypeScript()`
- `toOpenAPI()`
- `mock()`
- `cases()`
- `test()`

Legacy aliases were classified but not promoted as primary APIs.

---

## 4. Validation Error Shape Status

Frozen stable runtime shape:

```js
{
  name: 'SigilValidationError',
  code: 'SIGIL_VALIDATION_FAILED',
  message: string,
  path: Array<string | number>,
  expected: string,
  actual: unknown
}
```

`toJSON()` returns:

```js
{
  code: 'SIGIL_VALIDATION_FAILED',
  message: string,
  path: Array<string | number>,
  expected: string,
  actual: unknown
}
```

Focused tests:

```txt
tests/stable-core-error-shape.test.js
```

Status: hardened and aligned with `index.d.ts`.

---

## 5. safeParse Result Shape Status

Frozen stable shape:

```ts
type SigilParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: unknown };
```

Runtime guarantees:

- success branch has `data`, not `error`
- failure branch has `error`, not `data`
- ordinary validation failures do not throw
- stable-core validation failures preserve `SigilValidationError`

Focused tests:

```txt
tests/stable-core-safeparse-shape.test.js
```

Status: hardened and aligned with `index.d.ts`.

---

## 6. sigil vs Sigil Policy

Decision: Option A.

```txt
sigil() is the primary stable API.
Sigil template API remains a stable advanced API.
```

Policy:

- use `sigil()` and `sigil.exact()` in new docs and examples
- keep `Sigil` stable for template-literal, named, and collection workflows
- do not mark `Sigil` deprecated
- do not promote legacy aliases as primary API

Internal policy doc:

```txt
docs/internal/sigil-vs-sigil-policy.md
```

---

## 7. Legacy Alias Policy

Classifications:

| Alias | Target | Policy |
|-------|--------|--------|
| `S` | `Sigil` | legacy supported, deprecated in types |
| `T` | `Sigil` | legacy supported, deprecated in types |
| `real` | `realType` | legacy supported, deprecated in types |
| `Real` | `realType` | legacy supported, deprecated in types |

Focused tests:

```txt
tests/stable-core-legacy-aliases.test.js
```

No aliases were removed.

---

## 8. transform / serialize Status

Frozen semantics:

- `parse()` validates input, applies field and contract transforms, revalidates output, and returns transformed output
- `safeParse()` delegates to `parse()` and returns transformed output on success
- `serialize()` validates only and does **not** apply transforms
- `transform(fn)` returns a derived contract with an appended transform step

Focused tests:

```txt
tests/stable-core-transform-serialize.test.js
```

Status: hardened.

---

## 9. Projection Output Contract Status

Stable projection output contracts were documented and tested for:

- `describe()`
- `toJSONSchema()`
- `toTypeScript()`
- `toOpenAPI()`

Key guarantees:

- deterministic description objects
- deterministic JSON Schema subset output
- deterministic TypeScript declaration strings
- OpenAPI schema-level cloned output
- metadata projection behavior
- structured unsupported-kind projection errors

Experimental projection:

- `toFormConstraints()` remains experimental

Focused tests:

```txt
tests/stable-core-projection-contracts.test.js
```

Status: stable projections hardened; form constraints intentionally excluded from stable core.

---

## 10. Prove Output Contract Status

Stable Prove output contracts were documented and tested for:

- `mock()`
- `cases()`
- `test()`

Frozen shapes:

```js
cases() -> { valid, invalid }
```

```js
test() -> {
  success,
  valid: { passed, failed },
  invalid: { passed, failed },
  failures
}
```

Required limitation preserved:

```txt
mock() values are structurally valid but not semantically meaningful.
```

Focused tests:

```txt
tests/stable-core-prove-contracts.test.js
```

Status: hardened.

---

## 11. Type Declaration Alignment

`index.d.ts` was aligned with hardened stable-core semantics:

- `SigilValidationError` shape now matches runtime
- `safeParse()` result shape already matched runtime
- `Sigil` is stable advanced, not deprecated
- aliases remain declared and deprecated
- transform/serialize comments match runtime behavior
- projection/Prove types remain conservative and compatible

Type smoke test added:

```txt
tests/typescript-declarations/stable-core-shapes.ts
```

Type check status during Pass 9:

```txt
bun run check:types — pass
```

---

## 12. Experimental Surfaces Intentionally Excluded

The following remain experimental and were not expanded:

- `httpContract()`
- `toFormConstraints()`
- `sigil` CLI workflows
- `.sigil` text-file workflow
- `.sigil.js` CLI module workflow

No new HTTP features, form features, CLI commands, database helpers, AI helpers, package splits, or runtime dependencies were added.

---

## 13. Test / Type / Pack Status

Focused pass-level verification completed:

- error shape tests: pass
- safeParse shape tests: pass
- legacy alias tests: pass
- transform/serialize tests: pass
- projection contract tests: pass
- Prove contract tests: pass
- TypeScript declaration check: pass

Final full verification is performed in Pass 12:

- `bun run lint`
- `bun test`
- `bun run check:types`
- `npm pack --dry-run`

---

## 14. Remaining Blockers

Remaining before a future `1.0.0`:

1. Run a Stable Core Regression Matrix across representative contract kinds and boundary workflows.
2. Decide whether `compile()` is stable core or advanced/low-level public API.
3. Gather real-world usage for CLI workflows before freezing command/output/exit contracts.
4. Gather real-world usage for `httpContract()` before stabilization.
5. Gather real-world usage for `toFormConstraints()` before stabilization.
6. Keep package extraction deferred until core 1.0 and real usage justify it.

---

## 15. Recommendation

Stable core semantics are significantly hardened, but do not cut 1.0 yet.

Proceed next to:

```txt
Stable Core Regression Matrix
```

Rationale: this block resolved the highest-priority shape and semantics blockers, but a matrix pass should confirm the hardened contracts across primitive, object, exact, optional, union, literal, nested, transform, projection, and Prove combinations before a real-world usage trial.

Continue to keep CLI, HTTP helpers, and form constraints experimental.

Do not extract `@sigil/*` packages yet.
