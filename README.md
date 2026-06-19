# SigilJS

Executable data contracts for JavaScript.

Define structure once. Project it everywhere.

SigilJS turns JavaScript data structures into executable contracts that can validate, transform, describe, and project runtime data across system boundaries.

A sigil is not a schema. It is a contract object.

<img src="assets/images/sigiljs-logo-banner-v1.png" alt="SigilJS – Executable Data Contracts in Plain JS" width="100%" height="auto">

## Install

```bash
bun add sigil
```

or:

```bash
npm install sigil
```

## Define / Enforce / Transform / Project

SigilJS gives you one contract object you can use across the full data workflow:

- **Define** the structure once with template syntax or plain JavaScript object definitions.
- **Enforce** unknown input at runtime with `parse`, `safeParse`, and `assert`.
- **Transform** trusted runtime data through validate → transform → validate pipelines.
- **Project** the same contract into JSON Schema, TypeScript, OpenAPI, forms, tests, mocks, CLI workflows, and lifecycle diffs.

## Code example

```js
import { oneOf, optional, pipe, sigil, trim } from 'sigil';

const User = sigil.exact({
  id: String,
  name: pipe(String, trim()),
  email: String,
  role: oneOf('admin', 'user'),
  displayName: optional(String),
});

const result = User.safeParse(unknownInput);

if (!result.success) {
  console.error(result.error);
} else {
  const trustedUser = result.data;
  saveUser(trustedUser);
}
```

## CLI example

SigilJS includes a Bun-native, dependency-free CLI for saved contract files:

```bash
sigil check contracts/user.sigil data/user.json
sigil types contracts/user.sigil User
sigil json-schema contracts/user.sigil
```

From this repository:

```bash
bun run src/playground.js check examples/workflows/cli-check-api-response/contract.sigil examples/workflows/cli-check-api-response/valid.json
```

Runnable workflow examples live in [`examples/workflows/`](examples/workflows/README.md).

## Boundary example

Use SigilJS anywhere data crosses a boundary: APIs, databases, forms, events, queues, webhooks, config files, local storage, plugin systems, and AI structured outputs.

```js
import { oneOf, sigil } from 'sigil';

const ApiResponse = sigil.exact({
  id: String,
  name: String,
  role: oneOf('admin', 'user'),
});

const trustedResponse = ApiResponse.parse(await response.json());
```

More boundary recipes: [`docs/recipes/`](docs/recipes/index.md).

## Projection example

A contract object can describe itself and project into tooling formats:

```js
const User = sigil(
  {
    id: String,
    name: String,
    email: String,
  },
  {
    name: 'User',
    version: '1.0.0',
    description: 'Application user contract',
    tags: ['api', 'public'],
  },
);

User.describe();
User.toJSONSchema();
User.toTypeScript('User');
User.toOpenAPI();
```

The CLI can run the same projection workflows from `.sigil` files:

```bash
sigil describe contracts/user.sigil
sigil openapi contracts/user.sigil
sigil types contracts/user.sigil User
```

## Contract diff example

Compare previous and next boundary contracts before shipping a change:

```bash
sigil diff contracts/user-v1.sigil contracts/user-v2.sigil
sigil diff contracts/user-v1.sigil contracts/user-v2.sigil --json
```

Human output groups changes by impact:

```text
Contract changes:

BREAKING
- required property: email
- removed property: username

NON-BREAKING
- added property: displayName
```

## AI structured output example

LLM responses are unknown input until an executable contract enforces them:

```js
const LeadIntent = sigil.exact({
  name: String,
  email: String,
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

const result = LeadIntent.safeParse(llmOutput);

if (result.success) {
  handleTrustedLead(result.data);
}
```

CLI workflow:

```bash
sigil safe-parse contracts/lead-intent.sigil data/llm-output.json
```

See [`examples/workflows/cli-ai-output-check/`](examples/workflows/cli-ai-output-check/README.md).

## Docs

- [Quickstart](docs/quickstart.md)
- [Sigils](docs/sigils.md)
- [CLI](docs/cli.md)
- [Boundary Contract Recipes](docs/recipes/index.md)
- [JSON Schema Projection](docs/projections/json-schema.md)
- [OpenAPI Projection](docs/projections/openapi.md)
- [AI Structured Output Contracts](docs/projections/ai-structured-output.md)
- [Contract Lifecycle](docs/projections/lifecycle.md)
- [SigilJS vs Zod](docs/sigil-vs-zod.md)
- [v1 Readiness](docs/v1-readiness.md)
- [Package Split Policy](docs/package-split.md)

## SigilJS vs Zod

Zod is a mature, expressive validation library with a builder API, TypeScript inference, refinements, and a large ecosystem. SigilJS is a smaller executable data contract system for teams that want one readable runtime contract object they can enforce, transform, describe, and project across system boundaries.

SigilJS does not claim to replace Zod. It is a focused alternative when you want runtime contracts with zero runtime dependencies and projection-oriented workflows.

## Roadmap / package split note

SigilJS is moving toward a stable v1 around the four pillars: Define, Enforce, Transform, and Project.

Near-term work stays in the single `sigil` package. Future package boundaries such as `@sigil/core`, `@sigil/json-schema`, `@sigil/ts`, `@sigil/openapi`, and `@sigil/cli` remain planned boundaries, not current packages, until the public APIs are stable.

## License

MIT
