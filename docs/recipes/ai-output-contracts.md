# AI Output Contracts

Define structure once. Project it everywhere.

## 1. Boundary problem

AI structured output is unknown data from a probabilistic system boundary. Use an executable contract to turn model output into trusted runtime data before calling application code.

## 2. Sigil contract

```js
import { oneOf, sigil } from '@weipertda/sigiljs';

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});
```

## 3. Simulated model output

SigilJS does not call the model. It validates the output your application receives.

```js
// In your application, model output arrives as unknown data from an API call.
// Here we simulate it as a plain object for this recipe.
const simulatedModelOutput = {
  name: 'Alex Kim',
  email: 'alex@example.com',
  urgency: 'high',
  summary: 'Needs enterprise pricing for a 200-seat rollout.',
};
```

Use `toJSONSchema()` to build the schema you pass to the provider's structured-output API:

```js
const outputSchema = LeadIntent.toJSONSchema();
// Pass outputSchema to your LLM provider's structured output configuration
```

## 4. Enforcement using parse/safeParse/assert

```js
const result = LeadIntent.safeParse(simulatedModelOutput);

if (!result.success) {
  console.error(result.error);
} else {
  handleTrustedLead(result.data);
}
```

## 5. Trusted output

```js
function handleTrustedLead(lead) {
  return createSalesTask(lead);
}
```

## 6. Optional projection

```js
const structuredOutputProjection = LeadIntent.toJSONSchema();
```
