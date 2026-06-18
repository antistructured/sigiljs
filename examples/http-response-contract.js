import { httpContract, oneOf, sigil } from '../src/index.js';

const UserRequest = sigil.exact({
  id: Number,
});

const UserResponse = sigil.exact({
  id: Number,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});

const GetUser = httpContract({
  request: UserRequest,
  response: UserResponse,
});

const handleGetUser = GetUser.handler((request) => ({
  id: request.id,
  email: 'dana@example.com',
  name: 'Dana',
  role: 'admin',
}));

const trustedResponse = await handleGetUser({ id: 1 });
const openapiOperation = GetUser.toOpenAPI();

console.log('HTTP response accepted:', trustedResponse.id);
console.log(
  'HTTP response OpenAPI:',
  JSON.stringify(openapiOperation.responses, null, 2),
);
