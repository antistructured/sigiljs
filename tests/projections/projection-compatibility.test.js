import { beforeEach, describe, expect, test } from 'bun:test';
import { Sigil, oneOf, optional, sigil, union } from '../../src/index.js';
import { clear } from '../../src/core/registry.js';

function userContract() {
  const Email = Sigil.define('Email')`string`;

  return sigil
    .exact({
      id: union(String, Number),
      name: String,
      role: oneOf('admin', 'user'),
      email: Email,
      profile: {
        age: optional(Number),
        tags: Sigil`string[]`,
      },
    })
    .withMetadata({
      name: 'User',
      version: '1.0.0',
    });
}

function property(description, key) {
  return description.properties.find((field) => field.key === key);
}

describe('Projection compatibility', () => {
  beforeEach(() => {
    clear();
  });

  test('describe(), JSON Schema, TypeScript, and OpenAPI agree on contract meaning', () => {
    const User = userContract();

    const expectedDescription = {
      kind: 'object',
      exact: true,
      properties: [
        {
          key: 'id',
          required: true,
          contract: {
            kind: 'union',
            variants: [{ kind: 'string' }, { kind: 'number' }],
          },
        },
        { key: 'name', required: true, contract: { kind: 'string' } },
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
        {
          key: 'email',
          required: true,
          contract: { kind: 'reference', name: 'Email' },
        },
        {
          key: 'profile',
          required: true,
          contract: {
            kind: 'object',
            exact: true,
            properties: [
              { key: 'age', required: false, contract: { kind: 'number' } },
              {
                key: 'tags',
                required: true,
                contract: { kind: 'array', element: { kind: 'string' } },
              },
            ],
          },
        },
      ],
      metadata: {
        name: 'User',
        version: '1.0.0',
      },
    };

    const expectedSchema = {
      title: 'User',
      'x-version': '1.0.0',
      type: 'object',
      properties: {
        id: { type: ['string', 'number'] },
        name: { type: 'string' },
        role: { enum: ['admin', 'user'] },
        email: { $ref: '#/$defs/Email' },
        profile: {
          type: 'object',
          properties: {
            age: { type: 'number' },
            tags: { type: 'array', items: { type: 'string' } },
          },
          required: ['tags'],
          additionalProperties: false,
        },
      },
      required: ['id', 'name', 'role', 'email', 'profile'],
      additionalProperties: false,
    };

    const expectedTypeScript = `/**
 * @version 1.0.0
 */
type User = {
  id: string | number
  name: string
  role: "admin" | "user"
  email: Email
  profile: {
    age?: number
    tags: string[]
  }
}`;

    const description = User.describe();
    const jsonSchema = User.toJSONSchema();
    const openapi = User.toOpenAPI();
    const typescript = User.toTypeScript('User');

    expect(description).toEqual(expectedDescription);
    expect(jsonSchema).toEqual(expectedSchema);
    expect(openapi).toEqual(expectedSchema);
    expect(typescript).toBe(expectedTypeScript);

    expect(description.metadata.name).toBe(jsonSchema.title);
    expect(description.metadata.name).toBe(openapi.title);
    expect(description.metadata.version).toBe(jsonSchema['x-version']);
    expect(description.metadata.version).toBe(openapi['x-version']);
    expect(typescript).toContain('@version 1.0.0');

    expect(description.exact).toBe(true);
    expect(jsonSchema.additionalProperties).toBe(false);
    expect(openapi.additionalProperties).toBe(false);

    expect(
      description.properties
        .filter((field) => field.required)
        .map((field) => field.key),
    ).toEqual(jsonSchema.required);
    expect(openapi.required).toEqual(jsonSchema.required);
    expect(typescript).toContain('name: string');
    expect(typescript).toContain('profile: {');

    const profileDescription = property(description, 'profile').contract;
    const profileSchema = jsonSchema.properties.profile;
    expect(property(profileDescription, 'age').required).toBe(false);
    expect(property(profileDescription, 'tags').required).toBe(true);
    expect(profileSchema.required).toEqual(['tags']);
    expect(openapi.properties.profile.required).toEqual(['tags']);
    expect(typescript).toContain('age?: number');
    expect(typescript).toContain('tags: string[]');

    expect(property(description, 'id').contract).toEqual({
      kind: 'union',
      variants: [{ kind: 'string' }, { kind: 'number' }],
    });
    expect(jsonSchema.properties.id).toEqual({ type: ['string', 'number'] });
    expect(openapi.properties.id).toEqual({ type: ['string', 'number'] });
    expect(typescript).toContain('id: string | number');

    expect(property(description, 'role').contract).toEqual({
      kind: 'union',
      variants: [
        { kind: 'literal', value: 'admin' },
        { kind: 'literal', value: 'user' },
      ],
    });
    expect(jsonSchema.properties.role).toEqual({ enum: ['admin', 'user'] });
    expect(openapi.properties.role).toEqual({ enum: ['admin', 'user'] });
    expect(typescript).toContain('role: "admin" | "user"');

    expect(property(description, 'email').contract).toEqual({
      kind: 'reference',
      name: 'Email',
    });
    expect(jsonSchema.properties.email).toEqual({ $ref: '#/$defs/Email' });
    expect(openapi.properties.email).toEqual({ $ref: '#/$defs/Email' });
    expect(typescript).toContain('email: Email');
  });

  test('projection outputs are deterministic, and mock()/cases() remain compatible', () => {
    const User = userContract();

    expect(User.describe()).toEqual(User.describe());
    expect(User.toJSONSchema()).toEqual(User.toJSONSchema());
    expect(User.toOpenAPI()).toEqual(User.toOpenAPI());
    expect(User.toTypeScript('User')).toBe(User.toTypeScript('User'));

    expect(User.mock()).toEqual({
      id: 'string',
      name: 'string',
      role: 'admin',
      email: 'string',
      profile: {
        tags: ['string'],
      },
    });
    expect(User.mock()).toEqual(User.mock());
    expect(User.check(User.mock())).toBe(true);

    expect(User.cases()).toEqual({
      valid: [
        {
          id: 'string',
          name: 'string',
          role: 'admin',
          email: 'string',
          profile: {
            tags: ['string'],
          },
        },
      ],
      invalid: [
        {
          name: 'string',
          role: 'admin',
          email: 'string',
          profile: {
            tags: ['string'],
          },
        },
      ],
    });
    expect(User.cases()).toEqual(User.cases());
    expect(User.cases().valid.every((value) => User.check(value))).toBe(true);
    expect(User.cases().invalid.every((value) => User.check(value))).toBe(
      false,
    );
  });
});
