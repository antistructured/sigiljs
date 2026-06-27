import { describe, expect, test } from 'bun:test';
import { sigil, SigilValidationError } from '../src/index.js';

describe('stable core — safeParse result shape', () => {
  test('safeParse(valid) returns success true with data only', () => {
    const User = sigil({ name: String });
    const input = { name: 'Ada' };
    const result = User.safeParse(input);

    expect(result.success).toBe(true);
    expect(result.data).toBe(input);
    expect('error' in result).toBe(false);
    expect(Object.keys(result).sort()).toEqual(['data', 'success']);
  });

  test('safeParse(invalid) returns success false with error only', () => {
    const User = sigil({ name: String });
    const result = User.safeParse({ name: 123 });

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(SigilValidationError);
    expect('data' in result).toBe(false);
    expect(Object.keys(result).sort()).toEqual(['error', 'success']);
  });

  test('safeParse does not throw for ordinary validation failure', () => {
    const User = sigil({ count: Number });

    expect(() => User.safeParse({ count: 'many' })).not.toThrow();
    expect(User.safeParse({ count: 'many' }).success).toBe(false);
  });

  test('safeParse preserves structured validation error details', () => {
    const User = sigil({ count: Number });
    const result = User.safeParse({ count: 'many' });

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(SigilValidationError);
    expect(result.error.toJSON()).toEqual({
      code: 'SIGIL_VALIDATION_FAILED',
      message: 'Expected property "count" to be number, got string',
      path: ['count'],
      expected: 'number',
      actual: 'string',
    });
  });

  test('safeParse handles nested invalid data without throwing', () => {
    const User = sigil({ profile: { email: String } });
    const result = User.safeParse({ profile: { email: false } });

    expect(result.success).toBe(false);
    expect(result.error.path).toEqual(['profile', 'email']);
    expect(result.error.expected).toBe('string');
    expect(result.error.actual).toBe('boolean');
  });
});
