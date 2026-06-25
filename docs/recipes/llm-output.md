# LLM Output Recipe

**Boundary:** LLM provider response → application logic

SigilJS does not call the model. It validates the output your application receives.

---

## Problem

LLM structured output is uncertain. A model may return missing fields, wrong types, out-of-range values, or hallucinated keys. Before your application trusts the output, enforce a contract.

---

## Contract

```js
import { oneOf, sigil } from '@weipertda/sigiljs';

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});
```

---

## Using the contract with a structured output API

`toJSONSchema()` converts the contract to a JSON Schema you can pass to the provider:

```js
const outputSchema = LeadIntent.toJSONSchema();

// Pass outputSchema to your provider's structured output API
// e.g. OpenAI's response_format, Anthropic's tool_choice, etc.
```

SigilJS owns the schema definition. Your provider client owns the API call.

---

## Boundary

```
LLM provider response (unknown JSON)
↓ LeadIntent.safeParse()     ← trust boundary
↓ trusted LeadIntent
→ application logic
```

---

## Implementation

```js
// Simulate what arrives from a model API call
const modelOutput = {
  name: 'Alex Kim',
  email: 'alex@example.com',
  urgency: 'high',
  summary: 'Needs enterprise pricing for a 200-seat rollout.',
};

const result = LeadIntent.safeParse(modelOutput);

if (result.success) {
  createSalesTask(result.data);
} else {
  // Model returned unexpected output — log and decide how to handle
  console.error('Model output failed contract:', result.error.message);
  console.error('Failed field:', result.error.path);
}
```

---

## Validation

```js
// Invalid urgency value
const badOutput = { name: 'Sam', email: 's@x.com', urgency: 'critical', summary: 'urgent' };
const r = LeadIntent.safeParse(badOutput);
// r.success → false
// r.error.path → ['urgency']

// Missing required field
const incomplete = { name: 'Sam', urgency: 'low' };
const r2 = LeadIntent.safeParse(incomplete);
// r2.success → false
// r2.error.path → ['email']
```

---

## Repair loop (pseudocode)

If validation fails, you can send the error back to the model:

```js
let attempt = 0;
const MAX_ATTEMPTS = 3;

while (attempt < MAX_ATTEMPTS) {
  const modelOutput = await callModel(prompt, { schema: LeadIntent.toJSONSchema() });
  const result = LeadIntent.safeParse(modelOutput);

  if (result.success) {
    return result.data;
  }

  // Re-prompt with the validation error
  prompt = `Previous response failed: ${result.error.message}. Please try again.`;
  attempt++;
}

throw new Error('Model output did not pass contract after retries.');
```

SigilJS provides the schema and the validation. Your application owns the retry logic.

---

## Prove

```js
const fixture = LeadIntent.mock({ seed: 1 });
// { name: 'string', email: 'string', urgency: 'low', summary: 'string' }

const { valid, invalid } = LeadIntent.cases();
// valid.length → 1 (contract-valid default)
// invalid.length → several missing-field + wrong-type cases

const report = LeadIntent.test(LeadIntent.cases());
// { success: true, valid: { passed: 1, ... }, invalid: { passed: N, ... } }
```

---

## Run it

```bash
bun run examples/recipes/llm-output.js
```

---

## Limits

- SigilJS does not call any model or provider.
- No provider SDK is imported.
- The repair loop above is pseudocode — implement using your provider client.
- See [`docs/ai/`](../ai/) for AI boundary documentation.
