# AI Structured Output Contracts

SigilJS can define runtime contracts for LLM applications.

The core bridge is:

```txt
Sigil contract → JSON Schema → structured-output / tool-call schema
              ↘ parse()/safeParse() → trusted runtime object
```

This makes SigilJS useful at AI boundaries where model output is uncertain until validated.

Forward-looking package name:

```txt
@sigil/ai
```

For now, the AI helper and examples live in core while the projection API stabilizes.

## Experimental helper

```js
import { aiSchema } from '@weipertda/sigiljs';

const schema = aiSchema(LeadIntent);
```

`aiSchema(contract, options?)` is an **experimental** wrapper around `contract.toJSONSchema(options)`.
It is a convenience helper, not a provider adapter.
Provider compatibility may vary because structured-output APIs accept JSON-Schema-like shapes, but not all of them accept the full JSON Schema draft or all Sigil projection forms.

## Structured-output example

```js
import { aiSchema, oneOf, optional, sigil } from '@weipertda/sigiljs';

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  budget: optional(Number),
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

const responseFormat = {
  name: 'lead_intent',
  schema: aiSchema(LeadIntent),
};

const lead = LeadIntent.parse(llmOutput);
```

Flow:

```txt
uncertain AI output → Sigil contract → trusted runtime object
```

Runnable example:

```bash
bun run examples/ai/ai-schema.js
```

See [`../../examples/ai/ai-schema.js`](../../examples/ai/ai-schema.js).

## Tool-call example

```js
import { aiSchema, oneOf, optional, sigil } from '@weipertda/sigiljs';

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
    parameters: aiSchema(CreateTicketToolCall),
  },
};

const ticket = CreateTicketToolCall.parse(modelToolCallArguments);
```

Runnable example:

```bash
bun run examples/ai/ai-schema.js
```

See [`../../examples/ai/ai-schema.js`](../../examples/ai/ai-schema.js).

## Why JSON Schema first?

Many structured-output and tool-call APIs already accept JSON Schema-like shapes. `aiSchema()` lets one Sigil contract serve two roles:

1. generate the schema passed to the AI API
2. validate the model result at runtime

The schema request narrows model output, but runtime validation is still required. Model output remains untrusted until `parse()` or `safeParse()` succeeds.

## Provider compatibility

No provider-specific format is claimed as universal.

`aiSchema()` produces JSON Schema-like output from a Sigil contract. Some provider SDKs map JSON Schema directly, some expect predefined fields like `strict` or `additionalProperties`, and some definitions are not required to be supported. If an API expects a different provider-specific shape, adapt `toJSONSchema()` manually at the boundary.

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
