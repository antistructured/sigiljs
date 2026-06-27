# Legacy Alias Policy

**Block:** Stable Core Hardening  
**Package:** `@weipertda/sigiljs` v0.14.0  
**Pass:** 5 — Legacy Alias Policy

---

## Decision

Keep exported aliases as **legacy supported** compatibility aliases.

They are not primary stable-core documentation targets and should not be used in new README, quickstart, recipe, or TypeScript examples.

No aliases are removed in this block.

---

## Alias Decisions

| Alias | Runtime target | Classification | Policy |
|-------|----------------|----------------|--------|
| `S` | `Sigil` | legacy supported | keep exported; keep typed as deprecated alias |
| `T` | `Sigil` | legacy supported | keep exported; keep typed as deprecated alias |
| `real` | `realType` | legacy supported | keep exported; keep typed as deprecated alias |
| `Real` | `realType` | legacy supported | keep exported; keep typed as deprecated alias |

---

## Public Documentation Policy

Primary docs should focus on:

- `sigil()`
- `sigil.exact()`
- `optional()`
- `union()`
- `oneOf()`
- `pipe()`
- `trim()`
- `realType()`

Aliases may appear in API reference or stability docs as legacy aliases, but should not appear in new user-facing examples.

---

## Type Declaration Policy

`index.d.ts` should continue declaring aliases because they are runtime exports.

Alias declarations should remain marked `@deprecated`:

- `S`
- `T`
- `real`
- `Real`

This allows TypeScript users to see the compatibility path while being nudged toward primary APIs.

---

## Tests

Focused tests live in:

```txt
tests/stable-core-legacy-aliases.test.js
```

They verify:

- `S === Sigil`
- `T === Sigil`
- `real === realType`
- `Real === realType`
- legacy aliases still work at runtime

Current focused test status:

```txt
2 pass, 0 fail
```

---

## 1.0 Recommendation

Keep aliases as legacy supported through 1.0 unless a deliberate pre-1.0 breaking cleanup decides otherwise.

Do not silently treat aliases as primary stable APIs.

