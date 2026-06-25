# Recipes Readiness Report

**Block:** Real-World Usage Recipes  
**Package:** `@weipertda/sigiljs` v0.10.0

---

## 1. Current package name

`@weipertda/sigiljs` — unchanged. No split.

---

## 2. Recipe docs created

| File | Status |
|------|--------|
| `docs/recipes/README.md` | ✅ Created — recipe navigation hub |
| `docs/recipes/api-route.md` | ✅ Created |
| `docs/recipes/llm-output.md` | ✅ Created |
| `docs/recipes/form-submission.md` | ✅ Created |
| `docs/recipes/database-persistence.md` | ✅ Created |
| `docs/recipes/cli-workflow.md` | ✅ Created |
| `docs/recipes/contract-testing.md` | ✅ Created |
| `docs/recipes/full-lifecycle.md` | ✅ Created |
| `docs/recipes/index.md` | ✅ Updated — links to all new recipes |
| 11 existing recipe docs | ✅ Stale `from 'sigil'` imports fixed → `@weipertda/sigiljs` |
| `docs/recipes/ai-output-contracts.md` | ✅ Fixed — removed SDK call, added deterministic simulation |

---

## 3. Recipe examples created

| File | Status |
|------|--------|
| `examples/recipes/api-route.js` | ✅ Created + verified |
| `examples/recipes/llm-output.js` | ✅ Created + verified |
| `examples/recipes/form-submission.js` | ✅ Created + verified |
| `examples/recipes/database-persistence.js` | ✅ Created + verified |
| `examples/recipes/contract-testing.js` | ✅ Created + verified |
| `examples/recipes/full-lifecycle.js` | ✅ Created + verified |
| `examples/recipes/cli/user.sigil.js` | ✅ Created |
| `examples/recipes/cli/old-user.sigil.js` | ✅ Created |
| `examples/recipes/cli/new-user.sigil.js` | ✅ Created |
| `examples/recipes/cli/valid-user.json` | ✅ Created |
| `examples/recipes/cli/invalid-user.json` | ✅ Created |
| `examples/recipes/cli/README.md` | ✅ Created |

---

## 4. Boundaries covered

| Boundary | Recipe |
|----------|--------|
| API request/response | `api-route.md` + example |
| LLM / AI structured output | `llm-output.md` + example |
| Form submission | `form-submission.md` + example |
| Database (read/insert/update/diff) | `database-persistence.md` + example |
| CLI terminal workflows | `cli-workflow.md` + CLI example files |
| Contract proof (cross-boundary) | `contract-testing.md` + example |
| Full multi-boundary | `full-lifecycle.md` + example |

---

## 5. Five pillars coverage

| Pillar | Covered in |
|--------|-----------|
| Define | All recipes, full-lifecycle.js |
| Enforce | All recipes |
| Transform | full-lifecycle.js, api-route.js, database-persistence.js |
| Project | api-route.js, form-submission.js, llm-output.js, full-lifecycle.js |
| Prove | contract-testing.js, full-lifecycle.js, all examples |

---

## 6. CLI recipe status

CLI recipe files (`examples/recipes/cli/`) work with the experimental `sigil` bin. Smoke tests verify describe, check, and diff commands.

CLI recipe doc clearly marks the CLI as experimental.

---

## 7. Smoke test status

`tests/recipe-smoke.test.js` — **31 tests, 0 failures**

Coverage:
- API route: valid request, invalid role, JSON Schema, mock
- LLM output: valid, invalid urgency, missing field, proof
- Form submission: valid, missing email, bad plan, form projection
- Database persistence: read, invalid row, extra field, diff, proof
- Contract testing: mock, determinism, cases, proof
- Full lifecycle: all five pillars
- CLI contract files: describe, check valid/invalid, diff

---

## 8. Docs discoverability

- `README.md` — "Real-world recipes" section added with 6 recipe links
- `examples/README.md` — "Recipe examples" section added with 6 file links
- `docs/recipes/index.md` — updated with quick links to all 7 new recipes

---

## 9. Remaining blockers

| Blocker | Severity |
|---------|----------|
| No TypeScript `.d.ts` declarations | medium — documented limitation |
| CLI experimental (no confirmed usage) | medium — documented limitation |
| Mock values are not semantically meaningful | low — documented limitation |

---

## 10. Recommendation

**Recipes are ready for public adoption support.**

Stay single package. Proceed to **TypeScript Declaration Readiness** after this block.
