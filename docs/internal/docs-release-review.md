# Docs / README Release Review

**Block:** Release Candidate Dry Run  
**Pass:** 9 — Docs / README Release Review  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Goal

Review public docs from a release-candidate perspective and patch small stale references that could confuse package consumers.

---

## Inspected

- `README.md`
- `docs/README.md`
- `docs/quickstart.md`
- `docs/stability.md`
- `docs/known-limitations.md`
- `docs/experimental.md`
- `docs/recipes/README.md`
- `docs/api.md`
- `examples/README.md`
- related public docs surfaced by stale-reference search

---

## Checks

Verified:

- install commands use `@weipertda/sigiljs`
- package name remains `@weipertda/sigiljs`
- version references in active public docs are `0.16.0` or version-neutral
- stable vs experimental surfaces are documented
- CLI is labeled experimental
- TypeScript declaration support is documented
- known limitations are linked from the docs index
- recipes are discoverable from public docs and examples index
- public docs do not claim available `@sigil/*` packages
- public docs do not reference a non-exported AI schema helper

---

## Fixes Made

Small docs-only release-coherence fixes:

- updated stale `from 'sigil'` examples to `from '@weipertda/sigiljs'`
- replaced stale AI structured-output helper guidance with the supported `contract.toJSONSchema()` flow
- clarified hypothetical future `@sigil/*` package examples as non-existent future APIs
- updated testing helper wording from old version-specific language to current stable-candidate wording

Touched public docs:

- `docs/introduction.md`
- `docs/compiled-validators.md`
- `docs/projections/testing.md`
- `docs/projections/json-schema.md`
- `docs/projections/ai-structured-output.md`
- `docs/realtype.md`
- `docs/named-sigils.md`
- `docs/sigil-vs-zod.md`
- `docs/core-api-audit.md`
- `docs/package-split-readiness.md`

---

## Verification

Public-doc stale-reference scan:

```txt
no public-doc stale references found
```

Search covered:

- `from 'sigil'`
- `from '@sigil/*'`
- non-exported AI helper references
- stale `0.15.0` active public-doc version markers

Historical `docs/internal/` reports were excluded from the public-doc stale-reference result because they intentionally preserve prior block baselines.

---

## Blockers

No docs/readme blocker found for a serious 0.x release-candidate dry run.
