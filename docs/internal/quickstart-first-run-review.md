# Quickstart First-Run Review

**Block:** 0.18.x Public Release Prep  
**Pass:** 5 — Quickstart + First-Run Path Review  
**Package:** `@weipertda/sigiljs`  
**Release target:** `0.18.0`

---

## Files Inspected

- `docs/quickstart.md`
- `README.md`
- `examples/quickstart/`
- `examples/recipes/`
- `tests/recipe-smoke.test.js`
- `docs/internal/fresh-consumer-install-smoke.md`

---

## First-Run Path Status

The first-run path is coherent for a new user:

1. install `@weipertda/sigiljs`
2. import `sigil`, `oneOf`, and `optional`
3. define a first contract with `sigil.exact()`
4. validate unknown data with `safeParse()`
5. use `parse()` for throwing validation
6. project to JSON Schema / TypeScript / OpenAPI
7. generate deterministic mock data
8. continue to TypeScript and stability docs

No external services are required.

---

## Import / Package Name Check

Quickstart docs and runnable quickstart example use the package name:

```txt
@weipertda/sigiljs
```

No stale `sigil` package import was found in the quickstart path.

---

## TypeScript Path

The README links to:

```txt
docs/typescript.md
```

The docs index also links the TypeScript guide directly.

---

## Verification Run

Commands run:

```bash
bun run examples/quickstart/user.js
bun test tests/recipe-smoke.test.js
```

Results:

```txt
quickstart example: pass
recipe smoke: 31 pass, 0 fail
```

The quickstart example exercised:

- `safeParse()` valid and invalid paths
- error path / message output
- `parse()` with transform behavior
- `toJSONSchema()`
- `mock()`
- `cases()`

---

## Patch Decision

No quickstart patch was needed.

The optional smoke-test addition was not needed because the quickstart example and recipe smoke tests already cover the first-run path.

---

## Blocker Assessment

No first-run blocker remains for public `0.18.0` release prep.
