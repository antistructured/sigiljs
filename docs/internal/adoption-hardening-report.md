# Adoption Hardening Report

**Block:** Release / Public Adoption Hardening  
**Package:** `@weipertda/sigiljs` v0.10.0

---

## 1. Current package name

`@weipertda/sigiljs` — unchanged. No split.

---

## 2. README status

| Item | Result |
|------|--------|
| Removed stale `aiSchema()` references | ✅ |
| Removed duplicate AI example block | ✅ |
| `npm install @weipertda/sigiljs` as primary install | ✅ |
| Five pillars (including Prove) | ✅ |
| Boundary examples (API, DB, form, AI) | ✅ |
| Experimental features clearly labeled | ✅ |
| Docs links organized by section | ✅ |
| No package split implied | ✅ |
| Version status note | ✅ |
| No overclaiming | ✅ |

---

## 3. Package metadata status

| Field | Result |
|-------|--------|
| `name` | `@weipertda/sigiljs` ✅ |
| `version` | `0.10.0` ✅ (bumped from `0.4.0`) |
| `description` | `Executable data contracts for JavaScript runtime boundaries.` ✅ |
| `keywords` | 18 keywords including `cli`, `runtime-validation` ✅ |
| `repository` | present ✅ |
| `homepage` | present ✅ |
| `bugs` | present ✅ |
| `license` | MIT ✅ |
| `dependencies` | empty ✅ |
| `bin` | `"sigil": "./src/playground.js"` ✅ |

---

## 4. Docs navigation status

`docs/README.md` rewritten with organized sections:
- Getting started
- Core API
- Projections
- Testing / Prove
- Boundaries (API, database, forms, AI, HTTP)
- CLI (multi-page)
- Experimental APIs
- Package policy
- Internal reports

No duplicate items. All boundary and CLI docs linked.

---

## 5. Examples index status

`examples/README.md` created. Covers all example directories:
- Core examples
- AI examples
- HTTP examples
- Form examples (11 files)
- Database examples (14 files)
- CLI examples
- Testing / Prove examples
- CLI workflow examples
- Published package examples

---

## 6. Stability map status

`docs/stability.md` created. Covers:
- Stable core API (full method table)
- Experimental APIs (HTTP, forms, CLI)
- Internal-only internals
- Deferred `@sigil/*` packages
- Known limitations reference

---

## 7. Quickstart status

- `docs/quickstart.md` updated — old `sigil` package name and `Sigil` import replaced with `@weipertda/sigiljs` and `sigil.exact()`
- `examples/quickstart/user.js` created and verified — runs with all five pillars demonstrated
- `examples/quickstart/package-smoke.md` created

---

## 8. Release notes status

`docs/internal/release-notes-draft.md` created. Covers:
- Release theme
- Stable core summary
- Experimental features
- Boundary examples
- Known limitations
- Upgrade notes (version bump, `aiSchema` removal)
- Verification results

---

## 9. Known limitations status

`docs/known-limitations.md` created. Documents:
- CLI Bun-specific loading
- CWD-relative URL resolution
- No "at least one field" constraint
- `serialize()` doesn't apply transforms
- Experimental API surface
- Missing adapters (framework, ORM, AI SDK, UI)
- Package split deferral
- TypeScript declarations gap
- Mock data semantics

---

## 10. Public positioning status

`docs/internal/public-positioning-pack.md` created. Includes:
- One-line, short, long descriptions
- Taglines
- Comparison-safe positioning vs Zod and TypeScript
- Boundary-focused bullets
- When to / when not to recommend SigilJS

---

## 11. Verification results

| Gate | Result |
|------|--------|
| `bun test` | **493 pass, 0 fail** |
| `bun run lint` | **exit 0 (clean)** |
| `npm pack --dry-run` | **clean, 256 files, v0.10.0** |
| Runtime dependencies | **0** |
| `aiSchema` export | **not present** ✅ |
| Package name | **`@weipertda/sigiljs`** ✅ |
| Package split | **None** ✅ |

---

## 12. Remaining blockers

| Blocker | Severity | Notes |
|---------|----------|-------|
| `.sigil` CLI loading is Bun-specific | medium | Documented in known-limitations.md |
| No TypeScript `.d.ts` declarations | medium | Not in scope for this block |
| CLI has no confirmed real-world usage | high | Inherent — needs time and users |
| No `@sigil/*` package extraction | low | Intentionally deferred |

---

## 13. Recommendation

**Ready for public adoption hardening release at v0.10.0.**

Stay single package. Do not extract `@sigil/*` packages yet. Continue collecting real-world usage before stabilizing experimental APIs.

Next recommended block: **Real-World Usage Recipes** — practical end-to-end examples for API routes, LLM validation, form submission, database boundaries, and CLI workflows.
