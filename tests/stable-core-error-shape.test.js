import { describe, expect, test } from 'bun:test';
import { oneOf, sigil, SigilValidationError } from '../src/index.js';

function captureError(fn) {
  try {
    fn();
  } catch (error) {
    return error;
  }
  throw new Error('Expected function to throw');
}

describe('stable core — validation error shape', () => {
  test('parse throws a structured SigilValidationError', () => {
    const User = sigil({ name: String });
    const error = captureError(() => User.parse({ name: 123 }));

    expect(error).toBeInstanceOf(SigilValidationError);
    expect(error.name).toBe('SigilValidationError');
    expect(error.code).toBe('SIGIL_VALIDATION_FAILED');
    expect(typeof error.message).toBe('string');
    expect(error.path).toEqual(['name']);
    expect(error.expected).toBe('string');
    expect(error.actual).toBe('number');
  });

  test('assert throws the same structured error shape', () => {
    const User = sigil({ active: Boolean });
    const error = captureError(() => User.assert({ active: 'yes' }));

    expect(error).toBeInstanceOf(SigilValidationError);
    expect(error.name).toBe('SigilValidationError');
    expect(error.code).toBe('SIGIL_VALIDATION_FAILED');
    expect(error.path).toEqual(['active']);
    expect(error.expected).toBe('boolean');
    expect(error.actual).toBe('string');
  });

  test('toJSON returns the canonical stable logging shape', () => {
    const User = sigil({ age: Number });
    const error = captureError(() => User.parse({ age: 'old' }));

    expect(error.toJSON()).toEqual({
      code: 'SIGIL_VALIDATION_FAILED',
      message: 'Expected property "age" to be number, got string',
      path: ['age'],
      expected: 'number',
      actual: 'string',
    });
  });

  test('nested validation error carries a nested path', () => {
    const User = sigil({ profile: { email: String } });
    const error = captureError(() => User.parse({ profile: { email: 42 } }));

    expect(error.path).toEqual(['profile', 'email']);
    expect(error.expected).toBe('string');
    expect(error.actual).toBe('number');
  });

  test('literal validation error reports useful expected and actual values', () => {
    const User = sigil({ role: oneOf('admin', 'user') });
    const error = captureError(() => User.parse({ role: 'guest' }));

    expect(error.path).toEqual(['role']);
    expect(error.expected).toBe('"admin" | "user"');
    expect(error.actual).toBe('guest');
    expect(error.message).toContain('role');
  });

  test('exact-object extra key error reports the extra key path', () => {
    const User = sigil.exact({ name: String });
    const error = captureError(() => User.parse({ name: 'Ada', admin: true }));

    expect(error.path).toEqual(['admin']);
    expect(error.expected).toBe('never');
    expect(error.actual).toBe('boolean');
  });
});
