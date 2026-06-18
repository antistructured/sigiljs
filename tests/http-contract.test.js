import { describe, test, expect } from 'bun:test';
import {
  httpContract,
  oneOf,
  optional,
  sigil,
  SigilValidationError,
} from '../src/index.js';

describe('Phase 11 HTTP boundary helpers', () => {
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
      email: 'dana@example.com',
      password: 'secret',
    });
    const response = Login.serializeResponse({
      token: 'token_123',
      role: 'admin',
    });

    expect(request.email).toBe('dana@example.com');
    expect(response.role).toBe('admin');
  });

  test('safe request/response helpers never throw', () => {
    const Login = httpContract({
      request: LoginRequest,
      response: LoginResponse,
    });

    const request = Login.safeParseRequest({
      email: 'dana@example.com',
    });
    const response = Login.safeSerializeResponse({
      token: 'token_123',
      role: 'owner',
    });

    expect(request.success).toBe(false);
    expect(request.error).toBeInstanceOf(SigilValidationError);
    expect(response.success).toBe(false);
    expect(response.error).toBeInstanceOf(SigilValidationError);
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
      expect(request.email).toBe('dana@example.com');
      return {
        token: 'token_123',
        role: 'user',
      };
    });

    await expect(
      handle({
        email: 'dana@example.com',
        password: 'secret',
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

    expect(Login.parseRequest.length).toBe(1);
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
