import { describe, test, expect } from 'bun:test';
import { oneOf, optional, sigil } from '../src/index.js';

describe('Phase 13 Contract lifecycle diff', () => {
  test('diff() returns deterministic change entries for object lifecycle drift', () => {
    const UserV1 = sigil(
      {
        id: Number,
        username: String,
        age: Number,
        email: optional(String),
        role: oneOf('admin', 'user'),
        profile: {
          displayName: String,
          timezone: optional(String),
        },
      },
      { name: 'User', version: '1.0.0' },
    );
    const UserV2 = sigil.exact(
      {
        id: Number,
        displayName: String,
        age: String,
        email: String,
        role: oneOf('admin', 'user', 'owner'),
        profile: {
          displayName: String,
          locale: String,
        },
      },
      { name: 'User', version: '1.1.0' },
    );

    expect(UserV2.diff(UserV1)).toEqual([
      {
        kind: 'property.added',
        path: ['displayName'],
        contract: { kind: 'string' },
        impact: 'non-breaking',
      },
      {
        kind: 'property.changed',
        path: ['age'],
        from: { kind: 'number' },
        to: { kind: 'string' },
        impact: 'breaking',
      },
      {
        kind: 'property.required_changed',
        path: ['email'],
        from: false,
        to: true,
        impact: 'breaking',
      },
      {
        kind: 'property.changed',
        path: ['role'],
        from: {
          kind: 'union',
          variants: [
            { kind: 'literal', value: 'admin' },
            { kind: 'literal', value: 'user' },
          ],
        },
        to: {
          kind: 'union',
          variants: [
            { kind: 'literal', value: 'admin' },
            { kind: 'literal', value: 'user' },
            { kind: 'literal', value: 'owner' },
          ],
        },
        impact: 'unknown',
      },
      {
        kind: 'property.added',
        path: ['profile', 'locale'],
        contract: { kind: 'string' },
        impact: 'non-breaking',
      },
      {
        kind: 'property.removed',
        path: ['profile', 'timezone'],
        contract: { kind: 'string' },
        impact: 'breaking',
      },
      {
        kind: 'object.exact_changed',
        path: ['profile'],
        from: false,
        to: true,
        impact: 'breaking',
      },
      {
        kind: 'property.removed',
        path: ['username'],
        contract: { kind: 'string' },
        impact: 'breaking',
      },
      {
        kind: 'object.exact_changed',
        path: [],
        from: false,
        to: true,
        impact: 'breaking',
      },
      {
        kind: 'metadata.version_changed',
        path: ['metadata', 'version'],
        from: '1.0.0',
        to: '1.1.0',
        impact: 'unknown',
      },
    ]);
  });

  test('diff() reports property became optional as non-breaking', () => {
    const UserV1 = sigil({ email: String });
    const UserV2 = sigil({ email: optional(String) });

    expect(UserV2.diff(UserV1)).toEqual([
      {
        kind: 'property.required_changed',
        path: ['email'],
        from: true,
        to: false,
        impact: 'non-breaking',
      },
    ]);
  });

  test('diff() reports literal union changes deterministically', () => {
    const UserV1 = sigil({ role: oneOf('admin', 'user') });
    const UserV2 = sigil({ role: oneOf('admin', 'user', 'owner') });

    expect(UserV2.diff(UserV1)).toEqual([
      {
        kind: 'property.changed',
        path: ['role'],
        from: {
          kind: 'union',
          variants: [
            { kind: 'literal', value: 'admin' },
            { kind: 'literal', value: 'user' },
          ],
        },
        to: {
          kind: 'union',
          variants: [
            { kind: 'literal', value: 'admin' },
            { kind: 'literal', value: 'user' },
            { kind: 'literal', value: 'owner' },
          ],
        },
        impact: 'unknown',
      },
    ]);
  });

  test('diff() reports empty arrays when contracts are compatible', () => {
    const UserV1 = sigil({ name: String });
    const UserV2 = sigil({ name: String });

    expect(UserV2.diff(UserV1)).toEqual([]);
    expect(UserV2.diff(UserV1)).toEqual(UserV2.diff(UserV1));
  });

  test('diff() requires object contracts for the initial lifecycle diff', () => {
    const User = sigil({ name: String });
    const Name = sigil(String);

    expect(() => User.diff(Name)).toThrow(
      'Contract diff currently supports object contracts only',
    );
    expect(() => Name.diff(User)).toThrow(
      'Contract diff currently supports object contracts only',
    );
  });
});
