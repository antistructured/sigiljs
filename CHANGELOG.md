# Changelog

## 0.3.0

### Added

- Published package as `@weipertda/sigiljs`
- CLI contract workflows (`check`, `parse`, `safe-parse`, `describe`, `json-schema`, `types`, `openapi`, `mock`, `diff`)
- File-based `.sigil` and `.json` workflows
- Projection commands in code and CLI
- Contract diff workflow
- Category demo

### Changed

- Updated public positioning around executable data contracts
- Improved CLI output for human and `--json` automation modes

### Notes

- Package remains a single package.
- Future `@sigil/*` package split is deferred until projection APIs stabilize.

## 0.4.0

### Added

- Projection error handling with structured `SigilProjectionError` output
- Projection snapshot tests for JSON Schema, TypeScript, and OpenAPI outputs
- Internal projection module separation

### Changed

- Hardened JSON Schema projection behavior
- Hardened TypeScript projection behavior
- Hardened OpenAPI projection behavior

### Notes

- Package remains a single package.
- Projection extraction readiness report documents when `@sigil/*` separation may become appropriate.
