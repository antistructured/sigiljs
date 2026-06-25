# Tool Calls

SigilJS turns uncertain AI tool-call arguments into trusted runtime data.

This page focuses on tool-call argument shape contracts using the public `@weipertda/sigiljs` API.
No provider SDKs, no network calls, and no provider-specific request wrappers are required.

```js
import { oneOf, sigil } from '@weipertda/sigiljs';
```

## Why tool-call arguments need contracts

AI tool calls usually include:

- a tool or function name
- an arguments object supplied by the model

The arguments object is model-generated and should be treated as untrusted input.
It may contain wrong types, missing required fields, or out-of-range values.

SigilJS enforces the argument shape with one contract object.
This is the **Define** and **Enforce** pillars in action.

## Define a tool-call argument contract

```js
import { oneOf, sigil } from '@weipertda/sigiljs';

const CreateTicketToolCall = sigil.exact({
  title: String,
  priority: oneOf('low', 'medium', 'high'),
  assigneeEmail: optional(String),
  body: String,
});
```

Keep the contract close to the integration point so reviewers can inspect the expected tool-call surface.
If the tool-call contract grows, split it into named contracts the same way you split any object schema.

## Validate arguments before execution

Parse the model-generated arguments before passing them to an executor.

```js
const toolArgs = CreateTicketToolCall.safeParse(modelOutput.arguments);

if (!toolArgs.success) {
  console.error(toolArgs.error);
} else {
  executeCreateTicket(toolArgs.data);
}
```

If you want hard failures during prototyping or tests, use `parse()` instead.

```js
const trustedArgs = CreateTicketToolCall.parse(modelOutput.arguments);
executeCreateTicket(trustedArgs);
```

Treat `modelOutput.arguments` as unknown input.
Never pass it to application code or system calls before validation.

## Nested argument contracts

Tool-call arguments are often nested objects or arrays.
SigilJS supports nested exact objects directly, including optionals and unions.

```js
const SearchToolCall = sigil.exact({
  query: String,
  filters: sigil.exact({
    status: optional(oneOf('open', 'closed')),
    limit: optional(Number),
  }),
  order: oneOf('asc', 'desc'),
});
```

Use the same nested pattern for subtool schemas, plugin payloads, or action parameters.

## Project the contract for tool description

Use `toJSONSchema()` to build tool descriptions or routing metadata.

```js
SearchToolCall.toJSONSchema();
```

Combine that projection with a known tool name and description to form a provider-neutral tool definition.
Keep the actual model call and network transport outside core.

```js
const toolDefinition = {
  name: 'search',
  description: 'Search records with optional filters.',
  inputSchema: SearchToolCall.toJSONSchema(),
};
```

## Limits and provider differences

SigilJS validates JavaScript objects. It does not know which provider supports which tool-call envelope.
If a provider wraps arguments differently, normalize the arguments object before validation.

Provider behavior that remains outside core:

- tool call envelope format (`id`, `type`, `function`)
- retry or fallback strategies
- streaming argument deltas
- model attempt budget

Project the contract once, validate each attempt, and let application code handle retry policy.
