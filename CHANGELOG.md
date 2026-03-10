# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.0.1] — 2026-03-10

### Added
- **`realType(value, opts?)`** — cross-realm-safe runtime type detection fixing all `typeof` gaps (`null`, `array`, `nan`, `map`, `set`, `date`, `regexp`, `promise`, `asyncfunction`, `generatorfunction`, `asyncgeneratorfunction`, `weakmap`, `weakset`); extensible via hook array.
- **`Sigil` / `T` / `S` tagged template** — compile a schema string into a fast, memoized validator object exposing `.check()` and `.assert()`.
- **Schema language** — primitives, literals, unions (`|`), arrays (`[]`), optionals (`?`), and nested object schemas.
- **`SigilValidationError`** — structured error with `code`, `path`, `expected`, and `actual` properties.
- **Two-level memoization** — Sigil-level cache (identical schema strings share one object reference) and compiled-validator cache (structural AST identity).
- **Partial evaluation** — literal unions optimize to `Set` membership checks; pure primitive unions skip `realType` entirely; object hints pre-compute required/optional key sets.
- **CLI playground** — `bun run src/playground.js '<json>' '<schema>'` for shell-level validation.

### Engineering
- Single-source-of-truth `realType` implementation in `src/core/realType.js`.
- Module-scope frozen `Set` for O(1) tokenizer punctuation lookup.
- Array-join accumulation in tokenizer hot string loops (no `+=` reallocation).
- Module-scope frozen `Set` for parser primitive name lookup (not rebuilt per call).
- Sigil objects are `Object.freeze()`-d — immutable public API surface.
- `Error.captureStackTrace` on `SigilValidationError` for clean V8/Bun stack traces.
- Full `package.json` with `exports`, `files`, `sideEffects: false`, `engines`, `keywords`.
