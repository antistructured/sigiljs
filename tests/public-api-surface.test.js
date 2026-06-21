import { describe, expect, test } from 'bun:test';
import * as publicAPI from '../src/index.js';

describe('Public API surface', () => {
  test('stable exports are present', () => {
    expect(typeof publicAPI.Sigil).toBe('function');
    expect(typeof publicAPI.sigil).toBe('function');
    expect(typeof publicAPI.optional).toBe('function');
    expect(typeof publicAPI.union).toBe('function');
    expect(typeof publicAPI.oneOf).toBe('function');
    expect(typeof publicAPI.pipe).toBe('function');
    expect(typeof publicAPI.trim).toBe('function');
    expect(typeof publicAPI.realType).toBe('function');
    expect(typeof publicAPI.SigilValidationError).toBe('function');
  });

  test('legacy aliases S and T resolve to Sigil', () => {
    expect(publicAPI.S).toBe(publicAPI.Sigil);
    expect(publicAPI.T).toBe(publicAPI.Sigil);
  });

  test('experimental exports are present', () => {
    expect(typeof publicAPI.httpContract).toBe('function');
    expect(publicAPI.httpContract).not.toBeUndefined();
    expect(publicAPI.httpContract).not.toBeNull();
  });

  test('internal symbols are not accidentally exported', () => {
    expect(publicAPI.createValidationError).toBeUndefined();
    expect(publicAPI.projectionError).toBeUndefined();
    expect(publicAPI.unsupportedProjectionKind).toBeUndefined();
    expect(publicAPI.projectJSONSchema).toBeUndefined();
    expect(publicAPI.projectTypeScript).toBeUndefined();
    expect(publicAPI.projectOpenAPI).toBeUndefined();
    expect(publicAPI.projectFormConstraints).toBeUndefined();
    expect(publicAPI.projectMock).toBeUndefined();
    expect(publicAPI.projectCases).toBeUndefined();
    expect(publicAPI.assert).toBeUndefined();
    expect(publicAPI.validate).toBeUndefined();
    expect(publicAPI.parse).toBeUndefined();
    expect(publicAPI.tokenize).toBeUndefined();
    expect(publicAPI.normalize).toBeUndefined();
    expect(publicAPI.compile).toBeUndefined();
    expect(publicAPI.getAstRegistry).toBeUndefined();
    expect(publicAPI.partial).toBeUndefined();
    expect(publicAPI.register).toBeUndefined();
    expect(publicAPI.resolve).toBeUndefined();
    expect(publicAPI.clear).toBeUndefined();
    expect(publicAPI.canonicalize).toBeUndefined();
    expect(publicAPI.validatorCache).toBeUndefined();
  });

  test('stable contract methods exist on created contracts', () => {
    const User = publicAPI.sigil({ name: String });

    expect(typeof User.check).toBe('function');
    expect(typeof User.assert).toBe('function');
    expect(typeof User.parse).toBe('function');
    expect(typeof User.safeParse).toBe('function');
    expect(typeof User.serialize).toBe('function');
    expect(typeof User.transform).toBe('function');
    expect(typeof User.withMetadata).toBe('function');
    expect(typeof User.version).toBe('function');
    expect(typeof User.describe).toBe('function');
    expect(typeof User.toJSONSchema).toBe('function');
    expect(typeof User.toTypeScript).toBe('function');
    expect(typeof User.toOpenAPI).toBe('function');
    expect(typeof User.toFormConstraints).toBe('function');
    expect(typeof User.mock).toBe('function');
    expect(typeof User.cases).toBe('function');
    expect(typeof User.diff).toBe('function');
    expect(typeof User.compile).toBe('function');
  });

  test('experimental contract method toFormConstraints is present', () => {
    const User = publicAPI.sigil({ name: String });
    expect(typeof User.toFormConstraints).toBe('function');
  });

  test('template API attached methods exist', () => {
    expect(typeof publicAPI.Sigil.exact).toBe('function');
    expect(typeof publicAPI.Sigil.meta).toBe('function');
    expect(typeof publicAPI.Sigil.named).toBe('function');
    expect(typeof publicAPI.Sigil.define).toBe('function');
    expect(typeof publicAPI.Sigil.collection).toBe('function');
  });

  test('object API attached methods exist', () => {
    expect(typeof publicAPI.sigil.exact).toBe('function');
  });
});
