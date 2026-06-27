import { describe, expect, test } from 'bun:test';
import { pipe, sigil, SigilValidationError, trim } from '../src/index.js';

describe('regression matrix — Transform / Serialize API', () => {
  test('parse applies field transforms and returns transformed data', () => {
    const User = sigil({ name: pipe(String, trim()) });
    const input = { name: '  Ada  ' };

    expect(User.parse(input)).toEqual({ name: 'Ada' });
    expect(input).toEqual({ name: '  Ada  ' });
  });

  test('parse applies contract transforms and revalidates transformed output', () => {
    const User = sigil({ id: Number, name: String }).transform((user) => ({
      ...user,
      name: user.name.trim(),
    }));

    expect(User.parse({ id: 1, name: '  Ada  ' })).toEqual({
      id: 1,
      name: 'Ada',
    });
  });

  test('transform output cannot silently violate the original contract shape', () => {
    const User = sigil({ id: Number }).transform((user) => ({
      ...user,
      id: String(user.id),
    }));

    expect(() => User.parse({ id: 1 })).toThrow(SigilValidationError);
  });

  test('safeParse success branch contains transformed data', () => {
    const User = sigil({ name: pipe(String, trim()) });

    expect(User.safeParse({ name: '  Ada  ' })).toEqual({
      success: true,
      data: { name: 'Ada' },
    });
  });

  test('serialize validates valid data and does not apply field or contract transforms', () => {
    const User = sigil({ name: pipe(String, trim()) }).transform((user) => ({
      ...user,
      name: user.name.toUpperCase(),
    }));
    const input = { name: '  Ada  ' };

    expect(User.serialize(input)).toBe(input);
    expect(User.serialize(input)).toEqual({ name: '  Ada  ' });
    expect(User.parse(input)).toEqual({ name: 'ADA' });
  });

  test('serialize throws SigilValidationError for invalid outbound data', () => {
    const User = sigil({ id: Number }).transform((user) => ({
      ...user,
      id: user.id + 1,
    }));

    expect(() => User.serialize({ id: '1' })).toThrow(SigilValidationError);
  });

  test('nested object transform behavior follows documented parse semantics', () => {
    const User = sigil({ profile: { name: pipe(String, trim()) } });

    expect(User.parse({ profile: { name: '  Ada  ' } })).toEqual({
      profile: { name: 'Ada' },
    });
  });
});
