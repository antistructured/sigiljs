import { describe, expect, test } from 'bun:test';
import {
  Real,
  S,
  Sigil,
  T,
  httpContract,
  oneOf,
  optional,
  real,
  realType,
  sigil,
  union,
} from '../src/index.js';
import * as publicAPI from '../src/index.js';

const expectedRootExports = [
  'Real',
  'S',
  'Sigil',
  'SigilValidationError',
  'T',
  'httpContract',
  'oneOf',
  'optional',
  'pipe',
  'real',
  'realType',
  'sigil',
  'trim',
  'union',
];

const knownInternalHelpers = [
  'compile',
  'createValidationError',
  'normalize',
  'parse',
  'projectFormConstraints',
  'projectJSONSchema',
  'projectMock',
  'projectOpenAPI',
  'projectTypeScript',
  'tokenize',
  'validate',
];

describe('package public imports smoke', () => {
  test('intended package-root exports are present', () => {
    expect(Object.keys(publicAPI).sort()).toEqual(expectedRootExports);
  });

  test('stable imports work together through the public entry', () => {
    const User = sigil.exact({
      id: String,
      role: oneOf('admin', 'user'),
      age: optional(Number),
      contact: union(String, Number),
    });

    expect(
      User.check({ id: 'u_1', role: 'admin', contact: 'email' })
    ).toBe(true);
    expect(User.safeParse({ id: 'u_1', role: 'user', contact: 1 }).success).toBe(
      true
    );
    expect(User.safeParse({ id: 'u_1', role: 'owner', contact: 1 }).success).toBe(
      false
    );
  });

  test('Sigil template API remains importable and usable', () => {
    const User = Sigil`{ id: string, active: boolean }`;

    expect(User.check({ id: 'u_1', active: true })).toBe(true);
  });

  test('legacy aliases remain importable and point to documented targets', () => {
    expect(S).toBe(Sigil);
    expect(T).toBe(Sigil);
    expect(real).toBe(realType);
    expect(Real).toBe(realType);

    expect(S`string`.check('ok')).toBe(true);
    expect(T`number`.check(1)).toBe(true);
    expect(real([])).toBe('array');
    expect(Real(null)).toBe('null');
  });

  test('experimental httpContract is exported but not promoted by this smoke', () => {
    const Request = sigil({ email: String });
    const Response = sigil({ token: String });
    const Login = httpContract({ request: Request, response: Response });

    expect(Login.kind).toBe('sigil.httpContract');
    expect(typeof Login.safeParseRequest).toBe('function');
  });

  test('known internal helpers are not root exports', () => {
    for (const name of knownInternalHelpers) {
      expect(publicAPI[name]).toBeUndefined();
    }
  });
});
