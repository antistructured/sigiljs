# Structured Outputs

SigilJS turns uncertain AI output into trusted runtime data.

This page shows how to describe and validate AI structured output with an executable contract.
Everything is provider-neutral and driven by the public `@weipertda/sigiljs` API.

```js
import { oneOf, sigil } from '@weipertda/sigiljs';
```

## Why AI output needs contracts

LLM structured output is data that crosses a trust boundary.
The model may return the wrong shape, an invalid enum value, or omit required fields.
A schema alone is not enforced at runtime.

SigilJS treats the expected output as a contract, not a type declaration.
You define it once, validate on every call, and project the same contract into JSON Schema when you need to describe it.

This is the **Enforce** and **Project** pillars of SigilJS: define one contract, enforce it at the boundary, and project it into tooling-friendly formats.

## Define a structured output contract

Use `sigil.exact()` for fixed AI output shapes.
Exact mode ensures no extra keys slip through from model noise.

```js
import { oneOf, sigil } from '@weipertda/sigiljs';

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});
```

The contract is executable immediately.
You do not need a separate schema builder, generated file, or provider SDK.

## Project the contract

Use `toJSONSchema()` to create a description a model or routing layer can consume.
JSON Schema projection is stable and does not require network calls.

```js
LeadIntent.toJSONSchema();
```

Use `describe()` when you need the canonical contract shape instead of JSON Schema.

## Validate returned output

Use `safeParse()` when you want non-throwing boundary handling.

```js
const result = LeadIntent.safeParse(llmOutput);

if (!result.success) {
  console.error(result.error);
} else {
  const trustedLead = result.data;
  saveLead(trustedLead);
}
```

Use `parse()` when you prefer exceptions for failures.

```js
try {
  const trustedLead = LeadIntent.parse(llmOutput);
  saveLead(trustedLead);
} catch (error) {
  reportInvalidOutput(error);
}
```

Both APIs are provider-neutral. They work on any object returned from a model call.

## Handle invalid output

When validation fails, inspect the structured error fields:

- `error.message` — human-readable summary
- `error.path` — the key or index that failed
- `error.expected` — the contract expectation
- `error.actual` — the rejected value

Use these fields to build repair prompts, log violations, or route invalid output to a fallback.

For the repair-loop pattern, see [`docs/ai/repair-loop.md`](repair-loop.md).

## Provider differences

SigilJS validates JavaScript objects. It does not depend on provider APIs, response wrappers, or transmission formats.
If your normalized model output is a JavaScript object, you can validate it with `safeParse()` or `parse()`.

The model's attempt count, retry budget, prompt formatting, and provider junction remain application concerns outside core.
Core's job is to tell you whether output matches the contract and what failed.
