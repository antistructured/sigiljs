/**
 * HTTP Response Contract Example
 *
 * Demonstrates httpContract() for validating API responses:
 * single response, multi-status responses, and safe helpers.
 *
 * No framework required. No network calls.
 */
import { httpContract, oneOf, sigil } from '../src/index.js';

// --- Define contracts ---

const UserRequest = sigil.exact({ id: String });

const UserResponse = sigil.exact({
  id: Number,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});

const ErrorResponse = sigil.exact({
  code: String,
  message: String,
});

// --- Route with multi-status response map ---

const GetUser = httpContract({
  method: 'GET',
  path: '/users/:id',
  summary: 'Get a user by ID',
  operationId: 'getUser',
  request: UserRequest,
  response: UserResponse,
  responses: {
    200: UserResponse,
    404: ErrorResponse,
  },
});

// --- Parse a successful response ---

const successResult = GetUser.parseResponse({
  status: 200,
  body: { id: 1, email: 'dana@example.com', name: 'Dana', role: 'admin' },
});
console.log('Response status:', successResult.status); // 200
console.log('Response body name:', successResult.body.name); // Dana

// --- Parse an error response ---

const errorResult = GetUser.parseResponse({
  status: 404,
  body: { code: 'USER_NOT_FOUND', message: 'No user with that ID' },
});
console.log('Error code:', errorResult.body.code); // USER_NOT_FOUND

// --- Safe parse ---

const safeResult = GetUser.safeParseResponse({
  status: 200,
  body: { id: 'bad-id', email: 'x@x.com', name: 'X', role: 'admin' },
});
console.log('Safe parse success:', safeResult.success); // false

// --- Handler pattern ---

const handleGetUser = GetUser.handler(async (request) => ({
  id: 1,
  email: 'dana@example.com',
  name: 'Dana',
  role: 'admin',
}));

const trustedResponse = await handleGetUser({
  params: { id: 'user-1' },
});
console.log('Handler response id:', trustedResponse.id); // 1

// --- OpenAPI projection ---

const openapi = GetUser.toOpenAPI();
console.log('OpenAPI response statuses:', Object.keys(openapi.responses)); // ['200', '404']

const pathItem = GetUser.toPathItem();
console.log('Path item paths:', Object.keys(pathItem)); // ['/users/:id']
