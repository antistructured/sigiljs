# AI boundaries

AI boundaries share a property: a model or tool produces uncertain output.
That output becomes trusted runtime data only after it matches a contract.

Two common AI boundaries are tool-call arguments and structured LLM output.
Both can be described with one Sigil contract and projected into JSON Schema
so the model knows the expected shape.
After the call, use `parse()` or `assert()` to frame the result.

## Structured outputs

```js
import { oneOf, sigil } from '@weipertda/sigiljs';

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
const lead = LeadIntent.safeParse(llmOutput);
```

## AI tool call arguments

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const CreateTicketToolCall = sigil.exact({
  title: String,
  priority: oneOf('low', 'medium', 'high'),
  assigneeEmail: optional(String),
  body: String,
});
```

```js
const toolArgs = CreateTicketToolCall.safeParse(modelToolCallArguments);
```

## What the contract guarantees

SigilJS treats AI output as an untrusted boundary input.
The contract guarantees shape, required fields, and literal choices at runtime.

SigilJS does not guarantee provider behavior, model attempt success, or external schema compliance.
Those concerns remain outside core.

---

Every AI boundary in this section follows the same pattern:
define one contract with the public `@weipertda/sigiljs` API, validate returned data with `safeParse()` or `parse()`, and inspect structured errors when invalid output is encountered.

SigilJS turns uncertain AI output into trusted runtime data.

AI boundaries are useful for:

- LLM structured output enforcement
- tool-call argument validation
- prompt-generated payloads
- assistant action schemas
- model evaluation fixtures
