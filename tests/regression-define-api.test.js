import { describe, expect, test } from 'bun:test';
import {
  Sigil,
  oneOf,
  optional,
  realType,
  sigil,
  union,
} from '../src/index.js';

describe('regression matrix — Define API', () => {
  test('public entry exports create object-definition contracts with sigil()', () => {
    const User = sigil({
      id: Number,
      name: String,
    });

    expect(User.check({ id: 1, name: 'Ada' })).toBe(true);
    expect(User.check({ id: '1', name: 'Ada' })).toBe(false);
    expect(User.describe()).toMatchObject({
      kind: 'object',
      exact: false,
    });
  });

  test('sigil.exact rejects extra keys', () => {
    const User = sigil.exact({ name: String });

    expect(User.check({ name: 'Ada' })).toBe(true);
    expect(User.check({ name: 'Ada', extra: true })).toBe(false);
    expect(User.describe()).toMatchObject({
      kind: 'object',
      exact: true,
    });
  });

  test('Sigil template API remains a stable advanced constructor', () => {
    const User = Sigil`
      {
        id: number
        name: string
      }
    `;

    expect(User.check({ id: 1, name: 'Ada' })).toBe(true);
    expect(User.check({ id: 1, name: 123 })).toBe(false);
  });

  test('optional fields may be absent or valid when present', () => {
    const User = sigil({
      name: String,
      age: optional(Number),
    });

    expect(User.check({ name: 'Ada' })).toBe(true);
    expect(User.check({ name: 'Ada', age: 37 })).toBe(true);
    expect(User.check({ name: 'Ada', age: '37' })).toBe(false);
  });

  test('union accepts allowed branches and rejects invalid branches', () => {
    const Resource = sigil({ id: union(String, Number) });

    expect(Resource.check({ id: 'user-1' })).toBe(true);
    expect(Resource.check({ id: 1 })).toBe(true);
    expect(Resource.check({ id: false })).toBe(false);
  });

  test('oneOf accepts documented literals and rejects invalid literals', () => {
    const User = sigil({ role: oneOf('admin', 'user', false, 1) });

    expect(User.check({ role: 'admin' })).toBe(true);
    expect(User.check({ role: 'user' })).toBe(true);
    expect(User.check({ role: false })).toBe(true);
    expect(User.check({ role: 1 })).toBe(true);
    expect(User.check({ role: 'guest' })).toBe(false);
  });

  test('realType returns stable labels for common runtime values', () => {
    expect(realType('hello')).toBe('string');
    expect(realType(42)).toBe('number');
    expect(realType(Number.NaN)).toBe('nan');
    expect(realType(true)).toBe('boolean');
    expect(realType(null)).toBe('null');
    expect(realType(undefined)).toBe('undefined');
    expect(realType([])).toBe('array');
    expect(realType({})).toBe('object');
    expect(realType(new Date())).toBe('date');
  });
});
