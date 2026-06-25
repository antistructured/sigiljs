# Recipe Surface Audit

**Block:** Real-World Usage Recipes  
**Package:** `@weipertda/sigiljs` v0.10.0

---

## Existing recipe material

### `docs/recipes/` (11 recipe docs + index)

| File | Status | Issue |
|------|--------|-------|
| `index.md` | exists | Uses old index structure |
| `api-request-contracts.md` | exists | `from 'sigil'` stale import |
| `api-response-contracts.md` | exists | `from 'sigil'` stale import |
| `ai-output-contracts.md` | exists | `from 'sigil'` stale import; uses `model.generateObject()` (SDK call) |
| `database-contracts.md` | exists | `from 'sigil'` stale import |
| `form-contracts.md` | exists | `from 'sigil'` stale import |
| `event-contracts.md` | exists | `from 'sigil'` stale import |
| `queue-contracts.md` | exists | `from 'sigil'` stale import |
| `webhook-contracts.md` | exists | `from 'sigil'` stale import |
| `config-contracts.md` | exists | `from 'sigil'` stale import |
| `local-storage-contracts.md` | exists | `from 'sigil'` stale import |
| `plugin-contracts.md` | exists | `from 'sigil'` stale import |

**All 11 recipe docs have stale `from 'sigil'` imports that should be `from '@weipertda/sigiljs'`.**

### Existing recipe pattern

All 11 recipes follow a consistent 6-step format:
1. Boundary problem
2. Sigil contract
3. Unknown input
4. Enforcement (parse/safeParse/assert)
5. Trusted output
6. Optional projection

This pattern is good and should be preserved/extended.

### `examples/recipes/` — does not exist

No runnable recipe examples exist yet. All recipe docs are doc-only.

---

## Gaps vs block requirements

| Required Recipe | Status |
|----------------|--------|
| API route (request + response combined) | partial (two separate docs) |
| LLM output | exists (stale import, uses SDK call) |
| Form submission | exists as recipe stub |
| Database persistence (full: read/insert/update/diff) | partial |
| CLI workflow | not in recipes (in `docs/cli/`) |
| Contract testing | not in recipes |
| Full lifecycle (all 5 pillars) | not in recipes |

---

## Duplicate/overlap material

- `docs/recipes/api-request-contracts.md` + `docs/recipes/api-response-contracts.md` cover partial API route — the new recipe combines them into one runnable example
- `docs/database/` has extensive docs (record, insert, update, diff, testing) — the recipe should reference these rather than duplicate
- `docs/forms/` has extensive docs — same

---

## Stale imports to fix

All 11 recipe docs in `docs/recipes/*.md`:
```
from 'sigil'  →  from '@weipertda/sigiljs'
```

The `docs/recipes/ai-output-contracts.md` also uses `model.generateObject()` which implies an SDK call — this should be replaced with a deterministic simulated output example.

---

## Recommended scope

1. Fix all 11 stale recipe doc imports (`'sigil'` → `'@weipertda/sigiljs'`)
2. Create `docs/recipes/README.md` as recipe navigation hub
3. Create 7 new recipe docs: api-route, llm-output, form-submission, database-persistence, cli-workflow, contract-testing, full-lifecycle
4. Create `examples/recipes/` with 6 runnable examples (one per recipe, CLI recipe handled via sigil.js files)
5. Create `tests/recipe-smoke.test.js` with smoke tests
6. Update `docs/recipes/index.md` to link new recipes
