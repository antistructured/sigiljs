# Stable Core Ergonomics Trial

**Block:** Real-World Usage Trial  
**Pass:** 3 — Stable Core Ergonomics Trial  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Trial Files

- `trials/stable-core/user-profile.js`
- `trials/stable-core/support-ticket.js`
- `trials/stable-core/README.md`

---

## Commands Run

```bash
bun run trials/stable-core/user-profile.js
bun run trials/stable-core/support-ticket.js
```

Result: **pass**

---

## Stable APIs Exercised

- `sigil.exact()`
- `optional()`
- `union()`
- `oneOf()`
- `realType()`
- `parse()`
- `safeParse()`
- `assert()`
- `check()`
- `describe()`
- `toJSONSchema()`
- `toTypeScript()`
- `toOpenAPI()`
- `mock()`
- `cases()`
- `test()`
- `diff()`

No experimental API was needed.

---

## Ergonomics Findings

### What Felt Good

- `sigil.exact({ ... })` is natural for application models.
- `safeParse()` result handling is readable and matches common boundary-validation patterns.
- Error paths are useful for field-level handling.
- Projection methods are easy to discover from the contract object.
- `mock()` + `cases()` + `test()` create a quick confidence loop without external test fixtures.
- `realType()` is useful as a debugging utility, not just an internal diagnostic.

### Friction

- `diff()` output is useful but not immediately self-explanatory in application logs; consumers likely need docs explaining direction and change entry fields with examples.
- `mock()` values are valid but generic, so the structural-vs-semantic limitation must stay prominent.
- `toTypeScript()` output is helpful, but users may need guidance on when to generate types vs rely on `index.d.ts` generics.

---

## Blocker Assessment

No stable-core ergonomics blocker found.

Stable core appears ready for broader real-world usage, with docs improvements recommended around `diff()` interpretation and generated type usage.
