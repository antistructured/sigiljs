import { describe, test, expect } from 'bun:test';
import { oneOf, optional, sigil } from '../src/index.js';

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
});
