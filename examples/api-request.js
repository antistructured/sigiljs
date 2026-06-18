import { sigil, optional } from '../src/index.js';

const CreateUserRequest = sigil.exact({
  email: String,
  name: String,
  age: optional(Number),
});

const requestBody = {
  email: 'dana@example.com',
  name: 'Dana',
  age: 34,
};

const request = CreateUserRequest.parse(requestBody);

console.log('API request accepted:', request.email);
