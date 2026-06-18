# AI Structured Output Contracts

SigilJS can define runtime contracts for LLM applications.

The core bridge is:

```txt
Sigil contract → JSON Schema → LLM structured output schema
              ↘ parse()/safeParse() → trusted runtime object
```

This makes SigilJS useful at AI boundaries where model output is uncertain until validated.

Future direction:

```txt
@sigil/ai
```

For now, AI examples live in core docs/examples while the projection API stabilizes.

## Structured output example

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

const lead = LeadIntent.parse(llmOutput);
```

Flow:

```txt
uncertain AI output → Sigil contract → trusted runtime object
```

See [`../../examples/llm-structured-output.js`](../../examples/llm-structured-output.js).

## Tool-call example

```js
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

const ticket = CreateTicketToolCall.parse(modelToolCallArguments);
```

See [`../../examples/ai-tool-call.js`](../../examples/ai-tool-call.js).

## Why JSON Schema first?

Many structured-output and tool-call APIs already accept JSON Schema-like shapes. `toJSONSchema()` lets one Sigil contract serve two roles:

1. generate the schema passed to the AI API
2. validate the model result at runtime

The schema request narrows model output, but runtime validation is still required. Model output remains untrusted until `parse()` or `safeParse()` succeeds.

## Future `repair()` experiment

Do not implement this in core yet.

A possible future API:

```js
const lead = await LeadIntent.repair(output, async ({ error, output }) => {
  return repairWithLLM({
    error: error.toJSON(),
    output,
    schema: LeadIntent.toJSONSchema(),
  });
});
```

Possible flow:

```txt
parse fails
→ collect path-aware SigilValidationError
→ send repair prompt with error path/expected/actual and schema
→ receive corrected output
→ reparse
```

This belongs in a future `@sigil/ai` package once the core projection model is mature.
