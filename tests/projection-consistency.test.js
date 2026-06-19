import { describe, test, expect } from 'bun:test';
import { Sigil } from '../src/index.js';

const UserContract = () => Sigil.exact`{
  id: number
  name?: string
  role: "admin" | "user"
  tags: string[]
  profile: {
    displayName: string
    timezone?: string
  }
}`;

describe('Projection consistency', () => {
  test('describe(), JSON Schema, TypeScript, and OpenAPI agree on object shape', () => {
    const User = UserContract();

    expect(User.describe()).toEqual({
      kind: 'object',
      exact: true,
      properties: [
        { key: 'id', required: true, contract: { kind: 'number' } },
        { key: 'name', required: false, contract: { kind: 'string' } },
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
          key: 'tags',
          required: true,
          contract: { kind: 'array', element: { kind: 'string' } },
        },
        {
          key: 'profile',
          required: true,
          contract: {
            kind: 'object',
            exact: true,
            properties: [
              {
                key: 'displayName',
                required: true,
                contract: { kind: 'string' },
              },
              {
                key: 'timezone',
                required: false,
                contract: { kind: 'string' },
              },
            ],
          },
        },
      ],
    });

    const expectedJSONSchema = {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        role: { enum: ['admin', 'user'] },
        tags: { type: 'array', items: { type: 'string' } },
        profile: {
          type: 'object',
          properties: {
            displayName: { type: 'string' },
            timezone: { type: 'string' },
          },
          required: ['displayName'],
          additionalProperties: false,
        },
      },
      required: ['id', 'role', 'tags', 'profile'],
      additionalProperties: false,
    };

    expect(User.toJSONSchema()).toEqual(expectedJSONSchema);
    expect(User.toOpenAPI()).toEqual(expectedJSONSchema);
    expect(User.toTypeScript('User')).toBe(`type User = {
  id: number
  name?: string
  role: "admin" | "user"
  tags: string[]
  profile: {
  displayName: string
  timezone?: string
}
}`);
  });
});
