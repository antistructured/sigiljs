import { describe, expect, test } from 'bun:test';
import { pipe, sigil, SigilValidationError, trim } from '../src/index.js';

describe('stable core — transform / serialize semantics', () => {
  test('parse validates input, applies field transforms, then returns transformed data', () => {
    const User = sigil({ name: pipe(String, trim()) });
    const input = { name: '  Ada  ' };

    expect(User.parse(input)).toEqual({ name: 'Ada' });
    expect(input).toEqual({ name: '  Ada  ' });
  });

  test('contract-level transform validates input, applies transform, then revalidates output', () => {
    const User = sigil({ id: Number, name: String }).transform((user) => ({
      ...user,
      name: user.name.trim(),
    }));

    expect(User.parse({ id: 1, name: '  Ada  ' })).toEqual({
      id: 1,
      name: 'Ada',
    });
  });

  test('transform output cannot silently violate the contract shape', () => {
    const User = sigil({ id: Number }).transform((user) => ({
      ...user,
      id: String(user.id),
    }));

    expect(() => User.parse({ id: 1 })).toThrow(SigilValidationError);
  });

  test('safeParse success data includes transformed output', () => {
    const User = sigil({ name: pipe(String, trim()) });

    expect(User.safeParse({ name: '  Ada  ' })).toEqual({
      success: true,
      data: { name: 'Ada' },
    });
  });

  test('serialize validates and returns the original valid value without applying transforms', () => {
    const User = sigil({ name: pipe(String, trim()) }).transform((user) => ({
      ...user,
      name: user.name.toUpperCase(),
    }));
    const input = { name: '  Ada  ' };

    expect(User.serialize(input)).toBe(input);
    expect(User.serialize(input)).toEqual({ name: '  Ada  ' });
  });

  test('serialize throws structured validation error for invalid output data', () => {
    const User = sigil({ id: Number }).transform((user) => ({
      ...user,
      id: user.id + 1,
    }));

    expect(() => User.serialize({ id: '1' })).toThrow(SigilValidationError);
  });

  test('parse and serialize intentionally differ for transformed contracts', () => {
    const User = sigil({ name: pipe(String, trim()) }).transform((user) => ({
      ...user,
      name: user.name.toUpperCase(),
    }));
    const input = { name: '  Ada  ' };

    expect(User.parse(input)).toEqual({ name: 'ADA' });
    expect(User.serialize(input)).toEqual({ name: '  Ada  ' });
  });
});
