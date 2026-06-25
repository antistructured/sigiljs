# SigilJS

Executable data contracts for JavaScript runtime boundaries.

Define structure once, then enforce, transform, project, and prove it across runtime boundaries.

<img src="assets/images/sigiljs-logo-banner-v1.png" alt="SigilJS – Executable Data Contracts in Plain JS" width="100%" height="auto">

---

## Install

```bash
npm install @weipertda/sigiljs
```

or:

```bash
bun add @weipertda/sigiljs
```

---

## 30-second example

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const User = sigil.exact({
  id: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});

const result = User.safeParse(unknownInput);

if (result.success) {
  // result.data is trusted — id, email, role, age are verified
  saveUser(result.data);
} else {
  console.error(result.error.message);
}
```

---

## Five pillars

| Pillar | Purpose | Methods |
|--------|---------|---------|
| **Define** | Declare structure in JavaScript | `sigil()`, `sigil.exact()`, `optional()`, `oneOf()`, `union()` |
| **Enforce** | Validate runtime data | `parse()`, `safeParse()`, `assert()`, `check()` |
| **Transform** | Normalize trusted data | `transform()`, `pipe()`, `trim()`, `serialize()` |
| **Project** | Generate tooling artifacts | `toJSONSchema()`, `toTypeScript()`, `toOpenAPI()`, `toFormConstraints()`, `describe()` |
| **Prove** | Test contract behavior | `mock()`, `cases()`, `test()`, `diff()` |

---

## Why SigilJS

Data crosses runtime boundaries constantly — API responses, form submissions, database rows, AI outputs, CLI inputs. That data is untrusted until a contract enforces it.

SigilJS provides one contract object per shape that you can:
- enforce at any runtime boundary
- project into JSON Schema, TypeScript, OpenAPI, or form metadata
- use to generate test fixtures and run self-tests
- compare across versions with structural diffs

A sigil is not a schema. It is a contract object that lives in your JavaScript and travels with your data.

---

## Boundary examples

Use SigilJS anywhere data crosses a boundary: APIs, databases, forms, events, queues, webhooks, config files, local storage, plugin systems, and AI structured outputs.

### API response

```js
const ApiResponse = sigil.exact({
  id: String,
  name: String,
  role: oneOf('admin', 'user'),
});

const result = ApiResponse.safeParse(await response.json());

if (!result.success) {
  throw new Error(`Unexpected API shape: ${result.error.message}`);
}
return result.data;
```

### Database record

```js
const UserRecord = sigil.exact({
  id: String,
  email: String,
  role: oneOf('admin', 'user'),
  createdAt: String,
});

const user = UserRecord.parse(rowFromDatabase);
```

### Form submission

```js
const SignupForm = sigil.exact({
  name: String,
  email: String,
  plan: oneOf('free', 'pro'),
});

const result = SignupForm.safeParse(formValues);
if (!result.success) {
  showFieldError(result.error.path?.at(-1), result.error.message);
}
```

### AI structured output

```js
const LeadIntent = sigil.exact({
  name: String,
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

// JSON Schema bridges the contract to LLM structured output APIs
const schema = LeadIntent.toJSONSchema();
// Pass schema to your LLM provider as the output format

const result = LeadIntent.safeParse(llmOutput);
if (result.success) {
  handleTrustedLead(result.data);
}
```

More boundary recipes: [`docs/recipes/`](docs/recipes/index.md)

---

## Stable API quick map

```js
// Define
import { sigil, sigil.exact, optional, oneOf, union, pipe, trim } from '@weipertda/sigiljs';

// Enforce
contract.parse(value)         // throws on invalid
contract.safeParse(value)     // { success, data } | { success, error }
contract.assert(value)        // throws on invalid, returns void
contract.check(value)         // boolean

// Transform
contract.transform(fn)        // returns new contract with transform
contract.serialize(value)     // validates and returns

// Project
contract.describe()           // stable contract description model
contract.toJSONSchema()       // JSON Schema
contract.toTypeScript(name)   // TypeScript type declaration
contract.toOpenAPI()          // OpenAPI schema
contract.toFormConstraints()  // form field metadata (experimental)

// Prove
contract.mock()               // deterministic valid sample
contract.cases()              // { valid, invalid } test case sets
contract.test(cases)          // run and report contract behavior
contract.diff(other)          // structural change report
```

See [`docs/api.md`](docs/api.md) for the full API reference.

---

## Projection example

```js
const User = sigil({ id: String, name: String, email: String },
  { name: 'User', version: '1.0.0' });

User.toJSONSchema();
User.toTypeScript('User');
User.toOpenAPI();
User.describe();
```

---

## Contract diff example

```bash
sigil diff contracts/user-v1.sigil contracts/user-v2.sigil
```

```
Contract changes:

BREAKING
- required property: email

NON-BREAKING
- added property: displayName
```

---

## CLI (experimental)

SigilJS includes a dependency-free CLI for contract workflows. The CLI is **experimental** — commands may change before 1.0.0.

```bash
sigil check contracts/user.sigil data/user.json
sigil json-schema contracts/user.sigil
sigil types contracts/user.sigil User
sigil mock contracts/user.sigil
sigil cases contracts/user.sigil.js
sigil diff contracts/user-v1.sigil contracts/user-v2.sigil
```

The CLI supports both `.sigil` text files and `.sigil.js` JavaScript module files.

See [`docs/cli.md`](docs/cli.md) and [`examples/cli/`](examples/cli/README.md).

---

## Experimental features

The following APIs are experimental — they are tested and usable, but their surface may change before 1.0.0:

- **HTTP helpers** — `httpContract()` for framework-neutral request/response boundaries
- **Form constraints** — `contract.toFormConstraints()` for form field metadata
- **CLI workflows** — `sigil` bin for terminal contract workflows

See [`docs/experimental.md`](docs/experimental.md).

Future `@sigil/*` package extraction is intentionally deferred until the core API stabilizes at 1.0.0.

---

## Docs

**Getting started**
- [Public API](docs/api.md)
- [Quickstart](docs/quickstart.md)
- [Sigils](docs/sigils.md)
- [Stability Map](docs/stability.md)
- [Known Limitations](docs/known-limitations.md)

**Real-world recipes**
- [All recipes](docs/recipes/README.md)
- [Full Lifecycle](docs/recipes/full-lifecycle.md) — all five pillars in one workflow ⭐
- [API Route](docs/recipes/api-route.md)
- [LLM Output](docs/recipes/llm-output.md)
- [Form Submission](docs/recipes/form-submission.md)
- [Database Persistence](docs/recipes/database-persistence.md)
- [Contract Testing](docs/recipes/contract-testing.md)

**CLI**
- [CLI Reference](docs/cli.md)
- [CLI Overview](docs/cli/overview.md)
- [CLI Contract Files](docs/cli/contract-files.md)
- [CLI Projections](docs/cli/projections.md)
- [CLI Prove](docs/cli/prove.md)

**Boundaries**
- [HTTP Boundary Helpers](docs/projections/http.md)
- [Form Contracts](docs/forms/form-contracts.md)
- [Database Record Contracts](docs/database/record-contracts.md)
- [AI Structured Output](docs/projections/ai-structured-output.md)
- [Boundary Recipes](docs/recipes/index.md)

**Projections**
- [JSON Schema](docs/projections/json-schema.md)
- [OpenAPI](docs/projections/openapi.md)
- [Forms Projection](docs/projections/forms.md)
- [Testing Helpers](docs/projections/testing.md)

**Testing**
- [Contract-Driven Testing](docs/testing.md)

**Reference**
- [Experimental APIs](docs/experimental.md)
- [Package Split Policy](docs/package-split.md)
- [SigilJS vs Zod](docs/sigil-vs-zod.md)
- [Full docs index](docs/README.md)

---

## SigilJS vs Zod

Zod is a mature, expressive TypeScript-first validation library with a large ecosystem. SigilJS is a smaller executable data contract system for teams that want one readable runtime contract object they can enforce, transform, describe, and project across system boundaries without a TypeScript compiler dependency.

SigilJS does not claim to replace Zod. It is a focused alternative when you need runtime contracts with zero runtime dependencies, cross-boundary projection workflows, and a CLI for contract tooling.

---

## Status

Version `0.10.0`. Core API is stable. HTTP helpers, form constraints, and CLI are experimental.

See [`docs/stability.md`](docs/stability.md) and [`docs/known-limitations.md`](docs/known-limitations.md).

---

## License

MIT
