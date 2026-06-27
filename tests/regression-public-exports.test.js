import { describe, expect, test } from 'bun:test';
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

const internalNames = [
  'assert',
  'canonicalize',
  'clear',
  'compile',
  'createValidationError',
  'getAstRegistry',
  'normalize',
  'parse',
  'partial',
  'projectCases',
  'projectFormConstraints',
  'projectJSONSchema',
  'projectMock',
  'projectOpenAPI',
  'projectTypeScript',
  'projectionError',
  'register',
  'resolve',
  'tokenize',
  'unsupportedProjectionKind',
  'validate',
  'validatorCache',
];

describe('regression matrix — public exports and aliases', () => {
  test('package root exports the documented stable and experimental symbols', () => {
    expect(Object.keys(publicAPI).sort()).toEqual(expectedRootExports);
  });

  test('stable exports exist with callable shapes', () => {
    expect(typeof publicAPI.sigil).toBe('function');
    expect(typeof publicAPI.sigil.exact).toBe('function');
    expect(typeof publicAPI.Sigil).toBe('function');
    expect(typeof publicAPI.optional).toBe('function');
    expect(typeof publicAPI.union).toBe('function');
    expect(typeof publicAPI.oneOf).toBe('function');
    expect(typeof publicAPI.realType).toBe('function');
    expect(typeof publicAPI.SigilValidationError).toBe('function');
  });

  test('Sigil remains a stable advanced API with template helper methods', () => {
    expect(typeof publicAPI.Sigil.exact).toBe('function');
    expect(typeof publicAPI.Sigil.meta).toBe('function');
    expect(typeof publicAPI.Sigil.named).toBe('function');
    expect(typeof publicAPI.Sigil.define).toBe('function');
    expect(typeof publicAPI.Sigil.collection).toBe('function');

    const User = publicAPI.Sigil`{ name: string }`;
    expect(User.check({ name: 'Ada' })).toBe(true);
  });

  test('legacy aliases remain exported and preserve documented behavior', () => {
    expect(publicAPI.S).toBe(publicAPI.Sigil);
    expect(publicAPI.T).toBe(publicAPI.Sigil);
    expect(publicAPI.real).toBe(publicAPI.realType);
    expect(publicAPI.Real).toBe(publicAPI.realType);

    expect(publicAPI.S`{ name: string }`.check({ name: 'Ada' })).toBe(true);
    expect(publicAPI.T`{ age: number }`.check({ age: 42 })).toBe(true);
    expect(publicAPI.real('x')).toBe('string');
    expect(publicAPI.Real([])).toBe('array');
  });

  test('httpContract remains exported as the experimental HTTP boundary helper', () => {
    expect(typeof publicAPI.httpContract).toBe('function');
    const Request = publicAPI.sigil({ email: String });
    const Response = publicAPI.sigil({ token: String });
    const Login = publicAPI.httpContract({ request: Request, response: Response });

    expect(Login.kind).toBe('sigil.httpContract');
    expect(typeof Login.parseRequest).toBe('function');
  });

  test('internal helpers are not accidentally exported from the package root', () => {
    for (const name of internalNames) {
      expect(publicAPI[name]).toBeUndefined();
    }
  });
});
