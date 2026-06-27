import { httpContract, oneOf, optional, sigil } from '../../src/index.js';

const CreateUserBody = sigil.exact({
  email: String,
  role: oneOf('admin', 'member'),
  displayName: optional(String),
});
const UserResponse = sigil.exact({ id: String, email: String, role: oneOf('admin', 'member') });
const ErrorResponse = sigil.exact({ code: String, message: String });

export function createUserRoute(input) {
  const bodyResult = CreateUserBody.safeParse(input.body);
  if (!bodyResult.success) {
    return ErrorResponse.parse({ code: 'INVALID_BODY', message: bodyResult.error.message });
  }
  return UserResponse.parse({ id: 'usr_1', email: bodyResult.data.email, role: bodyResult.data.role });
}

const CreateUserHttp = httpContract({
  method: 'POST',
  path: '/users',
  summary: 'Create a user',
  operationId: 'createUser',
  request: CreateUserBody,
  response: UserResponse,
  responses: { 201: UserResponse, 400: ErrorResponse },
});

const request = CreateUserHttp.safeParseRequest({ body: { email: 'dana@example.com', role: 'member' } });
const response = CreateUserHttp.safeParseResponse({ status: 201, body: createUserRoute({ body: request.success ? request.data.body : {} }) });
const badResponse = CreateUserHttp.safeParseResponse({ status: 400, body: createUserRoute({ body: { role: 'owner' } }) });
const openapi = CreateUserHttp.toOpenAPI();
const pathItem = CreateUserHttp.toPathItem();

if (!request.success) throw request.error;
if (!response.success) throw response.error;
if (!badResponse.success) throw badResponse.error;

console.log(JSON.stringify({
  directResponse: createUserRoute({ body: { email: 'alex@example.com', role: 'admin' } }),
  requestParts: Object.keys(request.data),
  responseStatus: response.data.status,
  errorStatus: badResponse.data.status,
  hasOpenApiResponses: Boolean(openapi.responses),
  pathItemMethods: Object.keys(pathItem),
}, null, 2));
