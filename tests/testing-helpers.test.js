import { describe, test, expect, beforeEach } from 'bun:test';
import { Sigil, oneOf, optional, sigil, union } from '../src/index.js';
import { clear } from '../src/core/registry.js';

describe('Phase 12 Testing helpers', () => {
  beforeEach(() => {
    clear();
  });

  test('mock() generates simple valid primitive samples', () => {
    expect(Sigil`string`.mock()).toBe('string');
    expect(Sigil`number`.mock()).toBe(1);
    expect(Sigil`boolean`.mock()).toBe(true);
    expect(Sigil`null`.mock()).toBeNull();
  });

  test('mock() generates arrays and objects', () => {
    const User = sigil({
      id: Number,
      name: String,
      tags: Sigil`string[]`,
      age: optional(Number),
    });

    expect(User.mock()).toEqual({
      id: 1,
      name: 'string',
      tags: ['string'],
    });
    expect(User.check(User.mock())).toBe(true);
  });

  test('mock() uses the first literal in literal unions', () => {
    const Role = oneOf('admin', 'user');
    const User = sigil({ role: Role });

    expect(User.mock()).toEqual({ role: 'admin' });
  });

  test('mock() uses the first variant in primitive unions', () => {
    const Contact = sigil({ id: union(String, Number) });

    expect(Contact.mock()).toEqual({ id: 'string' });
    expect(Contact.check(Contact.mock())).toBe(true);
  });

  test('mock() resolves named sigils from the registry', () => {
    Sigil.define('Email')`string`;
    const Login = Sigil`{ email: Email }`;

    expect(Login.mock()).toEqual({ email: 'string' });
    expect(Login.check(Login.mock())).toBe(true);
  });

  test('cases() returns valid and invalid samples', () => {
    const User = sigil({
      id: Number,
      name: String,
      role: oneOf('admin', 'user'),
    });

    const cases = User.cases();

    expect(cases).toEqual({
      valid: [
        {
          id: 1,
          name: 'string',
          role: 'admin',
        },
      ],
      invalid: [
        {
          name: 'string',
          role: 'admin',
        },
      ],
    });
    expect(cases.valid.every((value) => User.check(value))).toBe(true);
    expect(cases.invalid.every((value) => User.check(value))).toBe(false);
  });

  test('cases() works for primitive contracts', () => {
    const cases = Sigil`string`.cases();

    expect(cases).toEqual({
      valid: ['string'],
      invalid: [1],
    });
  });
});
