# README Public Release Polish

**Block:** 0.18.x Public Release Prep  
**Pass:** 3 — README Public Release Polish  
**Package:** `@weipertda/sigiljs`  
**Release target:** `0.18.0`

---

## Files Inspected

- `README.md`
- `docs/quickstart.md`
- `docs/stability.md`
- `docs/known-limitations.md`
- `docs/experimental.md`
- `docs/typescript.md`
- `docs/diff.md`
- `docs/internal/docs-release-review.md`

---

## README Status

The README already included the required public-release elements:

- clear one-sentence positioning
- install commands for npm and Bun
- small `safeParse()` quickstart
- five-pillar lifecycle table
- stable API quick map
- TypeScript declaration support and link
- experimental surfaces clearly labeled
- docs links
- known limitations link
- no stale `aiSchema()` helper references
- no stale package import names
- no nonexistent package split promotion

---

## Changes Made

Small public-release fixes:

- updated README status from `0.16.0` to `0.18.0`
- clarified that `0.18.0` is public `0.x` usage prep, not a `1.0.0` release
- fixed the stable API quick-map import example so it does not import `sigil.exact` as a named export

---

## Experimental Surface Check

README keeps these explicitly experimental:

- CLI / `sigil` bin
- `httpContract()`
- `contract.toFormConstraints()`

No experimental API was promoted.

---

## Stale Reference Check

Targeted README search found no remaining instances of:

- `0.16.0`
- `aiSchema`
- `from 'sigil'` / `from "sigil"`
- invalid `sigil, sigil.exact` import list
- concrete `@sigil/*` package imports
- `project <target>` CLI wording

---

## Blocker Assessment

No README blocker remains for public `0.18.0` release prep.
