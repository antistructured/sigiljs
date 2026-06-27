# TypeScript Consumer Smoke

**Block:** Release Candidate Dry Run  
**Pass:** 7 — TypeScript Consumer Smoke Test  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Goal

Verify TypeScript declarations work from both the in-repo declaration smoke suite and a fresh packed consumer project.

---

## Commands Run

In-repo declaration smoke:

```bash
bun run check:types
```

Fresh packed consumer smoke:

```bash
npm pack --json
mkdir -p .tmp/ts-consumer-smoke
cd .tmp/ts-consumer-smoke
npm init -y
npm install ../../weipertda-sigiljs-0.16.0.tgz typescript
./node_modules/.bin/tsc --noEmit -p tsconfig.json
```

---

## In-Repo Result

```txt
bun run check:types — pass
```

This covers the existing consumer-style declaration files under:

```txt
tests/typescript-declarations/
```

---

## Packed Consumer Coverage

The temporary TypeScript consumer imported from:

```txt
@weipertda/sigiljs
```

APIs/type paths covered:

- `SigilContract<T>`
- `sigil.exact<T>()`
- `oneOf()`
- `optional()`
- `parse()` return type
- `safeParse()` narrowing
- `toJSONSchema()`
- `toTypeScript()`
- `toOpenAPI()`
- `mock()`
- `cases()`
- `test()`
- experimental `httpContract()` declaration surface

---

## Cleanup

Cleanup completed:

```txt
temporary TypeScript consumer directory removed
tarball removed
```

---

## Declaration Posture

Declarations remain intentionally conservative.

Supported consumer pattern:

```txt
sigil<User>(definition)
sigil.exact<User>(definition)
```

Not claimed:

```txt
deep static inference from every object definition
```

---

## Blockers

No TypeScript declaration blocker found for a 0.x release-candidate dry run.
