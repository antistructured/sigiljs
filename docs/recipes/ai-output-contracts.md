# AI Output Contracts

Define structure once. Project it everywhere.

## 1. Boundary problem

AI structured output is unknown data from a probabilistic system boundary. Use an executable contract to turn model output into trusted runtime data before calling application code.

## 2. Sigil contract

```js
import { oneOf, sigil } from 'sigil';

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});
```

## 3. Unknown input

```js
const llmOutput = await model.generateObject({
  projection: LeadIntent.toJSONSchema(),
});
```

## 4. Enforcement using parse/safeParse/assert

```js
const result = LeadIntent.safeParse(llmOutput);

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
