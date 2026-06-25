import { describe, test, expect, beforeEach } from 'bun:test';
import { Sigil, oneOf, optional, sigil, union } from '../src/index.js';
import { clear } from '../src/core/registry.js';

describe('Phase 12 Testing helpers', () => {
  beforeEach(() => {
    clear();
  });

  test('mock() generates simple valid primitive samples', () => {
    expect(Sigil`string`.mock()).toBe('string');
    expect(Sigil`number`.mock()).toBe(0);
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
      id: 0,
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

    expect(cases.valid).toEqual([
      {
        label: 'valid default',
        value: {
          id: 0,
          name: 'string',
          role: 'admin',
        },
      },
    ]);

    expect(cases.invalid.length).toBeGreaterThan(0);
    expect(
      cases.invalid.some((item) => item.label === 'missing required property: id'),
    ).toBe(true);

    for (const item of cases.valid) {
      expect(User.check(item.value)).toBe(true);
    }
    for (const item of cases.invalid) {
      expect(User.check(item.value)).toBe(false);
    }
  });

  test('cases() works for primitive contracts', () => {
    const cases = Sigil`string`.cases();

    expect(cases).toEqual({
      valid: [{ label: 'valid default', value: 'string' }],
      invalid: [{ label: 'invalid string', value: 0, expectedPath: [] }],
    });

    for (const item of cases.valid) {
      expect(Sigil`string`.check(item.value)).toBe(true);
    }
    for (const item of cases.invalid) {
      expect(Sigil`string`.check(item.value)).toBe(false);
    }
  });

  test('mock() returns valid data and passes contract.check()', () => {
    const User = sigil.exact({
      id: Number,
      name: String,
      role: oneOf('admin', 'user'),
      age: optional(Number),
    });

    const sample = User.mock();
    expect(User.check(sample)).toBe(true);
  });

  test('mock() omits optional fields by default', () => {
    const User = sigil.exact({
      id: Number,
      name: String,
      role: oneOf('admin', 'user'),
      age: optional(Number),
    });

    const sample = User.mock();
    expect(sample).toEqual({
      id: 0,
      name: 'string',
      role: 'admin',
    });
    expect(sample).not.toHaveProperty('age');
  });

  test('mock() includes optional fields when includeOptional is true', () => {
    const User = sigil.exact({
      id: Number,
      name: String,
      role: oneOf('admin', 'user'),
      age: optional(Number),
    });

    const sample = User.mock({ includeOptional: true });
    expect(sample).toEqual({
      id: 0,
      name: 'string',
      role: 'admin',
      age: 0,
    });
    expect(User.check(sample)).toBe(true);
  });

  test('mock() output is deterministic', () => {
    const User = sigil.exact({
      id: Number,
      name: String,
      role: oneOf('admin', 'user'),
    });

    expect(User.mock()).toEqual(User.mock());
    expect(User.cases()).toEqual(User.cases());
  });

  test('mock() on exact contract does not generate extra keys', () => {
    const User = sigil.exact({
      id: Number,
      name: String,
    });

    const sample = User.mock();
    expect(Object.keys(sample)).toEqual(['id', 'name']);
    expect(User.check(sample)).toBe(true);
  });
});
