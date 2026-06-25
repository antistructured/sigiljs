# Release Notes Draft — v0.10.0

**Theme:** Executable data contracts across runtime boundaries

---

## Highlights

SigilJS v0.10.0 is the public adoption hardening milestone. The core API has been stable for several months. This release adds extensive boundary examples, experimental CLI workflows, and a hardened docs/README surface.

---

## Stable core (unchanged)

The five-pillar stable API is unchanged:

- **Define** — `sigil()`, `sigil.exact()`, `optional()`, `oneOf()`, `union()`, `pipe()`, `trim()`
- **Enforce** — `parse()`, `safeParse()`, `assert()`, `check()`
- **Transform** — `transform()`, `serialize()`, `withMetadata()`
- **Project** — `toJSONSchema()`, `toTypeScript()`, `toOpenAPI()`, `describe()`
- **Prove** — `mock()`, `cases()`, `test()`, `diff()`

See [`docs/stability.md`](stability.md) for the full stable API list.

---

## Experimental features

The following APIs are exported, tested, and documented — but may change before 1.0.0:

### HTTP helpers

- `httpContract()` — framework-neutral request/response boundary contracts
- Supports `params`, `query`, `headers`, `body` request parts
- Multi-status `responses` map
- `toPathItem()` for OpenAPI path item projection
- `summary` and `operationId` metadata

### Form constraints

- `contract.toFormConstraints()` — projects object contracts into plain form field metadata
- Returns `{ fields: { [key]: { name, path, type, required, label } } }`
- Supports nested objects, arrays, literal union selects, labels

### CLI workflows

- `sigil` bin — dependency-free CLI for contract workflows
- Commands: `check`, `parse`, `safe-parse`, `describe`, `json-schema`, `types`, `openapi`, `form`, `mock`, `cases`, `test`, `diff`
- Supports `.sigil` text files and `.sigil.js` JS module files
- `--export <name>` for named exports
- `--out <path>` for file output

---

## Boundary examples

This release adds examples for all major boundary types:

- **AI** — validate LLM structured output and tool call results
- **HTTP** — request/response contracts, multi-status, OpenAPI projection
- **Forms** — validation, projection, mock, test — 11 examples
- **Database** — record, insert, update, diff, prove — 14 examples
- **CLI** — JS module contract files for terminal workflows

---

## Known limitations

See [`docs/known-limitations.md`](known-limitations.md) for the full list.

Key limitations:
- `.sigil` template-literal CLI loading is Bun-specific
- JS module CLI loading relies on CWD-relative URL resolution
- HTTP helpers, form constraints, and CLI are experimental
- No `@sigil/*` package extraction

---

## Upgrade notes

- Version bumped from `0.4.0` to `0.10.0` to reflect the milestone scope
- `package.json` description updated: `"Executable data contracts for JavaScript runtime boundaries."`
- README restructured for clearer first-time user experience
- `aiSchema()` removed from README examples (was never a public export)

---

## Verification

- Tests: 493 pass, 0 fail
- Lint: exit 0
- npm pack: clean, 246 files
- Runtime dependencies: 0
