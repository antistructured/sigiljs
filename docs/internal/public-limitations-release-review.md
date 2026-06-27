# Public Limitations Release Review

**Block:** 0.18.x Public Release Prep  
**Pass:** 9 — Public Limitations + Experimental Surface Review  
**Package:** `@weipertda/sigiljs`  
**Release target:** `0.18.0`

---

## Files Inspected

- `docs/known-limitations.md`
- `docs/experimental.md`
- `docs/stability.md`
- `README.md`
- `docs/internal/http-form-stabilization-evidence.md`
- `docs/internal/cli-compatibility-policy.md`
- `docs/internal/compile-posture-decision.md`

---

## Experimental Surface Status

These remain explicitly experimental:

| Surface | Public status |
|---------|---------------|
| `sigil` CLI | experimental, Bun-first, output/flags/exit semantics not frozen |
| `.sigil` text contract files | experimental / Bun-specific compatibility caveat |
| `httpContract()` | experimental; needs real route/framework evidence |
| `contract.toFormConstraints()` | experimental; needs real UI/form adapter evidence |

No experimental API was promoted.

---

## Known Limitation Coverage

Public limitations remain documented:

- CLI remains Bun-first and experimental
- `.sigil.js` loading is CWD-sensitive
- `.sigil` text loading is Bun-specific
- `httpContract()` remains experimental
- `toFormConstraints()` remains experimental
- `compile()` is an advanced contract method, not a standalone root compiler export
- TypeScript declarations are conservative and do not deeply infer every object-definition shape
- `mock()` values are structurally valid but not semantically meaningful
- `serialize()` validates but does not apply transforms
- no package split exists yet
- no database / ORM helper exists
- no AI provider SDK helper exists
- no framework or UI adapters exist

---

## Package Split Review

Public docs may mention future planned package boundaries such as `@sigil/cli`, `@sigil/http`, `@sigil/forms`, `@sigil/db`, `@sigil/ai`, and `@sigil/types`, but they are described as deferred or planned boundaries.

No public doc inspected claims that any `@sigil/*` package currently exists.

---

## Stale Claim Search

Targeted search covered:

- `httpContract()` accidentally marked stable
- `toFormConstraints()` accidentally marked stable
- CLI accidentally marked stable
- accidental `1.0.0` release claim
- accidental active `@sigil/*` package claims
- `dbContract` / `aiContract` promotion

Findings:

- no active stabilization claim found
- no 1.0 release claim found
- public hits for `@sigil/*` are future/deferred package-boundary discussions
- `dbContract()` appears only in internal/historical or no-helper context
- `aiContract()` appears only in internal scope/non-goal context

---

## Patch Decision

No patch was needed in this pass.

The public limitations posture is coherent for `0.18.0`.

---

## Blocker Assessment

No limitations or experimental-surface blocker remains for public `0.18.0` release prep.
