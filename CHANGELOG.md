# Changelog

All notable changes to `@weipertda/sigiljs` are documented here.

This format follows [semantic-release](https://semantic-release.gitbook.io/) conventions adapted for manual maintenance.

## 0.4.0

### Added

- Public API stability classification for all exported symbols.
- `docs/internal/public-export-audit.md` enumerating every public and internal export.
- `docs/internal/projection-api-freeze.md` documenting projection input/output contracts, determinism, and error behavior.
- `docs/experimental.md` index of experimental APIs.

### Changed

- `docs/api.md` now includes a stable vs. experimental status table for exports, contract methods, utilities, and error types.
- `docs/sigils.md` restructured to present `sigil()` as the primary API, `Sigil`\`...\` as the template alternative, and `S`/`T` as legacy aliases.
- `docs/projections.md` expanded to cover `describe()`, `toJSONSchema()`, `toTypeScript(name)`, and `toOpenAPI()` with explicit behavior contracts.
- `docs/projections/testing.md` updated to document `mock()` and `cases()` as stable helpers.
- `docs/projections/forms.md` marked experimental with an explicit stability warning.
- `docs/projections/http.md` marked experimental with an explicit stability warning.
- `docs/api.md` marks `httpContract` and `toFormConstraints()` as **Experimental. May change before 1.0.0.**

### Notes

- Package name remains `@weipertda/sigiljs`. No package split.
- `mock()` and `cases()` are stable in 0.4.0 because their tests and docs are strong. Additional testing helpers remain future `@sigil/testing` scope.
- `httpContract()` is exported intentionally but is not yet validated as a stable public boundary.
- `toFormConstraints()` is exported intentionally but is still experimental.
