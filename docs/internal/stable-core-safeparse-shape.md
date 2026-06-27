# Stable Core safeParse Result Shape

**Block:** Stable Core Hardening  
**Package:** `@weipertda/sigiljs` v0.14.0  
**Pass:** 3 — safeParse Result Shape Hardening

---

## Decision

Freeze the current `safeParse()` result shape as the stable-core non-throwing parse API.

Stable result type:

```ts
type SigilParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: unknown }
```

---

## Success Result Shape

For valid input:

```js
{
  success: true,
  data: validatedValue
}
```

Stable guarantees:

- `success === true`
- `data` exists
- `error` does not exist on the success result
- for untransformed contracts, `data` is the validated input value
- for transformed contracts, `data` is the transformed value from `parse()`

---

## Failure Result Shape

For ordinary validation failure:

```js
{
  success: false,
  error
}
```

Stable guarantees:

- `success === false`
- `error` exists
- `data` does not exist on the failure result
- stable-core validation failures preserve the structured `SigilValidationError`

---

## Throwing Behavior

`safeParse()` does not throw for ordinary validation failures. It catches errors from `parse()` and returns them in the failure branch.

Relationship to other methods:

| Method | Invalid input behavior |
|--------|------------------------|
| `parse(value)` | throws `SigilValidationError` |
| `assert(value)` | throws `SigilValidationError` |
| `safeParse(value)` | returns `{ success: false, error }` |
| `check(value)` | returns `false` |

---

## TypeScript Declaration Alignment

`index.d.ts` already declares:

```ts
export type SigilParseResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: unknown };
```

This matches runtime behavior.

The failure branch remains `error: unknown` because experimental helpers and future integrations may preserve non-`SigilValidationError` errors even though stable-core validation failures use `SigilValidationError`.

---

## Tests

Focused tests live in:

```txt
tests/stable-core-safeparse-shape.test.js
```

They cover:

- success branch shape
- failure branch shape
- no throw on ordinary validation failure
- preservation of structured `SigilValidationError`
- nested invalid data path preservation

Current focused test status:

```txt
5 pass, 0 fail
```

---

## 1.0 Recommendation

Treat `safeParse()` as the stable non-throwing parse API and freeze its two-branch result shape for 1.0.

Do not add extra top-level keys to either branch before 1.0 unless intentionally making a breaking pre-1.0 cleanup.

