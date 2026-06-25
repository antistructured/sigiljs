import { describe, test, expect } from 'bun:test';
import {
  httpContract,
  oneOf,
  optional,
  sigil,
  SigilValidationError,
} from '../src/index.js';

describe('Phase 11 Request Boundary Helpers', () => {
  const LoginRequest = sigil.exact({
    email: String,
    password: String,
  });

  const LoginResponse = sigil.exact({
    token: String,
    role: oneOf('admin', 'user'),
    expiresIn: optional(Number),
  });

  test('creates a framework-neutral request/response contract', () => {
    const Login = httpContract({
      request: LoginRequest,
      response: LoginResponse,
    });

    expect(Login.kind).toBe('sigil.httpContract');
    expect(Login.request).toBe(LoginRequest);
    expect(Login.response).toBe(LoginResponse);
  });

  test('parses request bodies and serializes responses through Sigil contracts', () => {
    const Login = httpContract({
      request: LoginRequest,
      response: LoginResponse,
    });

    const request = Login.parseRequest({
      body: {
        email: 'dana@example.com',
        password: 'secret',
      },
    });
    const response = Login.serializeResponse({
      token: 'token_123',
      role: 'admin',
    });

    expect(request.body.email).toBe('dana@example.com');
    expect(response.role).toBe('admin');
  });

  test('safe request/response helpers never throw', () => {
    const Login = httpContract({
      request: LoginRequest,
      response: LoginResponse,
    });

    // Body with invalid fields — safeParseRequest should return failure
    const request = Login.safeParseRequest({
      body: { email: 'dana@example.com' }, // missing required 'password'
    });
    const response = Login.safeSerializeResponse({
      token: 'token_123',
      role: 'owner', // invalid enum value
    });

    expect(request.success).toBe(false);
    expect(request.error).toBeTruthy();
    expect(response.success).toBe(false);
    expect(response.error).toBeInstanceOf(SigilValidationError);
  });

  test('validates defined request parts and omits missing ones', () => {
    const CreateUserRequest = sigil.exact({
      name: String,
      email: String,
    });
    const CreateUserResponse = sigil.exact({
      id: Number,
      name: String,
      email: String,
      role: oneOf('admin', 'user'),
    });

    const CreateUser = httpContract({
      request: CreateUserRequest,
      response: CreateUserResponse,
    });

    const completeInput = {
      body: { name: 'Alex', email: 'alex@example.com' },
    };

    expect(CreateUser.requestParts.body).toBe(CreateUserRequest);
    expect(Object.keys(CreateUser.requestParts)).toEqual(['body']);

    const parsed = CreateUser.parseRequest(completeInput);
    expect(parsed.body).toEqual({ name: 'Alex', email: 'alex@example.com' });
    expect(Object.hasOwn(parsed, 'params')).toBe(false);
    expect(Object.hasOwn(parsed, 'query')).toBe(false);
    expect(Object.hasOwn(parsed, 'headers')).toBe(false);
  });

  test('projects request and response schemas for HTTP docs', () => {
    const Login = httpContract({
      request: LoginRequest,
      response: LoginResponse,
    });

    expect(Login.toOpenAPI()).toEqual({
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: LoginRequest.toOpenAPI(),
          },
        },
      },
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: LoginResponse.toOpenAPI(),
            },
          },
        },
      },
    });
  });

  test('wraps a framework-neutral handler function', async () => {
    const Login = httpContract({
      request: LoginRequest,
      response: LoginResponse,
    });

    const handle = Login.handler(async (request) => {
      expect(request.body.email).toBe('dana@example.com');
      return {
        token: 'token_123',
        role: 'user',
      };
    });

    await expect(
      handle({
        body: {
          email: 'dana@example.com',
          password: 'secret',
        },
      }),
    ).resolves.toEqual({
      token: 'token_123',
      role: 'user',
    });
  });

  test('does not depend on framework request or response objects', () => {
    const Login = httpContract({
      request: LoginRequest,
      response: LoginResponse,
    });

    expect(Login.parseRequest.length).toBe(0);
    expect(Login.safeParseRequest.length).toBe(1);
    expect(Login.serializeResponse.length).toBe(1);
  });

  test('requires Sigil contracts for request and response', () => {
    expect(() =>
      httpContract({
        request: {},
        response: LoginResponse,
      }),
    ).toThrow('httpContract request must be a Sigil contract');

    expect(() =>
      httpContract({
        request: LoginRequest,
        response: {},
      }),
    ).toThrow('httpContract response must be a Sigil contract');
  });
});

describe('Task 4 — Request Boundary Helpers', () => {
  const BodyContract = sigil.exact({ name: String, email: String });
  const ParamsContract = sigil.exact({ id: String });
  const QueryContract = sigil.exact({ page: Number, limit: Number });
  const HeadersContract = sigil.exact({ authorization: String });
  const ResponseContract = sigil.exact({ id: Number, name: String });

  test('stores method and path metadata on the contract object', () => {
    const route = httpContract({
      method: 'POST',
      path: '/users',
      request: BodyContract,
      response: ResponseContract,
    });

    expect(route.method).toBe('POST');
    expect(route.path).toBe('/users');
  });

  test('omits method and path when not provided', () => {
    const route = httpContract({
      request: BodyContract,
      response: ResponseContract,
    });

    expect(Object.hasOwn(route, 'method')).toBe(false);
    expect(Object.hasOwn(route, 'path')).toBe(false);
  });

  test('parses params when params contract is provided', () => {
    const route = httpContract({
      method: 'GET',
      path: '/users/:id',
      request: BodyContract,
      response: ResponseContract,
      params: ParamsContract,
    });

    const result = route.parseRequest({ params: { id: 'user-42' } });
    expect(result.params).toEqual({ id: 'user-42' });
    expect(Object.hasOwn(result, 'body')).toBe(false);
  });

  test('parses query when query contract is provided', () => {
    const route = httpContract({
      method: 'GET',
      path: '/users',
      request: BodyContract,
      response: ResponseContract,
      query: QueryContract,
    });

    const result = route.parseRequest({ query: { page: 1, limit: 20 } });
    expect(result.query).toEqual({ page: 1, limit: 20 });
    expect(Object.hasOwn(result, 'body')).toBe(false);
  });

  test('parses headers when headers contract is provided', () => {
    const route = httpContract({
      method: 'POST',
      path: '/users',
      request: BodyContract,
      response: ResponseContract,
      headers: HeadersContract,
    });

    const result = route.parseRequest({
      headers: { authorization: 'Bearer token_abc' },
      body: { name: 'Alex', email: 'alex@example.com' },
    });

    expect(result.headers).toEqual({ authorization: 'Bearer token_abc' });
    expect(result.body).toEqual({ name: 'Alex', email: 'alex@example.com' });
  });

  test('parses all parts together when all contracts are provided', () => {
    const route = httpContract({
      method: 'POST',
      path: '/users/:id',
      request: BodyContract,
      response: ResponseContract,
      params: ParamsContract,
      query: QueryContract,
      headers: HeadersContract,
    });

    const result = route.parseRequest({
      params: { id: 'user-42' },
      query: { page: 1, limit: 10 },
      headers: { authorization: 'Bearer token_abc' },
      body: { name: 'Alex', email: 'alex@example.com' },
    });

    expect(result.params).toEqual({ id: 'user-42' });
    expect(result.query).toEqual({ page: 1, limit: 10 });
    expect(result.headers).toEqual({ authorization: 'Bearer token_abc' });
    expect(result.body).toEqual({ name: 'Alex', email: 'alex@example.com' });
  });

  test('safeParseRequest returns failure when a part is invalid', () => {
    const route = httpContract({
      method: 'POST',
      path: '/users/:id',
      request: BodyContract,
      response: ResponseContract,
      params: ParamsContract,
    });

    const result = route.safeParseRequest({
      params: { id: 99 }, // should be String
      body: { name: 'Alex', email: 'alex@example.com' },
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test('requestParts reflects all provided contracts', () => {
    const route = httpContract({
      request: BodyContract,
      response: ResponseContract,
      params: ParamsContract,
      query: QueryContract,
      headers: HeadersContract,
    });

    expect(route.requestParts.body).toBe(BodyContract);
    expect(route.requestParts.params).toBe(ParamsContract);
    expect(route.requestParts.query).toBe(QueryContract);
    expect(route.requestParts.headers).toBe(HeadersContract);
    expect(Object.keys(route.requestParts)).toEqual(
      expect.arrayContaining(['params', 'query', 'headers', 'body']),
    );
  });
});

describe('Task 5 — Response Boundary Helpers', () => {
  const RequestContract = sigil.exact({ name: String });
  const SuccessResponse = sigil.exact({ id: Number, name: String });
  const ErrorResponse = sigil.exact({ code: String, message: String });

  test('parseResponse accepts flat body and returns { status: 200, body }', () => {
    const route = httpContract({
      request: RequestContract,
      response: SuccessResponse,
    });

    const result = route.parseResponse({ id: 1, name: 'Alex' });
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ id: 1, name: 'Alex' });
  });

  test('parseResponse accepts structured { status, body } input', () => {
    const route = httpContract({
      request: RequestContract,
      response: SuccessResponse,
    });

    const result = route.parseResponse({ status: 200, body: { id: 2, name: 'Sam' } });
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ id: 2, name: 'Sam' });
  });

  test('parseResponse routes by status code when responses map is provided', () => {
    const route = httpContract({
      request: RequestContract,
      response: SuccessResponse,
      responses: {
        200: SuccessResponse,
        400: ErrorResponse,
      },
    });

    const success = route.parseResponse({ status: 200, body: { id: 3, name: 'Dana' } });
    expect(success.status).toBe(200);
    expect(success.body).toEqual({ id: 3, name: 'Dana' });

    const error = route.parseResponse({ status: 400, body: { code: 'INVALID', message: 'Bad input' } });
    expect(error.status).toBe(400);
    expect(error.body).toEqual({ code: 'INVALID', message: 'Bad input' });
  });

  test('safeParseResponse returns failure on invalid body', () => {
    const route = httpContract({
      request: RequestContract,
      response: SuccessResponse,
    });

    const result = route.safeParseResponse({ status: 200, body: { id: 'not-a-number', name: 'Alex' } });
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test('safeParseResponse returns success on valid structured input', () => {
    const route = httpContract({
      request: RequestContract,
      response: SuccessResponse,
    });

    const result = route.safeParseResponse({ status: 200, body: { id: 4, name: 'Jordan' } });
    expect(result.success).toBe(true);
    expect(result.data.status).toBe(200);
    expect(result.data.body).toEqual({ id: 4, name: 'Jordan' });
  });

  test('toOpenAPI reflects single response contract as status 200', () => {
    const route = httpContract({
      request: RequestContract,
      response: SuccessResponse,
    });

    const openapi = route.toOpenAPI();
    expect(openapi.responses[200]).toBeDefined();
    expect(openapi.responses[200].description).toBe('Successful response');
    expect(openapi.responses[200].content['application/json'].schema).toEqual(
      SuccessResponse.toOpenAPI(),
    );
  });

  test('toOpenAPI reflects multi-status responses map', () => {
    const route = httpContract({
      request: RequestContract,
      response: SuccessResponse,
      responses: {
        200: SuccessResponse,
        400: ErrorResponse,
      },
    });

    const openapi = route.toOpenAPI();
    expect(openapi.responses[200]).toBeDefined();
    expect(openapi.responses[400]).toBeDefined();
    expect(openapi.responses[400].description).toBe('Bad request');
    expect(openapi.responses[400].content['application/json'].schema).toEqual(
      ErrorResponse.toOpenAPI(),
    );
  });

  test('responses property is stored on contract when provided', () => {
    const route = httpContract({
      request: RequestContract,
      response: SuccessResponse,
      responses: { 200: SuccessResponse, 400: ErrorResponse },
    });

    expect(route.responses[200]).toBe(SuccessResponse);
    expect(route.responses[400]).toBe(ErrorResponse);
  });

  test('requires Sigil contracts in responses map', () => {
    expect(() =>
      httpContract({
        request: RequestContract,
        response: SuccessResponse,
        responses: { 200: {} },
      }),
    ).toThrow('httpContract responses[200] must be a Sigil contract');
  });
});

describe('Task 6 — HTTP OpenAPI Alignment', () => {
  const RequestContract = sigil.exact({ name: String, email: String });
  const SuccessResponse = sigil.exact({ id: Number, name: String });
  const ErrorResponse = sigil.exact({ code: String, message: String });

  test('toPathItem returns path-item shape when method and path are provided', () => {
    const route = httpContract({
      method: 'POST',
      path: '/users',
      request: RequestContract,
      response: SuccessResponse,
    });

    const pathItem = route.toPathItem();
    expect(pathItem['/users']).toBeDefined();
    expect(pathItem['/users']['post']).toBeDefined();
    expect(pathItem['/users']['post'].requestBody).toBeDefined();
    expect(pathItem['/users']['post'].responses[200]).toBeDefined();
  });

  test('toPathItem includes summary when provided', () => {
    const route = httpContract({
      method: 'POST',
      path: '/users',
      summary: 'Create a new user',
      request: RequestContract,
      response: SuccessResponse,
    });

    const pathItem = route.toPathItem();
    expect(pathItem['/users']['post'].summary).toBe('Create a new user');
  });

  test('toPathItem includes operationId when provided', () => {
    const route = httpContract({
      method: 'GET',
      path: '/users/:id',
      operationId: 'getUser',
      request: RequestContract,
      response: SuccessResponse,
    });

    const pathItem = route.toPathItem();
    expect(pathItem['/users/:id']['get'].operationId).toBe('getUser');
  });

  test('toPathItem without method/path returns flat operation object', () => {
    const route = httpContract({
      request: RequestContract,
      response: SuccessResponse,
    });

    const pathItem = route.toPathItem();
    expect(pathItem.requestBody).toBeDefined();
    expect(pathItem.responses[200]).toBeDefined();
  });

  test('toPathItem reflects multi-status responses map', () => {
    const route = httpContract({
      method: 'POST',
      path: '/users',
      request: RequestContract,
      response: SuccessResponse,
      responses: {
        201: SuccessResponse,
        400: ErrorResponse,
      },
    });

    const pathItem = route.toPathItem();
    const operation = pathItem['/users']['post'];
    expect(operation.responses[201]).toBeDefined();
    expect(operation.responses[400]).toBeDefined();
    expect(operation.responses[201].description).toBe('Created');
    expect(operation.responses[400].description).toBe('Bad request');
  });

  test('summary and operationId are stored on the contract', () => {
    const route = httpContract({
      method: 'DELETE',
      path: '/users/:id',
      summary: 'Delete user',
      operationId: 'deleteUser',
      request: RequestContract,
      response: SuccessResponse,
    });

    expect(route.summary).toBe('Delete user');
    expect(route.operationId).toBe('deleteUser');
  });

  test('toOpenAPI remains unaffected by toPathItem additions', () => {
    const route = httpContract({
      method: 'POST',
      path: '/users',
      summary: 'Create user',
      request: RequestContract,
      response: SuccessResponse,
    });

    const openapi = route.toOpenAPI();
    // toOpenAPI does not include summary — stays as the operation-only shape
    expect(openapi.requestBody).toBeDefined();
    expect(openapi.responses[200]).toBeDefined();
    expect(openapi.summary).toBeUndefined();
  });
});
