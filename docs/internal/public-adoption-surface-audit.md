# Public Adoption Surface Audit

**Block:** Release / Public Adoption Hardening  
**Package:** `@weipertda/sigiljs`

---

## README status

| Item | Status | Notes |
|------|--------|-------|
| Title + positioning | ✅ | Clear category statement |
| Install instructions | ⚠️ | Shows `bun add` first; `npm install` is secondary |
| Core example | ✅ | Good safeParse example |
| Five pillars | ⚠️ | Four listed (not five — missing "Prove") |
| CLI example | ✅ | Present |
| Boundary example | ✅ | Present |
| AI example | ❌ | References `aiSchema()` which is NOT a public export — stale/wrong |
| AI example duplicate | ❌ | Same block appears twice (lines 162–179 and 185–204) |
| Docs list | ⚠️ | 30+ unorganized links — hard to scan |
| Stable vs experimental | ⚠️ | Experimental APIs not clearly called out in the README body |
| Known limitations | ❌ | Not mentioned |
| "Prove" pillar | ⚠️ | Not in the main pillars section |
| SigilJS vs Zod section | ✅ | Honest and fair |
| Version/status note | ❌ | No "current version" or stability notice |

---

## Package metadata status

| Field | Status | Current value |
|-------|--------|---------------|
| `name` | ✅ | `@weipertda/sigiljs` |
| `version` | ⚠️ | `0.4.0` — should be `0.10.0` for this milestone |
| `description` | ✅ | `Executable data contracts for JavaScript` |
| `keywords` | ✅ | 16 keywords, good coverage |
| `bin` | ✅ | `"sigil": "./src/playground.js"` |
| `dependencies` | ✅ | Empty — zero runtime deps |
| `repository` | ❌ | Not present |
| `homepage` | ❌ | Not present |
| `bugs` | ❌ | Not present |
| `license` | ❓ | Need to verify |

---

## Docs navigation status

`docs/README.md` issues:
- Duplicate items (e.g. `AI Structured Output Contracts` appears twice with different paths)
- Missing sections: database, forms, CLI multi-page docs
- Numbered list skips (16 appears twice)
- No grouping by category (getting-started vs projections vs boundaries vs CLI)

---

## Examples discoverability

| Directory | Status |
|-----------|--------|
| `examples/` root | No README / index |
| `examples/workflows/` | Has README ✅ |
| `examples/forms/` | No README |
| `examples/database/` | No README |
| `examples/cli/` | Has README ✅ |
| `examples/ai/` | No README |
| `examples/testing/` | No README |

---

## Install instructions

README shows `bun add` first. The block requires `npm install @weipertda/sigiljs` as the primary install path. This should be the first install example.

---

## Quickstart clarity

`docs/quickstart.md` references the old package name `sigil` (not `@weipertda/sigiljs`) and imports `Sigil` from the template-literal path, not the modern `sigil.exact()` API. This doc is outdated and should be updated.

---

## Stable API clarity

`docs/api.md` clearly marks stable vs experimental. The README does not clearly signal which parts are stable vs experimental — the AI example references a non-existent API.

---

## Experimental API clarity

`docs/experimental.md` is good. But README doesn't point new users to it prominently.

---

## CLI exposure

CLI is exposed as `sigil` bin. Experimental status is in `docs/experimental.md` but not clearly stated in the README body or with a notice near the CLI examples.

---

## Known limitations

No `docs/known-limitations.md` exists. Known limitations from the CLI block are in internal docs only.

---

## Release readiness concerns

1. `aiSchema()` referenced in README does not exist as a public export — must be removed.
2. Duplicate AI block in README.
3. `docs/quickstart.md` uses stale package name.
4. Version should be bumped to `0.10.0`.
5. `repository`, `homepage`, `bugs` fields missing from `package.json`.
6. README docs list is unsorted and dense — needs sections.
7. Five-pillar section shows only four pillars (missing Prove).
