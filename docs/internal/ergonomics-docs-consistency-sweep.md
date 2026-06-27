# Ergonomics Docs / Examples Consistency Sweep

**Block:** Ergonomics Fix Pack  
**Pass:** 7 — Docs / Examples Consistency Sweep  
**Package:** `@weipertda/sigiljs`  
**Observed version:** `0.16.0`

---

## Scope

Focused sweep after ergonomics fixes across:

- `README.md`
- `docs/README.md`
- `docs/api.md`
- `docs/quickstart.md`
- `docs/known-limitations.md`
- `docs/stability.md`
- `docs/experimental.md`
- `docs/recipes/`
- `docs/boundaries/`
- `docs/cli/`
- `examples/`
- `trials/`

Historical/internal package-boundary docs were not treated as public stale references unless they contradicted current behavior examples.

---

## Checks

| Check | Result |
|-------|--------|
| package imports use `@weipertda/sigiljs` in actionable public docs/examples | pass after fixes |
| no stale `aiSchema` example in runnable examples | fixed |
| no nonexistent `compile()` public standalone compiler usage found | pass |
| no stale `project <target>` CLI wording in actionable CLI docs | pass |
| TypeScript docs discoverable | pass |
| `diff()` docs/examples discoverable | pass |
| CLI experimental/Bun-first status clear | pass |
| HTTP/form experimental status clear | pass |
| legacy aliases not overpromoted in README | pass |
| README remains concise | pass |

---

## Fixes Made

### Stale AI example

Updated:

- `examples/ai/ai-schema.js`

Changed the nonexistent `aiSchema()` helper usage to the supported provider-neutral bridge:

```txt
contract.toJSONSchema()
```

### Stale diff direction example

Updated:

- `examples/database/record-contract-diff.js`

Changed old/new diff usage to the documented direction:

```txt
Next.diff(Previous)
```

### Stale docs index link

Updated:

- `docs/README.md`

Removed the nonexistent `docs/http/` directory link and kept the real HTTP helper page.

---

## Example Verification

Ran:

```bash
bun run examples/ai/ai-schema.js
bun run examples/database/record-contract-diff.js
```

Result: pass.

---

## Remaining Notes

- `dev_flow.md` and older package-boundary docs still contain historical/future `@sigil/*` design references. They are not public usage examples and are not changed by this block.
- Internal reports may mention prior audit findings such as “`A.diff(B)` direction” as the friction item that was fixed; those references are historical report content, not current guidance.

---

## Blocker Assessment

No docs/examples consistency blocker remains for this ergonomics fix pack.
