# Testing Extraction Readiness

Audit date: 2026-06-21  
Package: `@weipertda/sigiljs` 0.5.0 (target)  
Theme: Contract testing and fixture generation

## 1. Current Package Name

`@weipertda/sigiljs`

Brand: SigilJS  
Scope: Single package with Bun-first, ESM, pure JavaScript, zero runtime dependencies.

## 2. Testing APIs

| API | Surface | Notes |
|-----|---------|-------|
| `contract.mock(options?)` | Instance method | Deterministic valid sample generator |
| `contract.cases(options?)` | Instance method | Deterministic valid/invalid case generator |
| `contract.test(cases?)` | Instance method | Plain contract behavior report |
| `projectMock(description, options)` | Internal projection | Implementation behind `contract.mock()` |
| `projectCases(description, options)` | Internal projection | Implementation behind `contract.cases()` |
| `runContractTests(contract, cases)` | Internal helper | Implementation behind `contract.test()` |

## 3. Stable Testing APIs

| API | Status | Rationale |
|-----|--------|-----------|
| `contract.mock()` | **Stable** | Documented, tested, deterministic, small surface |
| `contract.cases()` | **Stable** | Documented, tested, deterministic invalid generation |
| `contract.test()` | **Stable** | Plain report shape, tested with generated and custom cases |

## 4. Experimental Testing APIs

None.

All testing APIs currently exposed outside `src/` are classified stable. No experimental testing helper is exported.

## 5. Source Dependency Model

Current testing flow:

```
contract
  → describe()
    → projectMock() / projectCases()
      → valid / invalid samples
        → contract.test() or caller tests
```

Testing utilities consume only:
- `contract.describe()` (stable public description model)
- `contract.check()` (stable validator)
- internal `resolve` option passed from wrapper to projector

They do not touch parser internals, AST nodes, or compiled validator internals.

## 6. mock() Readiness

- Returns one deterministic valid sample.
- Omits optional fields by default.
- Resolves named sigils when registry / resolver is available.
- Tested for primitives, objects, arrays, unions, literals, references, exact mode.
- CLI `sigil mock` already ships and passes tests.

Status: **Ready** as a stable core testing helper.

## 7. cases() Readiness

- Returns labeled valid case and labeled invalid case(s).
- Invalid cases cover common contract failures:
  - missing required property
  - wrong primitive type
  - invalid literal
  - invalid union value
  - invalid array item
  - extra key in exact object
  - nested property failure
- Deterministic and non-random.
- Valid cases are validated by `contract.check()`.

Status: **Ready** as a basic deterministic case generator. Not exhaustive.

## 8. test() Readiness

- Works with generated `cases()` out of the box.
- Accepts custom cases.
- Returns a plain report object.
- Never throws.
- Deterministic re-runs produce identical reports.

Status: **Ready** as a lightweight contract behavior report helper.

## 9. Future Fuzzing

Fuzzing is explicitly out of scope for this block.

Current docs state:
- Not full fuzzing.
- No random generation.
- Future `@sigil/testing` scope notes exist but are not implemented.

Future considerations if extraction is ever revisited:
- seeded random generation
- boundary values
- nested depth controls
- optional-field inclusion modes
- invalid case categories
- shrinking failing cases

## 10. Recommended Extraction Decision

**Recommendation: Stay single package.**

Rationale:
- Testing APIs are small and stable, but they are still young in real usage.
- `mock()`, `cases()`, and `test()` are tightly coupled to the contract model; extraction would require a stable, published contract model boundary first.
- No internal packaging work has been done to isolate a testing boundary yet.
- The current single-package shape lets testing APIs evolve quickly without a package-boundary review burden.
- No evidence yet supports the overhead of `@sigil/testing`:
  - No significant user demand for separate installation.
  - No internal consumers that would benefit from independent versioning.
  - No demonstrated build or tree-shaking benefit from extraction.

Trigger conditions to revisit extraction:
1. Testing API surface grows substantially beyond three methods.
2. Users request separate installation or independent versioning.
3. Internal bundle analysis shows meaningful deduplication or runtime savings from a split.
4. The stable contract description model has been externally published and widely adopted.

Until then, keep testing helpers inside `@weipertda/sigiljs` and maintain the `describe()` → testing helper boundary as the stable seam.
