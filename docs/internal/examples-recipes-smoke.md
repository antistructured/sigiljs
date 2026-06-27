# Examples / Recipes Smoke

**Block:** Release Candidate Dry Run  
**Pass:** 8 — Examples / Recipes Smoke Test  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Goal

Verify release-facing examples and recipes still run after packaging/release changes and remain deterministic/offline.

---

## Inspected

- `examples/`
- `examples/recipes/`
- `examples/README.md`
- `tests/recipe-smoke.test.js`
- `docs/recipes/`

---

## Commands Run

Recipe smoke suite:

```bash
bun test tests/recipe-smoke.test.js
```

Direct runnable recipe examples:

```bash
bun run examples/recipes/api-route.js
bun run examples/recipes/llm-output.js
bun run examples/recipes/form-submission.js
bun run examples/recipes/database-persistence.js
bun run examples/recipes/contract-testing.js
bun run examples/recipes/full-lifecycle.js
```

Stale/reference scan:

```txt
from 'sigil'
from '@sigil/*'
aiSchema
live provider/network markers
```

---

## Results

Recipe smoke suite:

```txt
31 pass
0 fail
51 expect() calls
```

Direct recipe examples:

```txt
recipe examples ran
```

Stale/reference scan:

```txt
no stale package imports found
no @sigil/* package imports found
no aiSchema references found
no live provider/network calls found in recipes docs scan
```

---

## Determinism / External Services

The release-facing recipe examples are deterministic and offline.

No live SDK calls or external services are required for the smoke-tested recipe workflows.

---

## Experimental Labels

Recipe coverage includes experimental surfaces where appropriate:

- CLI workflow recipes use the experimental CLI
- form submission recipe uses experimental form constraints

Those surfaces remain documented as experimental in public docs.

---

## Blockers

No examples/recipes blocker found for a 0.x release-candidate dry run.
