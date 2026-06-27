# Ergonomics Fix Pack Report

**Block:** Ergonomics Fix Pack  
**Pass:** 9 — Ergonomics Fix Pack Report  
**Package:** `@weipertda/sigiljs`  
**Observed version:** `0.16.0`  
**Suggested target:** `0.18.0`  
**Theme:** ergonomics fix pack

---

## 1. Current Package Name

```txt
@weipertda/sigiljs
```

No package rename occurred.

---

## 2. Current Version

```txt
0.16.0
```

The block request assumed `0.17.0`, but the actual `package.json` value observed during this block is `0.16.0`. This report records the live repo state rather than changing the version.

Suggested target remains:

```txt
0.18.0
```

---

## 3. Scope Addressed

Addressed evidence-backed friction from the Real-World Usage Trial:

- `compile()` posture decision
- CLI compatibility policy
- TypeScript explicit-generic docs/examples
- `diff()` interpretation docs/examples
- HTTP/form stabilization evidence notes
- docs/examples consistency sweep
- type/regression alignment

No feature expansion occurred.

---

## 4. `compile()` Posture

Decision:

```txt
contract.compile() is an advanced public contract method.
The low-level compiler function is internal and is not a root package export.
```

Docs updated:

- `docs/internal/compile-posture-decision.md`
- `docs/stability.md`
- `docs/api.md`
- `docs/compiled-validators.md`
- `docs/known-limitations.md`

No `compile()` implementation or export was added.

---

## 5. CLI Compatibility Policy

Decision:

```txt
CLI is Bun-first experimental.
```

Policy summary:

- `sigil` bin remains exposed
- `.sigil.js` is preferred for real projects
- `.sigil` text files remain experimental / Bun-specific
- command names, output shapes, exit-code guarantees, CWD/module-loading behavior, and `.sigil` compatibility are not frozen before 1.0
- no CLI command was added

Docs updated:

- `docs/internal/cli-compatibility-policy.md`
- `docs/cli.md`
- `docs/experimental.md`
- `docs/known-limitations.md`
- `docs/cli/contract-files.md`
- `README.md`

---

## 6. TypeScript Generic Docs / Examples Status

Status: addressed.

Added:

- `docs/typescript.md`
- `tests/typescript-declarations/generic-usage-polish.ts`

Updated discoverability:

- `docs/README.md`
- `docs/api.md`
- `README.md`
- `trials/typescript-consumer/README.md`

Covered patterns:

- `sigil<T>()`
- `sigil.exact<T>()`
- `safeParse()` narrowing
- `parse()` return type
- `mock()` return type
- `cases()` shape
- projection return types
- conservative inference limitation

No source conversion to TypeScript occurred.

---

## 7. `diff()` Docs / Examples Status

Status: addressed.

Added:

- `docs/diff.md`

Updated:

- `docs/README.md`
- `docs/api.md`
- `docs/database/persistence-diffs.md`
- `docs/recipes/database-persistence.md`
- `docs/boundaries/database.md`
- `trials/database-boundary/README.md`
- `examples/database/record-contract-diff.js`
- relevant internal database docs

Final documented direction:

```txt
Next.diff(Previous)
```

No `diff()` runtime behavior changed.

---

## 8. HTTP / Form Stabilization Evidence Status

Status: documented; both remain experimental.

Added:

- `docs/internal/http-form-stabilization-evidence.md`

Updated:

- `docs/known-limitations.md`
- `docs/projections/http.md`
- `docs/projections/forms.md`

HTTP evidence still needed:

- real route usage with params/query/headers/body
- multi-status response routing
- framework-normalized inputs
- `error.parts` handling
- `toOpenAPI()` / `toPathItem()` assembly expectations

Form evidence still needed:

- real UI/form adapter workflows
- labels/widgets/help text/formats/messages policy
- nested field flattening expectations
- error mapping from validation results to fields

---

## 9. Docs / Examples Consistency Status

Status: addressed.

Added:

- `docs/internal/ergonomics-docs-consistency-sweep.md`

Fixed:

- stale `aiSchema()` example → `contract.toJSONSchema()`
- stale `Old.diff(New)` runnable example → `Next.diff(Previous)`
- nonexistent `docs/http/` index link

Patched examples were executed successfully.

---

## 10. Type / Regression Status

Status: pass.

Added:

- `docs/internal/ergonomics-type-regression-alignment.md`

Verified:

```txt
bun run check:types: pass
bun test: 605 pass, 0 fail
```

No advanced inference or broad runtime regression expansion was added.

---

## 11. Remaining Blockers

No blocker remains for this ergonomics fix pack.

Remaining before a future 1.0 decision:

- CLI still needs field evidence before stabilization
- `httpContract()` still needs real route/framework evidence before stabilization
- `toFormConstraints()` still needs real UI/form adapter evidence before stabilization
- package version has not been bumped in this block

---

## 12. Recommendation

Ergonomics friction from the real-world usage trial has been addressed without expanding the public API.

Stable core remains ready for broader real-world usage.

Keep these surfaces experimental:

- CLI / `sigil` bin
- `httpContract()`
- `toFormConstraints()`

Recommended next block:

```txt
0.18.x Public Release Prep
```

Alternative if experimental surfaces are the priority:

```txt
Experimental Surface Field Trial
```

Do not proceed to a 1.0 decision gate until the project intentionally commits to near-term 1.0 stabilization.

---

## Invariant Confirmation

- Package remains `@weipertda/sigiljs`.
- Runtime dependencies remain zero.
- No package split occurred.
- No new public API was added.
- No experimental API was stabilized.
