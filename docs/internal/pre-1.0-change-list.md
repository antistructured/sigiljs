# Pre-1.0 Change List

**Package:** `@weipertda/sigiljs` v0.13.0  
**Pass:** 7 — Pre-1.0 Change List

---

## Purpose

This list prioritizes what must happen before SigilJS can responsibly cut a future `1.0.0`.

It is intentionally scoped to stability discipline, not feature expansion.

---

## Must Fix Before 1.0

1. **Confirm stable core API names**
   - Freeze `sigil`, `sigil.exact`, `optional`, `union`, `oneOf`, `pipe`, `trim`, `realType`, and `SigilValidationError` as the preferred stable core.
   - Decide exact public wording for `Sigil` template syntax.

2. **Confirm Sigil vs sigil policy**
   - Current preferred API is `sigil()` / `sigil.exact()`.
   - `Sigil` remains supported but should not displace the object API in new docs.
   - Legacy aliases `S` and `T` need a final keep/deprecate/remove decision.

3. **Freeze error object shape**
   - Lock `SigilValidationError` fields (`message`, `path`, `expected`, `actual`, `code`) and `toJSON()` shape.
   - Decide whether failure paths always expose the same path format.

4. **Confirm transform/serialize behavior**
   - Settled behavior: `parse()` applies transforms; `serialize()` validates and does not apply transforms.
   - This must be explicitly accepted as the 1.0 behavior or changed before 1.0.

5. **Freeze safe result shape**
   - Keep `{ success: true, data } | { success: false, error }`.
   - Decide whether `error` shape is always `unknown` publicly or narrowed for core-only methods.

6. **Freeze Prove output shapes**
   - `cases()` returns `{ valid, invalid }`.
   - `test()` returns a summary object with `success`, `valid`, `invalid`, and `failures`.
   - `mock()` remains structural, not semantic.

7. **Mark experimental edges consistently**
   - HTTP helpers, form constraints, CLI workflows, and `.sigil` file format must remain clearly experimental unless evidence changes.

---

## Should Fix Before 1.0

1. **Projection output stability statements**
   - Document supported JSON Schema subset.
   - Document supported OpenAPI schema subset.
   - Document TypeScript projection output limits.

2. **Alias deprecation policy**
   - Align runtime docs, TypeScript declarations, and README around `S`, `T`, `real`, and `Real`.
   - Prefer deprecating aliases over removing them abruptly if they have been published.

3. **Decide whether `compile()` is fully stable**
   - It is public and tested, but lower-level than most user APIs.
   - Either keep stable as an advanced public method or mark as advanced/low-level before 1.0.

4. **CLI bin name confirmation**
   - Settled current bin is `sigil`.
   - If that name is not final, rename before 1.0; do not rename after 1.0.

5. **Docs terminology cleanup**
   - Use “stable core candidate” until 1.0.
   - Use “experimental” for HTTP/forms/CLI.
   - Avoid implying `@sigil/*` packages currently exist.

---

## Can Defer After 1.0

1. **Deep TypeScript inference**
   - Current declarations are conservative and usable.
   - Improve inference only after real TypeScript usage identifies valuable low-risk improvements.

2. **Package extraction**
   - `@sigil/core`, `@sigil/cli`, `@sigil/http`, `@sigil/forms`, `@sigil/db`, `@sigil/ai`, and `@sigil/types` should remain deferred.

3. **Framework adapters**
   - Express/Fastify/Hono adapters, React/Vue/Svelte form adapters, ORM adapters, database drivers, and AI provider SDK helpers are not required for core 1.0.

4. **Semantic mock data generation**
   - `mock()` can remain structural.
   - Semantic fixtures can be future opt-in tooling if needed.

5. **Provider-specific AI helpers**
   - Continue recommending direct contract usage with `toJSONSchema()`, `parse()`, and `safeParse()`.

---

## Do Not Do Before 1.0

1. Do not split packages.
2. Do not convert source to TypeScript.
3. Do not add runtime dependencies.
4. Do not add new projection targets.
5. Do not add new CLI commands unless a stabilization blocker requires it.
6. Do not add HTTP/framework adapters.
7. Do not add form UI adapters.
8. Do not add database/ORM helpers.
9. Do not add provider-specific AI SDK helpers.
10. Do not promote experimental APIs solely because they are documented and tested.

---

## Needs Real-World Usage

1. **CLI workflows**
   - Command names, flags, output shapes, exit codes, and `.sigil` compatibility.

2. **HTTP helpers**
   - Request-part model, response status routing, OpenAPI output, and handler wrapper ergonomics.

3. **Form constraints**
   - Field metadata shape, nested/array behavior, labels, select options, and framework integration needs.

4. **TypeScript declarations**
   - Consumer ergonomics around explicit generics and conservative inference.

5. **Prove helpers**
   - Whether structural `mock()` values and generated `cases()` cover common testing workflows.

---

## Summary

SigilJS should not cut 1.0 until stable core semantics are frozen and experimental edges are intentionally held outside the 1.0 guarantee.

The pre-1.0 work should stay narrow: freeze names, shapes, docs, errors, and behavior contracts — not add features.

---

## Addendum — Stable Core Hardening

The Stable Core Hardening block resolved several change-list items without expanding public surface area:

- froze `SigilValidationError` runtime and `toJSON()` shape
- froze `safeParse()` success/failure result shape
- confirmed `sigil()` as primary stable API and `Sigil` as stable advanced template API
- classified `S`, `T`, `real`, and `Real` as legacy supported aliases
- froze `transform()` / `serialize()` semantics
- documented and tested projection output contracts
- documented and tested Prove output contracts
- aligned `index.d.ts` with hardened stable-core shapes

Remaining pre-1.0 work should focus on regression coverage and real-world usage, not feature expansion.
