import { describe, expect, test } from 'bun:test';
import { sigil, SigilValidationError } from '../src/index.js';

function captureError(fn) {
  try {
    fn();
  } catch (error) {
    return error;
  }
  throw new Error('Expected function to throw');
}

describe('regression matrix — Enforce API', () => {
  test('check returns booleans for valid and invalid values', () => {
    const User = sigil({ name: String });

    expect(User.check({ name: 'Ada' })).toBe(true);
    expect(User.check({ name: 123 })).toBe(false);
    expect(() => User.check({ name: 123 })).not.toThrow();
  });

  test('parse returns data for valid values and throws stable error shape for invalid values', () => {
    const User = sigil({ name: String });
    const input = { name: 'Ada' };

    expect(User.parse(input)).toBe(input);

    const error = captureError(() => User.parse({ name: 123 }));
    expect(error).toBeInstanceOf(SigilValidationError);
    expect(error).toMatchObject({
      name: 'SigilValidationError',
      code: 'SIGIL_VALIDATION_FAILED',
      path: ['name'],
      expected: 'string',
      actual: 'number',
    });
  });

  test('assert returns valid data and throws stable error shape for invalid values', () => {
    const User = sigil({ active: Boolean });
    const input = { active: true };

    expect(User.assert(input)).toBe(input);

    const error = captureError(() => User.assert({ active: 'yes' }));
    expect(error).toBeInstanceOf(SigilValidationError);
    expect(error.toJSON()).toEqual({
      code: 'SIGIL_VALIDATION_FAILED',
      message: 'Expected property "active" to be boolean, got string',
      path: ['active'],
      expected: 'boolean',
      actual: 'string',
    });
  });

  test('safeParse(valid) returns success branch with data only', () => {
    const User = sigil({ name: String });
    const input = { name: 'Ada' };
    const result = User.safeParse(input);

    expect(result).toEqual({ success: true, data: input });
    expect('error' in result).toBe(false);
  });

  test('safeParse(invalid) returns failure branch with error only and does not throw', () => {
    const User = sigil({ name: String });

    expect(() => User.safeParse({ name: 123 })).not.toThrow();

    const result = User.safeParse({ name: 123 });
    expect(result.success).toBe(false);
    expect('data' in result).toBe(false);
    expect(result.error).toBeInstanceOf(SigilValidationError);
    expect(result.error.path).toEqual(['name']);
  });

  test('nested error path is stable', () => {
    const User = sigil({ profile: { email: String } });
    const result = User.safeParse({ profile: { email: false } });

    expect(result.success).toBe(false);
    expect(result.error.path).toEqual(['profile', 'email']);
    expect(result.error.expected).toBe('string');
    expect(result.error.actual).toBe('boolean');
  });

  test('exact object extra-key failure path is stable', () => {
    const User = sigil.exact({ name: String });
    const error = captureError(() => User.parse({ name: 'Ada', admin: true }));

    expect(error).toBeInstanceOf(SigilValidationError);
    expect(error.path).toEqual(['admin']);
    expect(error.expected).toBe('never');
    expect(error.actual).toBe('boolean');
  });
});
