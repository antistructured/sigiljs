# Stable Core Error Shape

**Block:** Stable Core Hardening  
**Package:** `@weipertda/sigiljs` v0.14.0  
**Pass:** 2 — Validation Error Shape Hardening

---

## Decision

Freeze the current `SigilValidationError` shape as the stable-core validation error shape.

Stable validation failures from `parse()` and `assert()` throw `SigilValidationError` instances.

---

## Current Error Class / Name

```txt
class SigilValidationError extends Error
name: "SigilValidationError"
```

Stable class guarantees:

- `error instanceof SigilValidationError`
- `error.name === 'SigilValidationError'`
- `error.code === 'SIGIL_VALIDATION_FAILED'`
- `error.message` is a human-readable string
- `error.toJSON()` returns the canonical structured shape

---

## Stable Fields

Canonical shape:

```js
{
  code: 'SIGIL_VALIDATION_FAILED',
  message: string,
  path: Array<string | number>,
  expected: string,
  actual: string | number | boolean | null | undefined
}
```

Notes:

- The current runtime field is `actual`, not `received`.
- `details` is not part of the current stable error shape.
- `path` is always an array. Root failures use `[]`.
- `toJSON()` returns `{ code, message, path, expected, actual }`.

---

## Path Semantics

`path` points to the most specific known failing location.

Examples:

| Failure | Path |
|---------|------|
| root primitive mismatch | `[]` |
| object property mismatch | `['name']` |
| nested object mismatch | `['profile', 'email']` |
| exact-object extra key | `['extraKey']` |

Array index paths are represented as numbers when available through the validator path walker.

---

## Expected / Actual Semantics

`expected` is a stable human-readable expectation string.

Examples:

- primitive mismatch: `expected: 'number'`
- literal union: `expected: '"admin" | "user"'`
- exact-object extra key: `expected: 'never'`

`actual` is either a runtime type string or, for literal-style failures, the invalid literal value when that is the current most useful signal.

Examples:

- primitive mismatch: `actual: 'string'`
- literal mismatch: `actual: 'guest'`
- exact-object extra boolean key: `actual: 'boolean'`

---

## Known Limitations

- Error messages are human-readable and useful, but exact text should be treated as less stable than field names and field presence.
- `expected` and `actual` are intentionally compact strings/values, not rich issue trees.
- The stable shape does not include `received` or `details`.
- Parser/tokenizer errors are not ordinary validation failures and may still throw plain `Error` objects before a contract exists.

---

## Tests

Focused tests live in:

```txt
tests/stable-core-error-shape.test.js
```

They cover:

- `parse()` thrown shape
- `assert()` thrown shape
- `toJSON()` canonical shape
- nested path behavior
- literal union useful info
- exact-object extra-key path behavior

Current focused test status:

```txt
6 pass, 0 fail
```

---

## 1.0 Recommendation

Treat `{ code, message, path, expected, actual }` as the stable 1.0 validation error shape.

Do not rename `actual` to `received` before 1.0 unless intentionally making a breaking pre-1.0 cleanup. Prefer preserving compatibility.

