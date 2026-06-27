# TypeScript Consumer Trial

**Block:** Real-World Usage Trial  
**Pass:** 4 — TypeScript Consumer Trial  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Trial Files

- `trials/typescript-consumer/user-contract.ts`
- `trials/typescript-consumer/support-ticket.ts`
- `trials/typescript-consumer/README.md`

---

## Type Check Wiring

Updated:

- `tests/typescript-declarations/tsconfig.json`

The existing `check:types` script now includes:

```txt
../../trials/typescript-consumer/**/*.ts
```

---

## Command Run

```bash
bun run check:types
```

Result: **pass**

---

## Coverage

The trial validates:

- explicit `sigil<T>()` / `sigil.exact<T>()` consumer usage
- `parse()` return typing
- `safeParse()` narrowing
- projection return types
- `mock()`, `cases()`, and `test()` types
- conservative inference when no generic is supplied
- experimental `httpContract()` type availability without stabilization

---

## Ergonomics Findings

### What Felt Good

- Explicit generics make consumer code understandable.
- `safeParse()` discriminated union narrowing works as expected.
- Projection return types are broad but usable for application-level handling.
- `mock()`/`cases()`/`test()` are easy to type once the contract generic is provided.

### Friction

- Without explicit generics, parsed output is `unknown`; this is accurate but will surprise users who expect schema-to-type inference.
- `toJSONSchema()` / `toOpenAPI()` return broad `Record<string, unknown>` types, which is conservative but not richly ergonomic.
- Docs should include more examples showing explicit generic usage in real consumer files.

---

## Blocker Assessment

No TypeScript blocker found.

Conservative inference remains acceptable before 1.0 if documentation clearly shows explicit generic usage and does not promise deep inference.
