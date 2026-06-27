# TypeScript Consumer Trial

Consumer-style TypeScript declaration trials.

## Run

```bash
bun run check:types
```

The existing type-check project includes these files through `tests/typescript-declarations/tsconfig.json`.

See `docs/typescript.md` for the focused TypeScript consumer guide that came out of this trial.

## What this validates

- explicit `sigil<T>()` and `sigil.exact<T>()` usage
- `parse()` output typing
- `safeParse()` narrowing
- projection return types
- `mock()`, `cases()`, and `test()` types
- conservative inference when no generic is provided
- experimental `httpContract()` type availability without stabilization
