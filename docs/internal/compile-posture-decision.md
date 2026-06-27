# compile() Posture Decision

**Block:** Ergonomics Fix Pack  
**Pass:** 2 — `compile()` Posture Decision  
**Package:** `@weipertda/sigiljs`  
**Observed version:** `0.16.0`

---

## Decision

**Chosen option:** Option D — `compile()` becomes / remains a pre-1.0 stabilization candidate.

More specifically:

```txt
contract.compile() is an advanced public contract method.
The low-level compiler function is internal and is not a root package export.
No new compile implementation is added in this block.
```

---

## Findings

### Exists

`contract.compile()` exists on created contract objects in `src/sigil.js`:

```txt
compile: () => validator
```

It returns the cached validator function created when the contract is constructed.

### Export status

The low-level `compile` implementation from `src/core/compile.js` is not exported from the package root.

`src/index.js` exports:

- `Sigil`
- `sigil`
- helper constructors
- `httpContract()`
- `realType()` aliases
- `SigilValidationError`

It does **not** export a standalone `compile` function.

### Documented

`contract.compile()` is documented in:

- `docs/api.md`
- `docs/compiled-validators.md`
- `docs/stability.md`

This pass updated those docs to clarify advanced/public-vs-internal posture.

### Tested

`compile()` behavior is covered by existing tests:

- root export guard: `publicAPI.compile` is undefined
- contract method exists on created contracts
- `User.validator === User.compile()`
- repeated calls return the same cached reference
- low-level compiler has internal test coverage through internal test imports

### Type declarations

`index.d.ts` declares `SigilContract<T>.compile(): (value: unknown) => boolean`, which matches runtime contract objects.

No standalone root `compile` export is declared.

---

## Public Posture

`contract.compile()` is valid public API for advanced consumers who need a direct boolean validator reference.

Preferred user APIs remain:

- `check(value)` for boolean validation
- `parse(value)` for trusted data or thrown error
- `safeParse(value)` for non-throwing result objects
- `assert(value)` for assertion-style validation

`compile()` should not be promoted in quickstart examples.

---

## Internal Posture

The lower-level compiler function in `src/core/compile.js` remains internal implementation detail.

Do not document or export it as:

```txt
import { compile } from '@weipertda/sigiljs'
```

That import should remain invalid.

---

## Docs Updated

- `docs/stability.md`
  - clarifies `contract.compile()` as advanced contract-method access
  - marks low-level compiler functions as internal
  - removes the unresolved “decide whether” wording from required decisions
- `docs/api.md`
  - marks `contract.compile()` as `stable advanced`
  - clarifies it is a contract method, not a root compiler export
- `docs/compiled-validators.md`
  - adds explicit advanced/public vs internal compiler wording
- `docs/known-limitations.md`
  - adds limitation/posture note for `compile()`

---

## No Runtime Change

This pass intentionally added no source behavior changes.

No `compile()` implementation was added.

No export was added.

No type declaration change was required.

---

## Blocker Assessment

No blocker remains for `compile()` posture in this ergonomics block.

Before a future `1.0.0`, maintain this distinction:

```txt
contract.compile(): advanced public contract method
src/core/compile.js compile(): internal compiler implementation
```
