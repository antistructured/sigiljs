# Testing Surface Audit

Audit date: 2026-06-21  
Package: `@weipertda/sigiljs` 0.4.0  
Block: Contract Testing + Fixture Generation — Task 1  
Entry point: `src/index.js` → `package.json` `exports["."]`

## Scope

This audit inventories every testing-related symbol, method, and workflow currently present in `@weipertda/sigiljs`. It focuses on:

- `mock()` / `cases()`
- CLI testing commands
- Mentioned-but-absent future helpers (`fuzz`, `validCases`, `invalidCases`, `fixtures`, `contract.test`)
- Internal projection engines that generate testing artifacts
- Documentation coverage for each item

All exports flow through `src/index.js`. Internal symbols not re-exported there are classified as internal-only.

---

## 1. Current Testing-Related Public APIs

### `contract.mock(options?)`

| Attribute | Value |
|-----------|-------|
| Surface | Contract instance method |
| Status | **Stable** |
| Source | `src/projections/mock.js` via `src/sigil.js` wrapper |
| Exported | Yes — attached to every contract object; not a standalone module export |
| Documented | Yes — `docs/api.md`, `docs/projections/testing.md` |
| Tests | Yes — `tests/testing-helpers.test.js`, `tests/projection-compatibility.test.js` |
| Consumes `describe()` | Yes — wrapper calls `projectMock(sigil.describe(), { ...options, resolve })` |
| Touches parser internals | **No** — switches on description `kind` values only |
| Deterministic | Yes — strings → `'string'`, numbers → `0`, booleans → `true`, objects → required properties only, arrays → one mocked element, unions → first variant, references → resolved contract mock |

Implementation notes:  
- Unsupported kinds return `undefined`.  
- Unresolved named references return `undefined`.  
- Reference resolution is passed explicitly as a `resolve` option from the wrapper, keeping the projector decoupled from core.

---

### `contract.cases(options?)`

| Attribute | Value |
|-----------|-------|
| Surface | Contract instance method |
| Status | **Stable** |
| Source | `src/projections/cases.js` via `src/sigil.js` wrapper |
| Exported | Yes — attached to every contract object; not a standalone module export |
| Documented | Yes — `docs/api.md`, `docs/projections/testing.md` |
| Tests | Yes — `tests/testing-helpers.test.js`, `tests/projection-compatibility.test.js` |
| Consumes `describe()` | Yes — wrapper calls `projectCases(sigil.describe(), { ...options, resolve })` |
| Touches parser internals | **No** — switches on description `kind` values only |
| Deterministic | Yes — valid case comes from `mock(); invalid case uses fixed type/literal/object mutations` |

Implementation notes:  
- Returns `{ valid: [mockValue], invalid: [invalidValue] }`.  
- Invalid-value generation is a fixed, non-random mutation per kind.  
- Object invalid case removes the first required property.  
- Reference invalid case delegates to the referenced contract's `cases().invalid[0]`.  
- Like `mock()`, unsupported kinds fall back to `null`; unresolved references can produce `undefined`.

---

### `contract.test(cases?)`

| Attribute | Value |
|-----------|-------|
| Surface | Contract instance method |
| Status | **Stable** |
| Source | `src/testing/test-runner.js` via `src/sigil.js` wrapper |
| Exported | Yes — attached to every contract object; not a standalone module export |
| Documented | Yes — `docs/api.md`, `docs/projections/testing.md` |
| Tests | Yes — `tests/public-api.test.js`, `tests/testing-helpers.test.js` |
| Consumes `describe()` | Indirectly — when called with no arguments, defaults to `contract.cases()` |
| Touches parser internals | **No** — runs existing validators only |
| Deterministic | Yes — results depend solely on contract behavior and deterministic case input |

Implementation notes:  
- Returns a plain report object.  
- Never throws.  
- Custom case objects can be passed in.

---

### CLI `sigil mock <file>`

| Attribute | Value |
|-----------|-------|
| Surface | CLI command |
| Status | Stable (shipped) |
| Source | `src/playground.js` → `projectMock` via contract method |
| Exported | Yes — documented in `docs/cli.md` |
| Documented | Yes |
| Tests | CLI coverage exists via `tests/cli.test.js` |
| Consumes `describe()` | Indirectly — loads `.sigil` file into contract, then calls `contract.mock()` |

---

## 2. Mentioned-but-Absent Future Testing APIs

These are referenced in current docs but **not implemented** in this package.

| Symbol | Where referenced | Status | Notes |
|--------|-----------------|--------|-------|
| `validCases(options?)` | Not directly referenced | **Absent** | Not implemented; `cases().valid` is the current stable path |
| `invalidCases(options?)` | Not directly referenced | **Absent** | Not implemented; `cases().invalid` is the current stable path |
| `contract.testHelper(...)` | Not directly referenced | **Absent** | Not implemented |
| `fixtures()` | `docs/projections/testing.md` | **Absent** | Not implemented; current supported surface is `mock()`, `cases()`, and `test()` |
| `fuzz(options?)` | `docs/projections/testing.md` | **Absent** | Described as future `@sigil/testing` scope; not a current method |

---

## 3. Internal Projection Engines (Testing)

These are exported inside `src/` but **not** re-exported through `src/index.js`.

| Symbol | Source | Purpose |
|--------|--------|---------|
| `projectMock(description, options)` | `src/projections/mock.js` | Internal mock engine; accepts description and `resolve` option |
| `projectCases(description, options)` | `src/projections/cases.js` | Internal test-cases engine; wraps `projectMock` and adds invalid-value mutation |
| `runContractTests(contract, cases)` | `src/testing/test-runner.js` | Internal test runner; accepts a contract and case objects, returns a plain report |

All three are modular, isolated modules. They consume description objects or contract methods only and could be moved under a future testing helper package boundary without changing their input contract.

---

## 4. Documentation Coverage

| Item | Documented in `docs/api.md` | `docs/projections/testing.md` | `docs/experimental.md` | `docs/cli.md` |
|------|:---:|:---:|:---:|:---:|
| `contract.mock()` | Yes | Yes | No | Yes |
| `contract.cases()` | Yes | Yes | No | Yes |
| `contract.test()` | Yes | Yes | No | No |
| CLI `mock` | Implied (CLI section) | No | No | Yes (`mock` command) |
| `projectMock` (internal) | No | No | No | No |
| `projectCases` (internal) | No | No | No | No |
| `runContractTests` (internal) | No | No | No | No |

Stable vs. experimental classification is already consistent in `docs/api.md` and `docs/experimental.md`. No testing helper is currently classified experimental.

---

## 5. Current Test Coverage

| Test file | What it covers |
|-----------|----------------|
| `tests/testing-helpers.test.js` | `mock()` primitive samples, arrays/objects, literal unions, primitive unions, named-sigil resolution; `cases()` valid/invalid for object and primitive contracts |
| `tests/projection-compatibility.test.js` | Snapshot-style expectations for `mock()` and `cases()` as part of the broader projection suite |
| `tests/cli.test.js` | CLI `mock` command workflow |
| `tests/public-api.test.js` | `contract.test()` generated cases, custom cases, failure reporting, deterministic output |

Missing coverage (not a bug for this audit, noted for future Tasks 3–6):  
- No dedicated fixture format or export helper test yet.
- No cross-contract `cases()` with complex nested references test.
- No optional-field inclusion mode test.

---

## 6. Stable / Experimental / Internal Classification

| Surface | Classification | Rationale |
|---------|---------------|-----------|
| `contract.mock()` | **Stable** | Documented, tested, deterministic, and classified stable in 0.4.0 public API |
| `contract.cases()` | **Stable** | Documented, tested, deterministic, and classified stable in 0.4.0 |
| `contract.test()` | **Stable** | Documented, tested, plain output, added after stable contract surface was ready |
| CLI `sigil mock` | **Stable** | Documented CLI command backed by stable contract method |
| `projectMock()` | **Internal** | Not in `src/index.js`; used only as the projector implementation behind the contract method |
| `projectCases()` | **Internal** | Same as above |
| `runContractTests()` | **Internal** | Same as above |
| `fuzz()` / `fixtures()` | **Absent** | Not implemented; exist only as future scope notes |

---

## 7. Architecture Compliance Check

| Requirement | `mock()` | `cases()` | `test()` |
|-------------|:---:|:---:|:---:|
| Consume `contract.describe()` | Yes | Yes | Indirectly (via `cases()`) |
| Do not inspect parser internals | Yes | Yes | Yes |
| Deterministic by default | Yes | Yes | Yes |
| Resolver passed explicitly from wrapper | Yes | Yes | N/A |
| Isolated projector module | Yes | Yes | Yes |

All methods comply with the required architecture rule: projection functionality must consume the stable description model (`contract.describe()`) and must not inspect parser `ast` internals.

---

## 8. Findings

1. **Testing surface is small and clean.** `mock()`, `cases()`, and `test()` are the only public testing helpers. No undocumented testing API is present.
2. **All three are stable in 0.4.0.** They are classified stable, documented, and have passing tests. They are the strongest foundation for the testing block.
3. **No `src/testing/` directory existed prior to this block.** Testing-related source now also includes `src/testing/generate.js`, `src/testing/cases.js`, and `src/testing/test-runner.js`.
4. **Future helpers are documented as future only.** `docs/projections/testing.md` explicitly frames fuzzing as future `@sigil/testing` scope. No unstable method is accidentally exposed.
5. **CLI testing workflow is present.** `sigil mock` is already a first-class CLI command.
6. **No accidental testing exports.** `src/index.js` does not export internal projector engines or test runners directly.

---

## 9. Risks for the Block

1. **Unsupported-kind fallbacks are inconsistent.** `mock()` returns `undefined` and `cases()` returns `null`/`undefined` for unsupported or unresolved descriptions. Future Tasks should standardize or explicitly document these fallbacks.
2. **Optional fields are omitted by default in mocks.** This is intentional and documented, but any new `fixtures()` or `fuzz()` helpers will need to decide whether to include them.
3. **`contract.test()` report shape is intentionally minimal.** Users who want richer diagnostics will need to layer their own checks on top of `cases()` or write custom test suites.

---

## 10. Recommendations

1. **Keep `mock()`, `cases()`, and `test()` as the stable testing core.** They are already in the right architectural shape.
2. **Do not add `fixtures()`.** The `mock()` + `cases()` + `test()` surface is sufficient; `fixtures()` would only add naming surface area without new behavior.
3. **Build any future testing helpers (`fuzz`, custom fixture exporters, etc.) as additive methods or files that consume `describe()`**, following the same projector-module pattern as existing helpers.
4. **Do not expose internal projector engines (`projectMock`, `projectCases`, `runContractTests`) as public exports yet.** They are already in the correct internal module shape.
5. **Add deeper `cases()` coverage only when new invalid-case types are added.** Do not expand the audit beyond current surface.
