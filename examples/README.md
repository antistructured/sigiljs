# SigilJS Examples

All examples are dependency-free unless explicitly stated. They use plain JavaScript objects and make no network calls.

---

## Recipe examples

End-to-end runnable recipes demonstrating real application boundary patterns.

| File | Description |
|------|-------------|
| `recipes/api-route.js` | Request + response boundary for a create-user route |
| `recipes/llm-output.js` | Validate uncertain LLM structured output |
| `recipes/form-submission.js` | Form value enforcement + constraint projection |
| `recipes/database-persistence.js` | Record read/insert/update/diff patterns |
| `recipes/contract-testing.js` | mock(), cases(), test() in depth |
| `recipes/full-lifecycle.js` | All five pillars: Define→Enforce→Transform→Project→Prove ⭐ |
| `recipes/cli/` | Contract files for CLI workflow recipes |

**Run:** `bun run examples/recipes/<file>.js`

See [`docs/recipes/README.md`](../docs/recipes/README.md) for recipe documentation.

---

## Core examples

Fundamental contract usage patterns.

| File | Description |
|------|-------------|
| `basic-user.js` | Define a user contract, safeParse an object |
| `basic-validation.js` | Parse and safeParse with error handling |
| `api-validation.js` | Validate an API response body |
| `api-request.js` | Validate an API request body |
| `api-response.js` | Validate an API response with optional fields |
| `config-file.js` | Validate a config file object |
| `config-validation.js` | Config validation with error paths |
| `boundaries.js` | Runtime boundary patterns overview |
| `contract-diff.js` | Compare two contract versions |
| `contract-metadata.js` | Contract with name/version/description metadata |
| `nested-order.js` | Nested object contracts |
| `realtype-demo.js` | Use realType() to inspect runtime types |
| `login-request.js` | Login form data validation |
| `queue-message.js` | Queue message contract |
| `webhook.js` | Webhook payload contract |

**Run:** `bun run examples/<file>.js`

---

## AI examples

How to use Sigil contracts with AI structured output APIs.

| File/Dir | Description |
|----------|-------------|
| `ai/` | Directory of AI boundary examples |
| `ai-tool-call.js` | AI function call / tool call validation |
| `llm-structured-output.js` | LLM structured output validation |

No provider SDK is required. Examples use deterministic fixtures, not real API calls.

**Run:** `bun run examples/ai/<file>.js`

---

## HTTP examples

Framework-neutral HTTP request/response boundary contracts.

| File | Description |
|------|-------------|
| `http-request-contract.js` | HTTP request body + toPathItem projection |
| `http-response-contract.js` | Multi-status response validation |
| `http-full-route.js` | Full route with params/query/headers/body |

No Express, Fastify, or Hono required. Plain objects only.

**Run:** `bun run examples/http-request-contract.js`

---

## Form examples

Form value validation and form constraint projection.

| File | Description |
|------|-------------|
| `forms/basic-form.js` | Basic form safeParse |
| `forms/registration-form.js` | Registration with optional fields and enum |
| `forms/form-safe-parse.js` | Error handling and field paths |
| `forms/form-errors.js` | Path-aware error extraction |
| `forms/form-mock.js` | Generate valid form fixtures with mock() |
| `forms/form-cases.js` | Generate boundary test cases |
| `forms/form-contract-test.js` | Prove form contract behavior |
| `forms/login-form.js` | Full five-pillar login form example |
| `forms/checkout-form.js` | Nested address object + shipping |
| `forms/settings-form.js` | Boolean toggles and preferences |
| `forms/ai-generated-form-values.js` | Validate AI-generated form data |

No UI framework required. No DOM required.

**Run:** `bun run examples/forms/<file>.js`

---

## Database examples

Validate data at persistence boundaries — records, inserts, updates, diffs.

| File | Description |
|------|-------------|
| `database/read-record.js` | Validate a row read from a database |
| `database/invalid-record.js` | Invalid row shapes and error paths |
| `database/record-safe-parse.js` | Bulk row validation |
| `database/insert-shape.js` | Validate input before insert |
| `database/invalid-insert.js` | Catch bad insert inputs |
| `database/serialized-insert.js` | Normalize with transform() before insert |
| `database/update-shape.js` | Validate update/patch payloads |
| `database/invalid-update.js` | Catch bad update inputs |
| `database/partial-update.js` | Partial update patterns |
| `database/record-contract-diff.js` | Diff two record schemas |
| `database/migration-safety-check.js` | Check old rows against new schema |
| `database/record-mock.js` | Generate record fixtures with mock() |
| `database/record-cases.js` | Generate boundary test cases |
| `database/record-contract-test.js` | Prove record contract behavior |

No database connection required. Plain objects only.

**Run:** `bun run examples/database/<file>.js`

---

## CLI examples

`.sigil.js` JS module contract files for CLI workflows.

| File | Description |
|------|-------------|
| `cli/contracts/user.sigil.js` | User contract with enum role |
| `cli/contracts/old-user.sigil.js` | Previous user contract (for diff) |
| `cli/contracts/new-user.sigil.js` | New user contract with added fields |
| `cli/data/valid-user.json` | Valid user data |
| `cli/data/invalid-user.json` | Invalid user data (bad role) |

See [`cli/README.md`](cli/README.md) for example CLI commands.

---

## Testing / Prove examples

| Dir/File | Description |
|----------|-------------|
| `testing/` | Contract-driven testing examples |
| `testing/bun-test-example.test.js` | Using mock()/cases() inside Bun test |

**Run:** `bun test examples/testing/`

---

## CLI workflow examples

End-to-end terminal workflows with `.sigil` text files.

| Dir | Description |
|-----|-------------|
| `workflows/cli-check-api-response/` | Validate API data from the terminal |
| `workflows/cli-generate-types/` | Generate TypeScript from a contract |
| `workflows/cli-generate-json-schema/` | Generate JSON Schema |
| `workflows/cli-diff-contracts/` | Compare contract versions |
| `workflows/cli-ai-output-check/` | Validate AI output from the terminal |

See [`workflows/README.md`](workflows/README.md) for instructions.

---

## Published package examples

Examples that import from the published npm package (not local source paths):

| Dir | Description |
|-----|-------------|
| `published/` | Copy-paste-safe examples from `@weipertda/sigiljs` |

These examples are designed for users installing from npm.
