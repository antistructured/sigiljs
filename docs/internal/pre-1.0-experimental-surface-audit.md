# Pre-1.0 Experimental Surface Audit

**Package:** `@weipertda/sigiljs` v0.12.0  
**Pass:** 3 — Experimental Surface Audit

---

## Scope

Audited experimental surfaces that are public, documented, or adoption-relevant before a future 1.0 freeze.

Files inspected:

- `docs/experimental.md`
- `docs/stability.md`
- `README.md`
- `docs/projections/http.md`
- `docs/projections/forms.md`
- `docs/forms/`
- `docs/cli.md`
- `docs/cli/`
- `docs/known-limitations.md`
- `src/http.js`
- `src/projections/forms.js`
- `src/playground.js`
- `package.json`
- prior internal readiness/containment reports in `docs/internal/`

---

## Experimental Surface Matrix

| Surface | Current status | Public exposure | Docs status | Test status | Risk level | Recommendation |
|---------|----------------|-----------------|-------------|-------------|------------|----------------|
| HTTP helpers (`httpContract`) | experimental | named package export | clearly marked experimental | covered by public + HTTP tests | medium/high | keep experimental through 1.0 unless adapter usage proves shape |
| Form constraints (`toFormConstraints`) | experimental | contract method | clearly marked experimental | covered by forms projection tests | medium | keep experimental until real UI/form usage validates output shape |
| CLI workflows (`sigil` bin) | experimental | package `bin` entry | documented, but some docs need status/version refresh | covered by CLI workflow tests | high | keep exposed as experimental; do not stabilize yet |
| `.sigil` file format | experimental | CLI input format | documented | covered by CLI tests | medium/high | keep experimental until syntax and loading story are finalized |
| JS module contract loading | experimental | CLI input workflow | documented in CLI subdocs; main `docs/cli.md` needs refresh | covered by CLI tests | medium | keep experimental; document CWD-relative behavior |
| TypeScript declarations | public support, conservative | `index.d.ts`, package metadata | documented | `check:types` smoke tests | low/medium | keep shipped; improve inference only after usage |
| `mock()` semantic quality | stable structural helper with limitation | contract method | documented limitation | covered by tests | medium | keep as structural proof helper; do not claim semantic fixtures |

---

## Surface Details

### HTTP helpers

Current status:

- `httpContract()` is exported from `src/index.js`.
- It is declared in `index.d.ts` with `@experimental` comments.
- Docs label it experimental.
- It supports request parts, response status maps, OpenAPI projection, and handler wrapping.

Known limitations/risk:

- Framework adapter patterns are not proven.
- `handler()` uses the primary response contract only; `responses` are for parsing/projection paths.
- Request/response input shapes have already evolved during 0.x.
- Safe parse request failures may be plain `Error` objects with `.parts`.

Real-world usage needed:

- One or more real route integrations in common runtimes/frameworks.
- Confirmation that request parts and response-map semantics fit typical handlers.
- Feedback on OpenAPI operation/path-item shapes.

Stabilization would be justified by:

- Multiple real integrations using current input/output shape without compatibility pressure.
- Clear adapter guidance and non-goals.
- Frozen error/result shapes.

Removal/deferment would be justified by:

- Framework integrations needing incompatible shapes.
- HTTP helper creating confusion relative to direct contract usage.

### Form constraints

Current status:

- `toFormConstraints()` is available on contract objects.
- It returns `{ fields: { ... } }` with nested field metadata.
- Docs label it experimental.
- `index.d.ts` marks it `@experimental`.

Known limitations/risk:

- Output shape is UI-adapter-sensitive.
- Metadata customization is limited.
- Non-object contracts return `{ fields: {} }`.
- Real UI framework usage is not proven.

Real-world usage needed:

- At least one form renderer or adapter consuming the shape.
- Feedback on labels, nested objects, arrays, select options, and validation message needs.

Stabilization would be justified by:

- Stable field-shape needs across at least one real UI.
- Clear limits: metadata only, no DOM/framework rendering.

Removal/deferment would be justified by:

- Output shape proving too framework-specific.
- Better handled in future package after core 1.0.

### CLI workflows and `.sigil` format

Current status:

- Package exposes `"bin": { "sigil": "./src/playground.js" }`.
- CLI is Bun-native and dependency-free.
- Commands include validation, projections, prove helpers, diff, and form projection.
- `.sigil` text files and JS module contract files are supported.

Known limitations/risk:

- CLI has no confirmed real-world usage.
- `.sigil` loading is Bun-specific.
- JS module loading uses CWD-relative URL resolution.
- Bin name must be final before 1.0 if it remains exposed.
- CLI behavior can imply stability beyond the library API.

Real-world usage needed:

- Actual contract file workflows outside tests.
- Feedback on command names, flags, output formats, exit codes, and `.sigil` syntax.

Stabilization would be justified by:

- Demonstrated usage of current command set.
- Frozen command/output/exit-code contracts.
- Explicit compatibility policy for `.sigil` files.

Removal/deferment would be justified by:

- CLI distracting from core library 1.0.
- Need for a separate CLI package after core stabilizes.

### TypeScript declarations

Current status:

- `index.d.ts` is shipped and package metadata points to it.
- Type smoke tests pass.
- Declarations are conservative by design.

Known limitations/risk:

- No deep object-definition inference.
- Callers should provide generics for typed `parse()` output.
- Some runtime helper errors are typed as `unknown` for accuracy.

Real-world usage needed:

- Feedback from TypeScript consumers on ergonomics.
- Evidence before adding complex inference.

Stabilization would be justified by:

- No missing declaration errors in consumers.
- Conservative model remains accurate.

### `mock()` semantic quality

Current status:

- `mock()` is tested and documented as deterministic structural data.
- It is not a semantic fixture generator.

Known limitations/risk:

- Values like `'string'`, `0`, and first literal choices are valid but not domain-realistic.

Real-world usage needed:

- Feedback on whether deterministic structural samples are enough for contract tests.

Stabilization would be justified by:

- Keeping the promise narrow: structurally valid samples only.

---

## Recommended Stabilization Blockers

Do not stabilize before 1.0 without:

- HTTP: real framework/runtime usage and frozen request/response result shapes.
- Forms: real UI/form consumption and stable field metadata needs.
- CLI: real command-line workflow usage, final bin-name decision, and frozen exit/output contracts.
- `.sigil`: syntax/file-loading compatibility policy.
- TypeScript: consumer feedback before adding advanced inference.
- Prove: explicit wording that `mock()` is structural, not semantic.

---

## Conclusion

No experimental surface should be promoted in this block.

Recommended pre-1.0 posture:

- Keep stable core small.
- Keep HTTP helpers, form constraints, CLI workflows, and `.sigil` file format experimental.
- Continue shipping TypeScript declarations conservatively.
- Keep `mock()` stable only as a structural proof helper with documented limitations.
