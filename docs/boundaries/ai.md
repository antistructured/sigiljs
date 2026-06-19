# AI boundaries

AI boundaries share a property: a model or tool produces uncertain output.
That output becomes trusted runtime data only after it matches a contract.

Two common AI boundaries are tool-call arguments and structured LLM output.
Both can be described with one Sigil contract and projected into JSON Schema
so the model knows the expected shape.
After the call, use `parse()` or `assert()` to frame the result.

## Structured output

```js
const LeadIntent = sigil.exact({
  name: String,
  email: String,
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

const schema = {
  name: 'lead_intent',
  schema: LeadIntent.toJSONSchema(),
};
```

## Validate output

```js
const lead = LeadIntent.parse(llmOutput);
```

## AI tool call arguments

```js
const CreateTicketToolCall = sigil.exact({
  title: String,
  priority: oneOf('low', 'medium', 'high'),
  assigneeEmail: optional(String),
  body: String,
});
```

```js
const toolArgs = CreateTicketToolCall.parse(modelToolCallArguments);
```

AI boundaries are useful for:

- LLM structured output enforcement
- tool-call argument validation
- prompt-generated payloads
- assistant action schemas
- model evaluation fixtures
