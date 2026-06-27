# AI Structured Output Contracts

SigilJS can define runtime contracts for LLM applications without adding a provider SDK or a provider-specific helper.

The supported bridge is:

```txt
Sigil contract → contract.toJSONSchema() → structured-output / tool-call schema
              ↘ parse()/safeParse()   → trusted runtime object
```

This makes SigilJS useful at AI boundaries where model output is uncertain until validated.

---

## Status

AI usage currently relies on stable public APIs:

- `contract.toJSONSchema()`
- `contract.safeParse(output)`
- `contract.parse(output)`

No AI-specific schema helper is exported by `@weipertda/sigiljs`.

Future provider-specific helpers or packages such as `@sigil/ai` are intentionally deferred until real usage proves they are needed.

---

## Structured-output example

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  budget: optional(Number),
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

const responseFormat = {
  name: 'lead_intent',
  schema: LeadIntent.toJSONSchema(),
};

// Pass responseFormat to your LLM provider as structured-output config.
// SigilJS does not call the provider.

const result = LeadIntent.safeParse(llmOutput);
if (!result.success) {
  throw new Error(`Invalid model output: ${result.error.message}`);
}

const lead = result.data;
```

Flow:

```txt
uncertain AI output → Sigil contract → trusted runtime object
```

Runnable example:

```bash
bun run examples/ai/llm-structured-output.js
```

---

## Tool-call example

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const CreateTicketToolCall = sigil.exact({
  title: String,
  priority: oneOf('low', 'medium', 'high'),
  assigneeEmail: optional(String),
  body: String,
});

const toolDefinition = {
  type: 'function',
  function: {
    name: 'create_ticket',
    parameters: CreateTicketToolCall.toJSONSchema(),
  },
};

// Pass toolDefinition to your LLM provider.
// Validate the arguments you receive before using them.

const ticket = CreateTicketToolCall.parse(modelToolCallArguments);
```

Runnable examples:

```bash
bun run examples/ai/tool-call-create-ticket.js
bun run examples/ai/tool-call-schedule-followup.js
```

---

## Why JSON Schema first?

Many structured-output and tool-call APIs already accept JSON Schema-like shapes. `toJSONSchema()` lets one Sigil contract serve two roles:

1. generate the schema-like shape passed to an AI API
2. validate the model result at runtime

The schema request narrows model output, but runtime validation is still required. Model output remains untrusted until `parse()` or `safeParse()` succeeds.

---

## Provider compatibility

No provider-specific format is claimed as universal.

`toJSONSchema()` produces JSON Schema-like output from a Sigil contract. Some provider SDKs map JSON Schema directly, some expect additional wrapper fields, and some support only subsets. If an API expects a different provider-specific shape, adapt `toJSONSchema()` manually at the boundary.

SigilJS does not call the model. It validates the output your application receives.

---

## Future `repair()` experiment

Do not implement this in core yet.

A possible future pattern:

```js
const result = LeadIntent.safeParse(output);
if (!result.success) {
  const repaired = await repairWithLLM({
    error: result.error.toJSON?.() ?? result.error,
    output,
    schema: LeadIntent.toJSONSchema(),
  });

  LeadIntent.parse(repaired);
}
```

Possible flow:

```txt
parse fails
→ collect path-aware SigilValidationError
→ send repair prompt with error path/expected/actual and schema
→ receive corrected output
→ reparse
```

This is a design note only, not a current public API.
