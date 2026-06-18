import { describe, test, expect } from 'bun:test';
import {
  Sigil,
  SigilValidationError,
  optional,
  pipe,
  sigil,
  trim,
} from '../src/index.js';

describe('Phase 4 Transform pillar', () => {
  test('contract-level transform validates input, transforms, then returns trusted output', () => {
    const User = sigil({
      id: Number,
      name: String,
    }).transform((user) => ({
      ...user,
      name: user.name.trim(),
    }));

    const input = { id: 1, name: '  Dana  ' };
    const parsed = User.parse(input);

    expect(parsed).toEqual({ id: 1, name: 'Dana' });
    expect(input.name).toBe('  Dana  ');
  });

  test('safeParse returns transformed data on success', () => {
    const Name = Sigil`string`.transform((value) => value.trim());

    expect(Name.safeParse('  Dana  ')).toEqual({
      success: true,
      data: 'Dana',
    });
  });

  test('field-level pipe() supports simple normalization', () => {
    const User = sigil({
      name: pipe(String, trim()),
      nickname: optional(pipe(String, trim())),
    });

    expect(
      User.parse({
        name: '  Dana  ',
        nickname: '  D  ',
      }),
    ).toEqual({ name: 'Dana', nickname: 'D' });

    expect(User.parse({ name: '  Dana  ' })).toEqual({ name: 'Dana' });
  });

  test('serialize() validates and returns a boundary-safe output', () => {
    const User = sigil({ id: Number, name: String }).transform((user) => ({
      ...user,
      name: user.name.trim(),
    }));

    expect(User.serialize({ id: 1, name: 'Dana' })).toEqual({
      id: 1,
      name: 'Dana',
    });
    expect(() => User.serialize({ id: '1', name: 'Dana' })).toThrow(
      SigilValidationError,
    );
  });

  test('loose mode preserves unknown keys through transform', () => {
    const User = sigil({ name: pipe(String, trim()) });

    expect(User.parse({ name: '  Dana  ', extra: true })).toEqual({
      name: 'Dana',
      extra: true,
    });
  });

  test('exact mode rejects unknown keys before transform', () => {
    const User = sigil.exact({ name: pipe(String, trim()) });

    expect(() => User.parse({ name: '  Dana  ', extra: true })).toThrow(
      SigilValidationError,
    );
  });

  test('transform output is revalidated and cannot silently become untrusted', () => {
    const User = sigil({ id: Number, name: String }).transform((user) => ({
      ...user,
      id: String(user.id),
    }));

    expect(() => User.parse({ id: 1, name: 'Dana' })).toThrow(
      SigilValidationError,
    );
  });

  test('chained transforms run in order', () => {
    const Name = Sigil`string`
      .transform((value) => value.trim())
      .transform((value) => value.toUpperCase());

    expect(Name.parse('  dana  ')).toBe('DANA');
  });
});
