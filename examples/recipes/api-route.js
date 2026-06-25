/**
 * API Route Recipe — examples/recipes/api-route.js
 *
 * Shows request + response boundary contracts for a create-user API route.
 * No framework. No server. Plain functions only.
 */
import { oneOf, sigil } from '../../src/index.js';

// ── Contracts ─────────────────────────────────────────────────────────────

const CreateUserRequest = sigil.exact({
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});

const UserResponse = sigil.exact({
  id: String,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
  createdAt: String,
});

const ErrorResponse = sigil.exact({
  error: String,
  field: String,
});

// ── Handler ───────────────────────────────────────────────────────────────

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

  // Application logic operates on trusted request data
  const response = UserResponse.parse({
    id: 'user_abc123',
    ...parsed.data,
    createdAt: '2026-01-01T00:00:00.000Z',
  });

  return { status: 201, body: response };
}

// ── Boundary enforcement ──────────────────────────────────────────────────

const okResult = createUserHandler({
  email: 'alex@example.com',
  name: 'Alex',
  role: 'user',
});
console.log('Valid request status:', okResult.status);
console.log('Response body:', okResult.body);

const badRole = createUserHandler({
  email: 'alex@example.com',
  name: 'Alex',
  role: 'superuser',
});
console.log('Invalid role status:', badRole.status);
console.log('Error body:', badRole.body);

const missingField = createUserHandler({
  email: 'alex@example.com',
  role: 'user',
  // name missing
});
console.log('Missing field status:', missingField.status);
console.log('Error field:', missingField.body.field);

// ── Projection ────────────────────────────────────────────────────────────

const requestSchema = CreateUserRequest.toJSONSchema();
console.log('Request required fields:', requestSchema.required);

const tsType = CreateUserRequest.toTypeScript('CreateUserRequest');
console.log('TypeScript type:', tsType);

// ── Prove ─────────────────────────────────────────────────────────────────

const fixture = CreateUserRequest.mock({ seed: 1 });
console.log('Mock fixture:', fixture);
console.log('Fixture parses:', CreateUserRequest.safeParse(fixture).success);

const { valid, invalid } = CreateUserRequest.cases();
console.log('Valid cases:', valid.length, '| Invalid cases:', invalid.length);

// All valid cases produce 201
for (const c of valid) {
  const result = createUserHandler(c.value);
  console.log(`  Case "${c.label}": status=${result.status}`);
}
