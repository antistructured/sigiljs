/**
 * HTTP Boundary — Full Route Contract Example
 *
 * Demonstrates a complete httpContract() with all request parts:
 * body, params, query, and headers validated independently.
 *
 * No framework required. No network calls.
 */
import { httpContract, optional, sigil } from '../src/index.js';

// --- Define a contract for each request part ---

const UpdateUserBody = sigil.exact({
  name: optional(String),
  email: optional(String),
});

const RouteParams = sigil.exact({ id: String });

const QueryParams = sigil.exact({
  dryRun: optional(String),
});

const RequestHeaders = sigil.exact({ authorization: String });

const UpdatedUser = sigil.exact({
  id: Number,
  name: String,
  email: String,
});

// --- Route contract with all parts ---

const UpdateUser = httpContract({
  method: 'PATCH',
  path: '/users/:id',
  summary: 'Update a user',
  operationId: 'updateUser',
  request: UpdateUserBody,
  response: UpdatedUser,
  params: RouteParams,
  query: QueryParams,
  headers: RequestHeaders,
  responses: {
    200: UpdatedUser,
    400: sigil.exact({ code: String, message: String }),
  },
});

// --- Full structured request input ---

const authToken = 'Bearer token_xyz';

const incomingRequest = {
  params: { id: 'user-42' },
  query: { dryRun: 'false' },
  headers: { authorization: authToken },
  body: { name: 'Dana Updated', email: 'dana-new@example.com' },
};

const trustedRequest = UpdateUser.parseRequest(incomingRequest);
console.log('Trusted params.id:', trustedRequest.params.id);
console.log('Trusted headers.authorization:', trustedRequest.headers.authorization);
console.log('Trusted body.name:', trustedRequest.body.name);

// --- Safe parse on partial input (params and query only) ---

const getRequest = {
  params: { id: 'user-99' },
  query: { dryRun: 'true' },
  headers: { authorization: authToken },
};

const safeResult = UpdateUser.safeParseRequest(getRequest);
console.log('Partial request safe parse success:', safeResult.success);

// --- OpenAPI alignment ---

const pathItem = UpdateUser.toPathItem();
console.log('Path item paths:', Object.keys(pathItem));
console.log('HTTP method:', Object.keys(pathItem['/users/:id']));
const op = pathItem['/users/:id']['patch'];
console.log('Operation summary:', op.summary);
console.log('Operation response statuses:', Object.keys(op.responses));
