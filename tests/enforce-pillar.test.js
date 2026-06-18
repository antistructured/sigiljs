import { describe, test, expect } from 'bun:test';
import {
  Sigil,
  sigil,
  optional,
  oneOf,
  SigilValidationError,
} from '../src/index.js';

describe('Phase 3 Enforce pillar', () => {
  test('parse() returns trusted input when valid and throws SigilValidationError when invalid', () => {
    const User = sigil({ id: Number, name: String });
    const input = { id: 1, name: 'D' };

    expect(User.parse(input)).toBe(input);
    expect(() => User.parse({ id: '1', name: 'D' })).toThrow(
      SigilValidationError,
    );
  });

  test('safeParse() returns result objects and does not throw', () => {
    const User = sigil({ id: Number, name: String });

    expect(User.safeParse({ id: 1, name: 'D' })).toEqual({
      success: true,
      data: { id: 1, name: 'D' },
    });

    const result = User.safeParse({ id: '1', name: 'D' });
    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(SigilValidationError);
    expect(result.error.path).toEqual(['id']);
  });

  test('assert() and parse() are consistent', () => {
    const User = Sigil`{ id: number, name: string }`;
    const input = { id: 1, name: 'D' };

    expect(User.assert(input)).toBe(input);
    expect(User.parse(input)).toBe(input);

    for (const method of ['assert', 'parse']) {
      expect(() => User[method]({ id: 1, name: 42 })).toThrow(
        SigilValidationError,
      );
    }
  });

  test('path-aware errors report nested object and array failures', () => {
    const Payload = sigil({
      user: {
        profile: {
          ages: Array,
          primaryAge: Number,
        },
      },
    });

    const objectError = Payload.safeParse({
      user: { profile: { ages: [], primaryAge: 'old' } },
    });
    expect(objectError.success).toBe(false);
    expect(objectError.error.toJSON()).toMatchObject({
      code: 'SIGIL_VALIDATION_FAILED',
      path: ['user', 'profile', 'primaryAge'],
      expected: 'number',
      actual: 'string',
    });

    const List = Sigil`{ users: { age: number }[] }`;
    const arrayError = List.safeParse({ users: [{ age: 1 }, { age: 'old' }] });
    expect(arrayError.success).toBe(false);
    expect(arrayError.error.path).toEqual(['users', 1, 'age']);
    expect(arrayError.error.expected).toBe('number');
    expect(arrayError.error.actual).toBe('string');
  });

  test('SigilValidationError exposes the canonical developer-grade shape', () => {
    const User = Sigil`{ user: { age: number } }`;

    try {
      User.parse({ user: { age: 'old' } });
      throw new Error('Expected parse() to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(SigilValidationError);
      expect(error.name).toBe('SigilValidationError');
      expect(error.code).toBe('SIGIL_VALIDATION_FAILED');
      expect(error.message).toContain('age');
      expect(error.path).toEqual(['user', 'age']);
      expect(error.expected).toBe('number');
      expect(error.actual).toBe('string');
      expect(error.toJSON()).toEqual({
        code: 'SIGIL_VALIDATION_FAILED',
        message: error.message,
        path: ['user', 'age'],
        expected: 'number',
        actual: 'string',
      });
    }
  });

  test('check() remains a boolean-only fast path', () => {
    const User = Sigil`{ age: number }`;

    expect(User.check({ age: 1 })).toBe(true);
    expect(User.check({ age: 'old' })).toBe(false);
    expect(() => User.check({ age: 'old' })).not.toThrow();
  });

  test('exact mode enforcement is consistent for template and object syntax', () => {
    const LooseTemplate = Sigil`{ name: string }`;
    const ExactTemplate = Sigil.exact`{ name: string }`;
    const LooseObject = sigil({ name: String });
    const ExactObject = sigil.exact({ name: String });

    expect(LooseTemplate.check({ name: 'D', extra: true })).toBe(true);
    expect(LooseObject.check({ name: 'D', extra: true })).toBe(true);
    expect(ExactTemplate.check({ name: 'D', extra: true })).toBe(false);
    expect(ExactObject.check({ name: 'D', extra: true })).toBe(false);
  });

  test('safeParse supports optional fields and literal choices at boundaries', () => {
    const Lead = sigil.exact({
      name: String,
      budget: optional(Number),
      urgency: oneOf('low', 'medium', 'high'),
    });

    expect(Lead.safeParse({ name: 'D', urgency: 'high' }).success).toBe(true);
    expect(Lead.safeParse({ name: 'D', urgency: 'later' }).success).toBe(false);
  });
});
