# Full Lifecycle Recipe

**Domain:** SupportTicket — five pillars across multiple boundaries

The value of SigilJS compounds when the same contract moves through multiple boundaries.

---

## Problem

A SupportTicket crosses several runtime boundaries in a real application:

1. API request body (inbound validation)
2. Database row (read validation)
3. Normalization before write (transform)
4. API docs and tooling (projection)
5. Testing (prove)

One contract object handles all of these.

---

## Contract

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const SupportTicket = sigil.exact(
  {
    id: String,
    title: String,
    status: oneOf('open', 'in-progress', 'resolved'),
    priority: oneOf('low', 'medium', 'high'),
    assignee: optional(String),
    createdAt: String,
  },
  {
    name: 'SupportTicket',
    version: '1.0.0',
    description: 'A customer support ticket',
  },
);
```

---

## Define

```js
SupportTicket.describe();
// { kind: 'object', exact: true, properties: [...] }
```

---

## Enforce

**Boundary 1 — API request:**

```js
const result = SupportTicket.safeParse(requestBody);

if (!result.success) {
  return { status: 400, error: result.error.message };
}
processTicket(result.data);
```

**Boundary 2 — Database read:**

```js
const ticket = SupportTicket.parse(rowFromDatabase);
// ticket.priority is 'low' | 'medium' | 'high' — verified
```

---

## Transform

```js
const NormalizedTicket = SupportTicket.transform((data) => ({
  ...data,
  title: data.title.trim(),
}));

const normalized = NormalizedTicket.parse(incomingTicket);
// normalized.title is trimmed
```

---

## Project

```js
SupportTicket.toJSONSchema();       // JSON Schema for API docs
SupportTicket.toTypeScript('SupportTicket'); // TypeScript type
SupportTicket.toOpenAPI();          // OpenAPI schema
SupportTicket.toFormConstraints();  // form field metadata (experimental)
```

---

## Prove

```js
const fixture = SupportTicket.mock({ seed: 1 });
// Deterministic valid sample for tests

const { valid, invalid } = SupportTicket.cases();
// valid: 1 case | invalid: several boundary cases

const report = SupportTicket.test(SupportTicket.cases());
// { success: true, valid: { passed: 1 }, invalid: { passed: N } }

// Diff against old schema
const OldTicket = sigil.exact({ id: String, title: String, status: oneOf('open', 'closed') });
const changes = OldTicket.diff(SupportTicket);
// List of structural changes with impact classification
```

---

## Run it

```bash
bun run examples/recipes/full-lifecycle.js
```

---

## Limits

- `toFormConstraints()` is experimental.
- `mock()` generates type-correct but not semantically meaningful values.
- No actual API server, database, or network calls.
