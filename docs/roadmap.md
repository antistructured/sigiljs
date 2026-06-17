# SigilJS Project Roadmap

This document outlines the milestones and roadmap towards a stable `v1.0.0` release.

---

## v0.0.x: Foundations & Groundwork [Completed]
*   [x] **Parser Stability**: Robust tokenization and AST parsing for basic types, nested objects, optionals, and arrays.
*   [x] **Documentation Hub**: Reference manuals for core features.
*   [x] **Examples & Playground**: CLI utility for testing type expressions.
*   [x] **Packaging & Project Hygiene**: Clean npm/Bun packages with zero runtime dependencies.

---

## v0.1.x: Compiler & Path-Aware Diagnostics [Completed / Current]
*   [x] **Compiled Validators**: High-performance pipeline compiled to optimized JS closures, bypassing AST lookups on validation paths.
*   [x] **Exact Object Mode**: Recursive support for strict object schema verification.
*   [x] **Reusable Named Sigils**: Composable, registered types with support for recursive/circular schemas.
*   [x] **Stronger Assert Errors**: Fully path-aware diagnostic exceptions (`SigilValidationError`) indicating exact paths (`["user", "age"]`) and types (`expected`/`actual`).

---

## v0.2.x: Advanced Composition & Registry Tools [Next Focus]
*   [ ] **Named Sigil Collections**: Grouping/importing collections of custom types to easily share domain vocabularies.
*   [ ] **Better Composition API**: Fluent operators for extending and modifying existing sigils.
*   [ ] **Canonical Schema Caching**: Global structural canonicalization cache for deduplicating syntactically identical sigils across different packages.

---

## v0.3.x: CLI Upgrades & Optimization Hot-Paths
*   [x] **Benchmark Suite**: Establish comparative execution times against Zod and handwritten Javascript.
*   [ ] **CLI Enhancements**: Enhanced formatting and interactive modes for the playground binary.
*   [ ] **V8 Optimizer Alignment**: Fine-tune code-generation functions to maximize JIT compiler inline caching.

---

## v1.0.0: Production-Ready Release
*   [ ] **Stable Grammar & AST Spec**: Lock the DSL grammar rules against breaking additions.
*   [ ] **API Freeze**: Lock core exports (`Sigil`, `S`, `T`, `realType`) and instance methods.
*   [ ] **Extensive Stress-Testing**: End-to-end production verification.
