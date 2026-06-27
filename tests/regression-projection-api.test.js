import { describe, expect, test } from 'bun:test';
import { oneOf, optional, sigil, Sigil } from '../src/index.js';

describe('regression matrix — Projection API', () => {
  test('describe returns a deterministic fresh public description object', () => {
    const User = sigil.exact({ name: String, age: optional(Number), role: oneOf('admin', 'user') });

    expect(User.describe()).toEqual({
      kind: 'object',
      exact: true,
      properties: [
        { key: 'name', required: true, contract: { kind: 'string' } },
        { key: 'age', required: false, contract: { kind: 'number' } },
        {
          key: 'role',
          required: true,
          contract: {
            kind: 'union',
            variants: [
              { kind: 'literal', value: 'admin' },
              { kind: 'literal', value: 'user' },
            ],
          },
        },
      ],
    });
    expect(User.describe()).not.toBe(User.describe());
  });

  test('toJSONSchema returns deterministic JSON Schema subset output', () => {
    const User = sigil.exact({ name: String, age: optional(Number), role: oneOf('admin', 'user') });

    expect(User.toJSONSchema()).toEqual({
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        role: { enum: ['admin', 'user'] },
      },
      required: ['name', 'role'],
      additionalProperties: false,
    });
  });

  test('toTypeScript returns deterministic declaration output', () => {
    const User = sigil.exact({ name: String, age: optional(Number), role: oneOf('admin', 'user') });

    expect(User.toTypeScript('User')).toBe(
      'type User = {\n  name: string\n  age?: number\n  role: "admin" | "user"\n}',
    );
  });

  test('toOpenAPI returns deterministic schema-level clone output', () => {
    const User = sigil.exact({ name: String, age: optional(Number) });
    const schema = User.toJSONSchema();
    const openapi = User.toOpenAPI();

    expect(openapi).toEqual(schema);
    expect(openapi).not.toBe(schema);
  });

  test('metadata projection stays deterministic for JSON Schema and TypeScript', () => {
    const User = sigil({ name: String }, {
      name: 'User',
      version: '1.0.0',
      description: 'User contract',
      tags: ['core'],
    });

    expect(User.toJSONSchema()).toEqual({
      title: 'User',
      description: 'User contract',
      'x-version': '1.0.0',
      'x-tags': ['core'],
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    });
    expect(User.toTypeScript()).toBe(
      '/**\n * User contract\n * @version 1.0.0\n * @tags core\n */\ntype User = {\n  name: string\n}',
    );
  });

  test('unsupported JSON Schema projection exposes documented structured error fields', () => {
    const error = (() => {
      try {
        Sigil`symbol`.toJSONSchema();
      } catch (value) {
        return value;
      }
    })();

    expect(error).toMatchObject({
      code: 'SIGIL_PROJECTION_FAILED',
      projection: 'json-schema',
      path: [],
      reason: 'unsupported_kind',
      kind: 'symbol',
    });
  });

  test('toFormConstraints remains available but explicitly experimental', () => {
    const User = sigil({ name: String });

    expect(User.toFormConstraints()).toEqual({
      fields: {
        name: {
          name: 'name',
          path: ['name'],
          required: true,
          label: 'Name',
          type: 'text',
        },
      },
    });
  });
});
