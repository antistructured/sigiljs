# Ergonomics Type + Regression Alignment

**Block:** Ergonomics Fix Pack  
**Pass:** 8 — Type + Regression Alignment  
**Package:** `@weipertda/sigiljs`  
**Observed version:** `0.16.0`

---

## Files Inspected

- `index.d.ts`
- `tests/typescript-declarations/`
- `tests/regression-*.test.js`
- `tests/stable-core-*.test.js`
- `package.json`

---

## Type Coverage Alignment

Added in this block:

- `tests/typescript-declarations/generic-usage-polish.ts`

This protects the TypeScript documentation patterns added in `docs/typescript.md`:

- `sigil<T>()`
- `sigil.exact<T>()`
- `parse()` return typing
- `safeParse()` narrowing
- `mock()` return typing
- `cases()` `{ valid, invalid }` shape
- projection return types
- conservative `unknown` default when no generic is provided

No advanced inference was added.

---

## Regression Alignment

No runtime regression tests were added in this pass because the ergonomics fix pack changed docs/examples and added TypeScript smoke coverage only.

Existing runtime coverage already protects:

- stable core regression matrix
- `diff()` behavior and change entry shapes
- CLI workflow behavior
- HTTP/form experimental behavior
- public export boundaries
- recipe smoke examples

---

## Commands Run

```bash
bun run check:types
bun test
```

Results:

```txt
bun run check:types: pass
bun test: 605 pass, 0 fail
```

---

## Blocker Assessment

No type or regression blocker remains.
