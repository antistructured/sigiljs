# Docs / Recipes Gap Review

**Block:** Real-World Usage Trial  
**Pass:** 11 — Docs / Recipes Gap Review  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Sources Reviewed

- `docs/recipes/`
- `examples/recipes/`
- `docs/README.md`
- `README.md`
- `docs/api.md`
- `docs/cli.md`
- `docs/projections/http.md`
- `docs/known-limitations.md`
- `docs/stability.md`
- `docs/internal/usage-friction-log.md`

---

## Small Docs Fixes Applied

Patched corrupted HTTP header examples in:

- `docs/projections/http.md`
- `docs/api.md`

The examples now use neutral `requestId` headers instead of token-looking snippets that were corrupted/redacted in docs.

Verification search:

```txt
***|project json-schema|project typescript
```

Result: no public-doc matches found.

---

## Missing / Weak Examples

### TypeScript

Need more consumer examples showing:

- `sigil<T>()`
- `sigil.exact<T>()`
- `safeParse()` narrowing
- when to rely on `index.d.ts` vs generated `toTypeScript()` output

### Diff

Need clearer docs explaining:

- `A.diff(B)` direction
- change entry fields
- how to interpret diff output for migrations/release review

### CLI

Docs should continue to emphasize:

- actual projection commands are `json-schema`, `types`, `openapi`, and `form`
- `.sigil.js` is the safest workflow
- `.sigil` text format remains Bun-specific/experimental
- output shapes and exit-code compatibility are not frozen before 1.0

### HTTP

Docs should clarify:

- `toPathItem()` returns `{ [path]: { [method]: operation } }`
- missing request parts are skipped
- framework adapters should normalize into `{ body, params, query, headers }`

### Forms

Docs should clarify:

- `toFormConstraints()` is metadata, not a UI adapter
- UI widgets, messages, help text, formats, and flattening are app/adapter-owned

### AI

Docs should keep the provider-neutral pattern prominent:

```txt
toJSONSchema() + safeParse(modelOutput)
```

No provider helper should be implied.

---

## Future Docs Work

Recommended for a follow-up Ergonomics Fix Pack:

1. Add a focused TypeScript consumer guide.
2. Add a focused `diff()` interpretation guide.
3. Add a CLI compatibility caveats section.
4. Expand HTTP helper docs around `toPathItem()` and missing request parts.
5. Expand form docs around what UI adapters still need.
6. Add AI structured-output repair-loop recipe language.

---

## Blocker Assessment

No docs/recipes blocker remains after the small HTTP snippet fixes.

Larger docs work should be handled in a follow-up Ergonomics Fix Pack rather than broad rewrites in this usage-validation block.
