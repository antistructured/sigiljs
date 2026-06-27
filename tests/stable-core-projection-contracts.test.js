import { describe, expect, test } from 'bun:test';
import { oneOf, optional, sigil, Sigil } from '../src/index.js';
import { SigilProjectionError } from '../src/projection-error.js';

describe('stable core — projection output contracts', () => {
  test('describe returns a deterministic plain contract description', () => {
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
    expect(User.describe()).toEqual(User.describe());
    expect(User.describe()).not.toBe(User.describe());
  });

  test('toJSONSchema returns deterministic SigilJS JSON Schema subset output', () => {
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

  test('toTypeScript returns a deterministic type declaration string', () => {
    const User = sigil.exact({ name: String, age: optional(Number), role: oneOf('admin', 'user') });

    expect(User.toTypeScript('User')).toBe(
      'type User = {\n  name: string\n  age?: number\n  role: "admin" | "user"\n}',
    );
  });

  test('toOpenAPI returns a deterministic cloned schema-level object', () => {
    const User = sigil.exact({ name: String, age: optional(Number) });
    const jsonSchema = User.toJSONSchema();
    const openapi = User.toOpenAPI();

    expect(openapi).toEqual(jsonSchema);
    expect(openapi).not.toBe(jsonSchema);
  });

  test('metadata projects into JSON Schema and TypeScript output deterministically', () => {
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

  test('unsupported JSON Schema projection throws structured projection error', () => {
    const error = (() => {
      try {
        Sigil`symbol`.toJSONSchema();
      } catch (value) {
        return value;
      }
    })();

    expect(error).toBeInstanceOf(SigilProjectionError);
    expect(error.code).toBe('SIGIL_PROJECTION_FAILED');
    expect(error.projection).toBe('json-schema');
    expect(error.path).toEqual([]);
    expect(error.reason).toBe('unsupported_kind');
    expect(error.kind).toBe('symbol');
  });

  test('toFormConstraints remains an experimental projection surface', () => {
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
