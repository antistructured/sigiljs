# Changelog

All notable changes to `@weipertda/sigiljs` are documented here.

This format follows [semantic-release](https://semantic-release.gitbook.io/) conventions adapted for manual maintenance.

## 0.18.0

### Added in v0.18.0

- Public `0.x` release notes for the `0.18.0` release line.
- Public release prep reports covering carry-forward reconciliation, release scope, package metadata, README/docs polish, quickstart review, package contents, limitations, and release gates.

### Changed in v0.18.0

- Prepared package metadata for a serious public `0.x` release while keeping the package name `@weipertda/sigiljs`.
- Updated active public version labels to `0.18.0`.
- Polished README status and stable API quick-map wording for public package consumers.
- Improved docs navigation by fixing the TypeScript guide link in the docs index.
- Excluded `docs/internal/` from the npm package while keeping public docs and examples included.
- Kept `trials/` as repository-only validation evidence rather than npm package content.

### Notes

- Release theme: **Public 0.x release prep**.
- SigilJS is ready for broader public `0.x` usage feedback, but this is not a `1.0.0` release.
- Runtime dependencies remain zero.
- No package split occurred.
- CLI workflows, `httpContract()`, and `toFormConstraints()` remain experimental.
- Known pre-1.0 blockers remain: real CLI field usage, real HTTP/runtime usage, real form/UI usage, final `.sigil` compatibility policy, and broader public feedback.

## 0.4.0

### Added in v0.4.0

- Public API stability classification for all exported symbols.
- `docs/internal/public-export-audit.md` enumerating every public and internal export.
- `docs/internal/projection-api-freeze.md` documenting projection input/output contracts, determinism, and error behavior.
- `docs/experimental.md` index of experimental APIs.

### Changed in v0.4.0

- `docs/api.md` now includes a stable vs. experimental status table for exports, contract methods, utilities, and error types.
- `docs/sigils.md` restructured to present `sigil()` as the primary API, `Sigil`\\`...\\` as the template alternative, and `S`/`T` as legacy aliases.
- `docs/projections.md` expanded to cover `describe()`, `toJSONSchema()`, `toTypeScript(name)`, and `toOpenAPI()` with explicit behavior contracts.
- `docs/projections/testing.md` updated to document `mock()` and `cases()` as stable helpers.
- `docs/projections/forms.md` marked experimental with an explicit stability warning.
- `docs/projections/http.md` marked experimental with an explicit stability warning.
- `docs/api.md` marks `httpContract` and `toFormConstraints()` as **Experimental. May change before 1.0.0.**

### Notes in v0.4.0

- Package name remains `@weipertda/sigiljs`. No package split.
- `mock()` and `cases()` are stable in 0.4.0 because their tests and docs are strong. Additional testing helpers remain future `@sigil/testing` scope.
- `httpContract()` is exported intentionally but is not yet validated as a stable public boundary.
- `toFormConstraints()` is exported intentionally but is still experimental.

## 0.5.0

### Added in v0.5.0

- Deterministic value generator (`src/testing/generate.js`) for valid samples.
- Expanded invalid case generation covering missing properties, wrong primitive types, invalid literals, invalid unions, invalid array items, exact-object extra keys, and nested failures.
- `contract.test()` helper for running generated or custom cases and returning a plain report.
- Testing docs (`docs/testing.md`) explaining contract-driven testing, deterministic generation, and limits.
- Testing examples (`examples/testing/mock-user.js`, `examples/testing/generated-cases.js`, `examples/testing/bun-test-example.test.js`, `examples/testing/api-contract-cases.js`, `examples/testing/ai-output-cases.js`).
- `docs/internal/testing-extraction-readiness.md` recommending no package split yet.

### Changed

- `mock()` defaults updated so numbers map to `0` and bigints map to `0n` instead of `1` / `1n`.
- `cases()` invalid entries now use `{ label, value, expectedPath? }` shape consistently.
- `docs/projections/testing.md` updated for stabilized testing surface and updated examples.

### Notes in v0.5.0

- Release theme: **Contract testing and fixture generation**.
- This is a meaningful category expansion, not just documentation hardening.
- Extraction of `@sigil/testing` is not recommended yet; testing helpers remain in the single package.
