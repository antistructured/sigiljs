import { describe, expect, test } from 'bun:test';
import {
  sigil,
  optional,
  union,
  oneOf,
  realType,
  Sigil,
  httpContract,
  SigilValidationError,
} from '../src/index.js';

describe('Public API (behavioral)', () => {
  test('sigil() creates an object contract', () => {
    const User = sigil({ name: String, age: Number });
    expect(User.kind).toBe('sigil.contract');
    expect(typeof User.check).toBe('function');
  });

  test('sigil.exact() rejects extra keys', () => {
    const Exact = sigil.exact({ id: Number });
    expect(Exact.check({ id: 1, extra: true })).toBe(false);
    expect(Exact.check({ id: 1 })).toBe(true);
  });

  test('optional() marks fields optional', () => {
    const User = sigil({ name: String, age: optional(Number) });
    expect(User.check({ name: 'Ada' })).toBe(true);
    expect(User.check({ name: 'Ada', age: 30 })).toBe(true);
    expect(User.check({ age: 30 })).toBe(false);
  });

  test('union() matches multiple primitive types', () => {
    const Id = sigil({ id: union(String, Number) });
    expect(Id.check({ id: 'abc' })).toBe(true);
    expect(Id.check({ id: 123 })).toBe(true);
    expect(Id.check({ id: true })).toBe(false);
  });

  test('oneOf() creates literal union contracts', () => {
    const Role = sigil({ role: oneOf('admin', 'user', 'guest') });
    expect(Role.check({ role: 'admin' })).toBe(true);
    expect(Role.check({ role: 'superadmin' })).toBe(false);
  });

  test('check() returns boolean', () => {
    const User = sigil({ name: String });
    expect(User.check({ name: 'Ada' })).toBe(true);
    expect(User.check({ name: 123 })).toBe(false);
  });

  test('parse() returns trusted data or throws', () => {
    const User = sigil({ name: String });
    const input = { name: 'Ada' };
    expect(User.parse(input)).toBe(input);
    expect(() => User.parse({ name: 123 })).toThrow(SigilValidationError);
  });

  test('safeParse() returns result objects', () => {
    const User = sigil({ name: String });
    const success = User.safeParse({ name: 'Ada' });
    const failure = User.safeParse({ name: 123 });

    expect(success.success).toBe(true);
    expect(success.data.name).toBe('Ada');
    expect(failure.success).toBe(false);
    expect(failure.error).toBeInstanceOf(SigilValidationError);
  });

  test('assert() returns trusted data or throws', () => {
    const User = sigil({ name: String });
    const input = { name: 'Ada' };
    expect(User.assert(input)).toBe(input);
    expect(() => User.assert({ name: 123 })).toThrow(SigilValidationError);
  });

  test('describe() returns a stable plain-object description', () => {
    const User = sigil({ name: String, age: optional(Number) });
    const description = User.describe();

    expect(description.kind).toBe('object');
    expect(description.exact).toBe(false);
    expect(description.properties).toHaveLength(2);
    expect(description.properties[0].key).toBe('name');
    expect(description.properties[0].required).toBe(true);
    expect(description.properties[1].key).toBe('age');
    expect(description.properties[1].required).toBe(false);
  });

  test('toJSONSchema() projects a JSON Schema-like object', () => {
    const User = sigil({ name: String, age: optional(Number) });
    const schema = User.toJSONSchema();

    expect(schema.type).toBe('object');
    expect(schema.properties.name.type).toBe('string');
    expect(schema.properties.age.type).toBe('number');
    expect(schema.required).toEqual(['name']);
  });

  test('toTypeScript() emits a TypeScript type declaration', () => {
    const User = sigil({ name: String, age: optional(Number) });
    const typeScript = User.toTypeScript('User');

    expect(typeScript).toContain('type User =');
    expect(typeScript).toContain('name: string');
    expect(typeScript).toContain('age?: number');
  });

  test('toOpenAPI() returns an OpenAPI-compatible schema', () => {
    const User = sigil({ name: String, age: optional(Number) });
    const openapi = User.toOpenAPI();

    expect(openapi.type).toBe('object');
    expect(openapi.properties.name.type).toBe('string');
    expect(openapi.required).toEqual(['name']);
  });

  test('diff() compares two contracts for lifecycle changes', () => {
    const v1 = sigil({ name: String });
    const v2 = sigil({ name: String, age: optional(Number) });

    const changes = v2.diff(v1);
    expect(Array.isArray(changes)).toBe(true);
    expect(changes.length).toBeGreaterThan(0);
  });

  test('realType() returns precise runtime type labels', () => {
    expect(realType('hello')).toBe('string');
    expect(realType(42)).toBe('number');
    expect(realType(true)).toBe('boolean');
    expect(realType(null)).toBe('null');
    expect(realType([])).toBe('array');
    expect(realType({})).toBe('object');
    expect(realType(undefined)).toBe('undefined');
  });
});

describe('Experimental API availability', () => {
  test('httpContract is exported and callable', () => {
    const Request = sigil({ email: String });
    const Response = sigil({ token: String });

    expect(typeof httpContract).toBe('function');

    const Login = httpContract({ request: Request, response: Response });
    expect(Login.kind).toBe('sigil.httpContract');
    expect(typeof Login.parseRequest).toBe('function');
    expect(typeof Login.serializeResponse).toBe('function');
  });

  test('toFormConstraints exists on object contracts without crashing', () => {
    const User = sigil({ name: String, age: optional(Number) });
    expect(typeof User.toFormConstraints).toBe('function');
    expect(() => User.toFormConstraints()).not.toThrow();
  });
});
