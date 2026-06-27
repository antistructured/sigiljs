import { httpContract, optional, sigil } from '../../src/index.js';

const Params = sigil.exact({ id: String });
const Query = sigil.exact({ dryRun: optional(String) });
const Headers = sigil.exact({ authorization: String });
const UpdateBody = sigil.exact({ displayName: optional(String), email: optional(String) });
const UserResponse = sigil.exact({ id: String, email: String, displayName: optional(String) });
const ErrorResponse = sigil.exact({ code: String, message: String });

export function updateUserRoute(request) {
  const params = Params.parse(request.params);
  const body = UpdateBody.parse(request.body);
  return UserResponse.parse({
    id: params.id,
    email: body.email ?? 'existing@example.com',
    displayName: body.displayName,
  });
}

const UpdateUserHttp = httpContract({
  method: 'PATCH',
  path: '/users/:id',
  request: UpdateBody,
  response: UserResponse,
  responses: { 200: UserResponse, 401: ErrorResponse },
  params: Params,
  query: Query,
  headers: Headers,
});

const parsed = UpdateUserHttp.parseRequest({
  params: { id: 'usr_1' },
  query: { dryRun: 'true' },
  headers: { authorization: 'Bearer token' },
  body: { displayName: 'Dana' },
});
const result = UpdateUserHttp.parseResponse({ status: 200, body: updateUserRoute(parsed) });
const invalid = UpdateUserHttp.safeParseRequest({ params: { id: 123 }, body: { displayName: 'Dana' } });

if (invalid.success) throw new Error('expected invalid params to fail');

console.log(JSON.stringify({
  parsedParts: Object.keys(parsed),
  responseBody: result.body,
  invalidParts: invalid.error.parts.map((part) => part.part),
  toPathItemHasPatch: Boolean(UpdateUserHttp.toPathItem().patch),
}, null, 2));
