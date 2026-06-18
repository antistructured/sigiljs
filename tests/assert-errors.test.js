import { beforeEach, describe, expect, it } from 'bun:test';
import { Sigil, SigilValidationError } from '../src/index.js';
import { clear } from '../src/core/registry.js';
import { createValidationError } from '../src/core/errors.js';

function capture(fn) {
  try {
    fn();
  } catch (error) {
    return error;
  }
  throw new Error('Expected function to throw');
}

describe('path-aware assert errors', () => {
  beforeEach(() => clear());

  it('createValidationError returns the canonical plain object shape', () => {
    expect(
      createValidationError({
        message: 'Expected number',
        expected: 'number',
        actual: 'string',
      }),
    ).toEqual({
      code: 'SIGIL_VALIDATION_FAILED',
      message: 'Expected number',
      path: [],
      expected: 'number',
      actual: 'string',
    });
  });

  it('assert returns the validated value when valid', () => {
    const User = Sigil`{ name: string }`;
    const data = { name: 'Ada' };

    expect(User.assert(data)).toBe(data);
  });

  it('reports primitive failure details', () => {
    const error = capture(() => Sigil`number`.assert('old'));

    expect(error).toBeInstanceOf(SigilValidationError);
    expect(error.code).toBe('SIGIL_VALIDATION_FAILED');
    expect(error.path).toEqual([]);
    expect(error.expected).toBe('number');
    expect(error.actual).toBe('string');
  });

  it('reports object property failure details', () => {
    const User = Sigil`{ age: number }`;
    const error = capture(() => User.assert({ age: 'old' }));

    expect(error.path).toEqual(['age']);
    expect(error.expected).toBe('number');
    expect(error.actual).toBe('string');
  });

  it('reports optional property failure details when the optional key is present', () => {
    const User = Sigil`{ age?: number }`;
    const error = capture(() => User.assert({ age: 'old' }));

    expect(error.path).toEqual(['age']);
    expect(error.expected).toBe('number');
    expect(error.actual).toBe('string');
  });

  it('reports nested object failure details', () => {
    const User = Sigil`
    {
      user: {
        age: number
      }
    }
    `;
    const error = capture(() => User.assert({ user: { age: 'old' } }));

    expect(error.code).toBe('SIGIL_VALIDATION_FAILED');
    expect(error.path).toEqual(['user', 'age']);
    expect(error.expected).toBe('number');
    expect(error.actual).toBe('string');
  });

  it('reports array item failure details with numeric path segments', () => {
    const Cart = Sigil`{ items: { price: number }[] }`;
    const error = capture(() =>
      Cart.assert({ items: [{ price: 10 }, { price: 'free' }] }),
    );

    expect(error.path).toEqual(['items', 1, 'price']);
    expect(error.expected).toBe('number');
    expect(error.actual).toBe('string');
  });

  it('reports exact object extra key failure details', () => {
    const User = Sigil.exact`{ name: string }`;
    const error = capture(() => User.assert({ name: 'Ada', admin: true }));

    expect(error.path).toEqual(['admin']);
    expect(error.expected).toBe('never');
    expect(error.actual).toBe('boolean');
  });

  it('reports named sigil failure details', () => {
    Sigil.define('Email')`string`;
    const User = Sigil`{ email: Email }`;
    const error = capture(() => User.assert({ email: 42 }));

    expect(error.path).toEqual(['email']);
    expect(error.expected).toBe('string');
    expect(error.actual).toBe('number');
  });
});
