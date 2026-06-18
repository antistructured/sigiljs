import { httpContract, oneOf, optional, sigil } from '../src/index.js';

const CreateUserRequest = sigil.exact({
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

const CreateUser = httpContract({
  request: CreateUserRequest,
  response: CreateUserResponse,
});

const requestBody = {
  email: 'dana@example.com',
  name: 'Dana',
  role: 'user',
};

const trustedRequest = CreateUser.parseRequest(requestBody);
const openapiOperation = CreateUser.toOpenAPI();

console.log('HTTP request accepted:', trustedRequest.email);
console.log(
  'HTTP request OpenAPI:',
  JSON.stringify(openapiOperation.requestBody, null, 2),
);
