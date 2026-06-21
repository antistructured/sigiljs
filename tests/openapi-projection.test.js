import { describe, test, expect } from 'bun:test';
import { Sigil, oneOf, optional, sigil } from '../src/index.js';

describe('Phase 8 OpenAPI projection', () => {
  test('projects contracts to OpenAPI-compatible schemas using JSON Schema as the base', () => {
    const User = sigil.exact({
      id: Number,
      name: String,
      role: oneOf('admin', 'user'),
      age: optional(Number),
    });

    expect(User.toOpenAPI()).toEqual({
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        role: { enum: ['admin', 'user'] },
        age: { type: 'number' },
      },
      required: ['id', 'name', 'role'],
      additionalProperties: false,
    });
  });

  test('returns a fresh projection object', () => {
    const User = sigil({ id: Number });
    const first = User.toOpenAPI();
    first.properties.id.type = 'string';

    expect(User.toOpenAPI()).toEqual({
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
      required: ['id'],
    });
  });

  test('projects contract metadata into OpenAPI-compatible schemas', () => {
    const User = sigil({ id: Number }).withMetadata({
      name: 'User',
      version: '1.2.0',
      description: 'Trusted user boundary object.',
      tags: ['api', 'user'],
    });

    expect(User.toOpenAPI()).toEqual({
      title: 'User',
      description: 'Trusted user boundary object.',
      'x-version': '1.2.0',
      'x-tags': ['api', 'user'],
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
      required: ['id'],
    });
  });

  test('projects nested contracts with arrays, optional fields, literal unions, and exact mode', () => {
    const User = sigil.exact({
      id: Number,
      profile: sigil.exact({
        displayName: String,
        timezone: optional(String),
        roles: Sigil`"admin"[]`,
      }),
    });

    const expected = {
      type: 'object',
      properties: {
        id: { type: 'number' },
        profile: {
          type: 'object',
          properties: {
            displayName: { type: 'string' },
            timezone: { type: 'string' },
            roles: {
              type: 'array',
              items: { const: 'admin' },
            },
          },
          required: ['displayName', 'roles'],
          additionalProperties: false,
        },
      },
      required: ['id', 'profile'],
      additionalProperties: false,
    };

    expect(User.toOpenAPI()).toEqual(expected);
    expect(User.toOpenAPI()).toEqual(expected);
  });
});
