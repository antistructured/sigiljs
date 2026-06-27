# Pre-1.0 Docs Stability Consistency Audit

**Package:** `@weipertda/sigiljs` v0.12.0  
**Pass:** 6 — Docs Stability Consistency Audit

---

## Scope

Audited public documentation for stable/experimental/deferred wording before a future 1.0 freeze.

Files inspected:

- `README.md`
- `docs/README.md`
- `docs/api.md`
- `docs/stability.md`
- `docs/experimental.md`
- `docs/known-limitations.md`
- `docs/quickstart.md`
- `docs/recipes/`
- `docs/ai/`
- `docs/projections/http.md`
- `docs/projections/forms.md`
- `docs/forms/`
- `docs/database/`
- `docs/cli.md`
- `docs/cli/`
- `examples/README.md`
- `examples/workflows/*/README.md`

---

## Consistency Checks

| Check | Result | Notes |
|-------|--------|-------|
| Stable APIs presented as stable/stable candidates | pass with fixes | `docs/api.md` now says stable candidates for 0.12.0 pre-1.0 |
| Experimental APIs labeled experimental | pass | HTTP, forms, CLI are consistently labeled |
| Deferred package extraction clear | pass | README/stability/known-limitations mention deferral |
| No docs claim `@sigil/*` packages exist | pass with caveat | Future package docs are framed as planned/deferred; old package split docs remain historical/planning docs |
| No docs overclaim TypeScript inference | pass | TypeScript declarations are documented as conservative |
| No docs overclaim CLI stability | pass with fix | Main CLI doc had stale JS module wording; fixed |
| No docs overclaim HTTP/form stability | pass | HTTP and forms projection docs start with experimental status |
| README remains concise | pass | Only status/version wording changed |

---

## Fixes Made

- `docs/experimental.md`: updated “Current experimental APIs” version from `0.4.0` to `0.12.0`.
- `docs/api.md`: changed top-level “Stable (0.4.0)” wording to “Stable candidates (0.12.0)” and updated experimental version label.
- `docs/cli.md`: replaced stale statement that JavaScript module contract files are not part of the CLI workflow; docs now mention `.sigil.js`, default export, single named export auto-selection, and `--export <name>`.
- `README.md`: updated status line from `0.10.0` to `0.12.0` and described the core API as a stable candidate for future 1.0.

---

## Remaining Documentation Watchpoints

- `docs/package-split-readiness.md` discusses possible future `@sigil/*` package names and includes example imports from hypothetical split packages. This is acceptable as planning material, but public docs should continue to state that no `@sigil/*` packages exist yet.
- `docs/stability.md` should be expanded in Pass 9 to define what “stable core candidate” and “future 1.0 surface” mean.
- Public docs should continue avoiding claims of full TypeScript inference.
- CLI docs should keep command/output stability warnings until real usage justifies stabilization.

---

## Conclusion

Docs are broadly consistent after small fixes.

No experimental API was promoted. No new API was introduced. No package extraction language was changed into a current package claim.
