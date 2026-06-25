# API Route Recipe

**Boundary:** HTTP request → application logic → HTTP response

SigilJS validates both sides of an API route: the incoming request body and the outgoing response shape. No web framework required.

---

## Problem

An API handler receives unknown data from the network. Before application logic sees it, enforce the request shape. Before sending a response, enforce the response shape.

---

## Contracts

```js
import { oneOf, sigil } from '@weipertda/sigiljs';

// What the caller sends
const CreateUserRequest = sigil.exact({
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});

// What the handler returns
const UserResponse = sigil.exact({
  id: String,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
  createdAt: String,
});

// Error envelope
const ErrorResponse = sigil.exact({
  error: String,
  field: String,
});
```

---

## Boundary

```
Client request body (unknown)
↓ CreateUserRequest.safeParse()   ← request trust boundary
↓ trusted request data
→ application logic
→ UserResponse.parse()            ← response trust boundary
↓ trusted response data
→ Client
```

---

## Implementation

```js
function createUserHandler(requestBody) {
  const parsed = CreateUserRequest.safeParse(requestBody);

  if (!parsed.success) {
    return {
      status: 400,
      body: ErrorResponse.parse({
        error: 'Invalid request body',
        field: parsed.error.path?.at(-1) ?? 'unknown',
      }),
    };
  }

  // Application logic operates on trusted data
  const response = UserResponse.parse({
    id: 'user_abc123',
    ...parsed.data,
    createdAt: '2026-01-01T00:00:00.000Z',
  });

  return { status: 201, body: response };
}
```

---

## Validation

```js
// Valid request
const ok = createUserHandler({
  email: 'alex@example.com',
  name: 'Alex',
  role: 'user',
});
// → { status: 201, body: { id: 'user_abc123', ... } }

// Invalid role
const bad = createUserHandler({
  email: 'alex@example.com',
  name: 'Alex',
  role: 'superuser',
});
// → { status: 400, body: { error: 'Invalid request body', field: 'role' } }
```

---

## Projection

```js
// OpenAPI schemas for API docs
const requestSchema = CreateUserRequest.toOpenAPI();
const responseSchema = UserResponse.toOpenAPI();

// TypeScript types
console.log(CreateUserRequest.toTypeScript('CreateUserRequest'));
console.log(UserResponse.toTypeScript('UserResponse'));
```

---

## Prove

```js
// Generate valid test fixtures
const fixture = CreateUserRequest.mock({ seed: 1 });
const { valid, invalid } = CreateUserRequest.cases();

// Prove the handler accepts all valid cases
for (const c of valid) {
  const result = createUserHandler(c.value);
  // result.status is 201 for valid requests
}
```

---

## Run it

```bash
bun run examples/recipes/api-route.js
```

---

## Limits

- No actual HTTP server is created.
- No framework adapter (Express, Fastify, Hono) is provided.
- ID and timestamp generation is handled by your application layer, not SigilJS.
- `httpContract()` provides a more structured helper for HTTP boundaries — see [`docs/projections/http.md`](../projections/http.md) (experimental).
