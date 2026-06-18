import { expect, test, describe, beforeEach } from 'bun:test';
import { clear, resolve } from '../src/core/registry.js';
import { Sigil } from '../src/sigil.js';

describe('Sigil.collection()', () => {
  beforeEach(() => {
    clear();
  });

  test('returns named sigils accessible on the collection object', () => {
    const Auth = Sigil.collection({
      Email: Sigil`string`,
      Password: Sigil`string`,
    });

    expect(typeof Auth.Email.check).toBe('function');
    expect(typeof Auth.Password.check).toBe('function');
  });

  test('validates records using collection-local references', () => {
    const Auth = Sigil.collection({
      Email: Sigil`string`,
      LoginRequest: Sigil`
      {
        email: Email
      }
      `,
    });

    expect(Auth.LoginRequest.check({ email: 'a@b.com' })).toBe(true);
    expect(Auth.LoginRequest.check({ email: 123 })).toBe(false);
  });

  test('missing collection reference fails with a clear message at check time', () => {
    const Auth = Sigil.collection({
      LoginRequest: Sigil`
      {
        email: Missing
      }
      `,
    });

    expect(() => Auth.LoginRequest.check({ email: 'x' })).toThrow(
      /Unknown sigil reference: Missing/,
    );
  });

  test('collection names do not leak to the global registry unless added explicitly', () => {
    const Auth = Sigil.collection({
      Email: Sigil`string`,
      Login: Sigil`
      {
        email: Email
      }
      `,
    });

    expect(resolve('Email')).toBeUndefined();
    expect(resolve('Login')).toBeUndefined();

    expect(Auth.Login.check({ email: 'x@y.com' })).toBe(true);
  });
});
