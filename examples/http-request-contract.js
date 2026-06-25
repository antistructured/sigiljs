/**
 * HTTP Request Contract Example
 *
 * Demonstrates httpContract() for validating API request parts:
 * body, params, query, and headers — all as plain objects.
 *
 * No framework required. No network calls.
 */
import { httpContract, oneOf, optional, sigil } from '../src/index.js';

// --- Define contracts for each request part ---

const CreateUserBody = sigil.exact({
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});

const CreateUserResponse = sigil.exact({
  id: Number,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});

// --- Define the route contract ---

const CreateUser = httpContract({
  method: 'POST',
  path: '/users',
  summary: 'Create a new user',
  operationId: 'createUser',
  request: CreateUserBody,
  response: CreateUserResponse,
  responses: {
    201: CreateUserResponse,
    400: sigil.exact({ code: String, message: String }),
  },
});

// --- Parse an incoming request body ---

const incomingRequest = {
  body: {
    email: 'dana@example.com',
    name: 'Dana',
    role: 'user',
  },
};

const trustedRequest = CreateUser.parseRequest(incomingRequest);
console.log('Trusted body:', trustedRequest.body);

// --- Safe parse (never throws) ---

const badRequest = {
  body: { email: 'not-an-email', role: 'superadmin' }, // invalid role
};

const safeResult = CreateUser.safeParseRequest(badRequest);
console.log('Safe parse success:', safeResult.success); // false

// --- OpenAPI projection ---

const openapiOperation = CreateUser.toOpenAPI();
console.log('OpenAPI requestBody schema type:', openapiOperation.requestBody.content['application/json'].schema.type);

// --- Path item (OpenAPI-compatible) ---

const pathItem = CreateUser.toPathItem();
console.log('OpenAPI path item paths:', Object.keys(pathItem)); // ['/users']
console.log('OpenAPI operation methods:', Object.keys(pathItem['/users'])); // ['post']
console.log('OpenAPI operationId:', pathItem['/users']['post'].operationId);
