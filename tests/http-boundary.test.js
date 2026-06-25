/**
 * Task 7 — HTTP Boundary Tests
 *
 * Comprehensive edge-case and error-path tests for httpContract().
 * All tests are offline, deterministic, and framework-neutral.
 */
import { describe, test, expect } from 'bun:test';
import { httpContract, oneOf, optional, sigil } from '../src/index.js';

const UserBody = sigil.exact({ name: String, email: String });
const UserResponse = sigil.exact({ id: Number, name: String });
const ParamsContract = sigil.exact({ id: String });
const QueryContract = sigil.exact({ page: Number, limit: Number });

// ─── Null / undefined / empty inputs ───────────────────────────────────────

describe('HTTP boundary — null/undefined/empty inputs', () => {
  const route = httpContract({ request: UserBody, response: UserResponse });

  test('parseRequest on null input returns empty parsed object', () => {
    const result = route.parseRequest(null);
    expect(typeof result).toBe('object');
  });

  test('parseRequest on undefined input returns empty parsed object', () => {
    const result = route.parseRequest(undefined);
    expect(typeof result).toBe('object');
  });

  test('parseRequest on empty object skips all parts', () => {
    const result = route.parseRequest({});
    expect(Object.keys(result)).toHaveLength(0);
  });

  test('safeParseRequest on null input succeeds (no parts required)', () => {
    const result = route.safeParseRequest(null);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});

// ─── Invalid body data ─────────────────────────────────────────────────────

describe('HTTP boundary — invalid body data', () => {
  const route = httpContract({ request: UserBody, response: UserResponse });

  test('parseRequest throws when body has wrong field types', () => {
    expect(() =>
      route.parseRequest({ body: { name: 123, email: 'x@x.com' } }),
    ).toThrow();
  });

  test('parseRequest throws when body is missing required fields', () => {
    expect(() =>
      route.parseRequest({ body: { name: 'Alex' } }), // missing email
    ).toThrow();
  });

  test('safeParseRequest returns failure with error on invalid body', () => {
    const result = route.safeParseRequest({ body: { name: 123, email: 'x@x.com' } });
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

// ─── Invalid params/query/headers data ────────────────────────────────────

describe('HTTP boundary — invalid params/query/headers', () => {
  const route = httpContract({
    request: UserBody,
    response: UserResponse,
    params: ParamsContract,
    query: QueryContract,
  });

  test('parseRequest throws when params fails validation', () => {
    expect(() =>
      route.parseRequest({
        params: { id: 42 }, // should be String
        body: { name: 'Alex', email: 'alex@example.com' },
      }),
    ).toThrow();
  });

  test('parseRequest error contains parts metadata', () => {
    try {
      route.parseRequest({ params: { id: 42 } });
    } catch (err) {
      expect(err.parts).toBeDefined();
      expect(Array.isArray(err.parts)).toBe(true);
      expect(err.parts[0].part).toBe('params');
    }
  });

  test('safeParseRequest returns failure when query fails', () => {
    const result = route.safeParseRequest({
      query: { page: 'not-a-number', limit: 10 },
    });
    expect(result.success).toBe(false);
  });
});

// ─── Request cache behavior ────────────────────────────────────────────────

describe('HTTP boundary — parseRequest cache behavior', () => {
  const route = httpContract({ request: UserBody, response: UserResponse });

  test('parseRequest returns the same frozen object for the same input reference', () => {
    const input = { body: { name: 'Alex', email: 'alex@example.com' } };
    const first = route.parseRequest(input);
    const second = route.parseRequest(input);
    expect(first).toBe(second); // referential equality — from cache
  });

  test('parseRequest result is frozen', () => {
    const input = { body: { name: 'Sam', email: 'sam@example.com' } };
    const result = route.parseRequest(input);
    expect(Object.isFrozen(result)).toBe(true);
  });
});

// ─── Response boundary ─────────────────────────────────────────────────────

describe('HTTP boundary — response parsing edge cases', () => {
  const route = httpContract({ request: UserBody, response: UserResponse });

  test('parseResponse with a flat body treats it as status 200', () => {
    const result = route.parseResponse({ id: 99, name: 'Jordan' });
    expect(result.status).toBe(200);
    expect(result.body.id).toBe(99);
  });

  test('parseResponse throws on invalid body', () => {
    expect(() =>
      route.parseResponse({ status: 200, body: { id: 'not-a-number', name: 'X' } }),
    ).toThrow();
  });

  test('safeParseResponse is safe and never throws', () => {
    const result = route.safeParseResponse({ status: 200, body: { id: 'bad', name: 'X' } });
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test('serializeResponse validates and returns body', () => {
    const serialized = route.serializeResponse({ id: 1, name: 'Alex' });
    expect(serialized).toEqual({ id: 1, name: 'Alex' });
  });

  test('safeSerializeResponse returns failure on invalid body', () => {
    const result = route.safeSerializeResponse({ id: 'bad', name: 'Alex' });
    expect(result.success).toBe(false);
  });
});

// ─── Multi-status response routing ────────────────────────────────────────

describe('HTTP boundary — multi-status response routing', () => {
  const ErrorResponse = sigil.exact({ code: String, message: String });

  const route = httpContract({
    request: UserBody,
    response: UserResponse,
    responses: {
      200: UserResponse,
      201: UserResponse,
      400: ErrorResponse,
      404: ErrorResponse,
    },
  });

  test('routes 200 to UserResponse contract', () => {
    const result = route.parseResponse({ status: 200, body: { id: 1, name: 'Alex' } });
    expect(result.status).toBe(200);
    expect(result.body.id).toBe(1);
  });

  test('routes 201 to UserResponse contract', () => {
    const result = route.parseResponse({ status: 201, body: { id: 2, name: 'Sam' } });
    expect(result.status).toBe(201);
    expect(result.body.name).toBe('Sam');
  });

  test('routes 400 to ErrorResponse contract', () => {
    const result = route.parseResponse({
      status: 400,
      body: { code: 'INVALID', message: 'Bad input' },
    });
    expect(result.status).toBe(400);
    expect(result.body.code).toBe('INVALID');
  });

  test('routes 404 to ErrorResponse contract', () => {
    const result = route.parseResponse({
      status: 404,
      body: { code: 'NOT_FOUND', message: 'User not found' },
    });
    expect(result.status).toBe(404);
    expect(result.body.code).toBe('NOT_FOUND');
  });

  test('falls back to primary response contract for unmapped status', () => {
    // Status 500 is not in the responses map — should fall back to primary response
    // and throw because the body doesn't match UserResponse
    expect(() =>
      route.parseResponse({
        status: 500,
        body: { code: 'SERVER_ERROR', message: 'Oops' },
      }),
    ).toThrow();
  });
});

// ─── Handler integration ───────────────────────────────────────────────────

describe('HTTP boundary — handler integration', () => {
  const GetUser = httpContract({
    method: 'GET',
    path: '/users/:id',
    request: UserBody,
    response: UserResponse,
    params: ParamsContract,
  });

  test('handler passes validated request to fn and serializes response', async () => {
    const handle = GetUser.handler(async (req) => {
      expect(req.params.id).toBe('user-42');
      return { id: 42, name: 'Dana' };
    });

    const result = await handle({
      params: { id: 'user-42' },
    });

    expect(result).toEqual({ id: 42, name: 'Dana' });
  });

  test('handler throws when params fail validation', async () => {
    const handle = GetUser.handler(async () => ({ id: 1, name: 'X' }));

    await expect(
      handle({ params: { id: 99 } }), // should be String
    ).rejects.toThrow();
  });
});

// ─── Contract object shape ─────────────────────────────────────────────────

describe('HTTP boundary — contract object shape', () => {
  test('contract is frozen', () => {
    const route = httpContract({ request: UserBody, response: UserResponse });
    expect(Object.isFrozen(route)).toBe(true);
  });

  test('requestParts is frozen', () => {
    const route = httpContract({ request: UserBody, response: UserResponse });
    expect(Object.isFrozen(route.requestParts)).toBe(true);
  });

  test('contract exposes all expected methods', () => {
    const route = httpContract({ request: UserBody, response: UserResponse });
    expect(typeof route.parseRequest).toBe('function');
    expect(typeof route.safeParseRequest).toBe('function');
    expect(typeof route.parseResponse).toBe('function');
    expect(typeof route.safeParseResponse).toBe('function');
    expect(typeof route.serializeResponse).toBe('function');
    expect(typeof route.safeSerializeResponse).toBe('function');
    expect(typeof route.toOpenAPI).toBe('function');
    expect(typeof route.toPathItem).toBe('function');
    expect(typeof route.handler).toBe('function');
  });

  test('contract kind is sigil.httpContract', () => {
    const route = httpContract({ request: UserBody, response: UserResponse });
    expect(route.kind).toBe('sigil.httpContract');
  });
});

// ─── Framework neutrality ──────────────────────────────────────────────────

describe('HTTP boundary — framework neutrality', () => {
  test('no framework-specific object is required', () => {
    const route = httpContract({ request: UserBody, response: UserResponse });
    // All helpers accept plain objects
    const parsed = route.parseRequest({ body: { name: 'Alex', email: 'alex@example.com' } });
    expect(parsed.body).toBeDefined();
  });

  test('parseRequest does not reference global Request or Response', () => {
    // If a framework-specific global were required, this would throw in a non-framework env
    const route = httpContract({ request: UserBody, response: UserResponse });
    expect(() => route.parseRequest({})).not.toThrow();
  });
});
