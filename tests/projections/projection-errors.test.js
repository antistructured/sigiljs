import { describe, test, expect } from 'bun:test';
import { Sigil, oneOf, optional, sigil, union } from '../../src/index.js';
import {
  SigilProjectionError,
  projectionError,
  unsupportedProjectionKind,
} from '../../src/projection-error.js';

describe('Projection error regressions', () => {
  test('JSON Schema unsupported kind returns structured SigilProjectionError', () => {
    const error = (() => {
      try {
        Sigil`symbol`.toJSONSchema();
      } catch (value) {
        return value;
      }
    })();

    expect(error).toBeInstanceOf(SigilProjectionError);
    expect(error.code).toBe('SIGIL_PROJECTION_FAILED');
    expect(error.projection).toBe('json-schema');
    expect(error.path).toEqual([]);
    expect(error.reason).toBe('unsupported_kind');
    expect(error.kind).toBe('symbol');
    expect(error.message).toContain('Cannot project symbol contract to json-schema');
  });

  test('TypeScript unsupported kind returns structured SigilProjectionError', () => {
    const Contract = Sigil`symbol`;
    const error = Contract.toTypeScript('Contract');

    expect(error).toBeInstanceOf(SigilProjectionError);
    expect(error.code).toBe('SIGIL_PROJECTION_FAILED');
    expect(error.projection).toBe('typescript');
    expect(error.path).toEqual([]);
    expect(error.reason).toBe('unsupported contract description');
  });

  test('TypeScript broad object contract does not crash on missing properties', () => {
    const output = sigil(Object).toTypeScript('RecordValue');

    expect(output).toBe(`type RecordValue = Record<string, unknown>`);
  });

  test('JSON Schema broad object contract does not crash on missing properties', () => {
    const schema = sigil(Object).toJSONSchema();

    expect(schema).toEqual({ type: 'object' });
  });

  test('projection helper exposes stable structured error fields', () => {
    const description = { kind: 'symbol' };
    const error = unsupportedProjectionKind('json-schema', description, ['root']);

    expect(error.code).toBe('SIGIL_PROJECTION_FAILED');
    expect(error.projection).toBe('json-schema');
    expect(error.path).toEqual(['root']);
    expect(error.reason).toBe('unsupported_kind');
    expect(error.kind).toBe('symbol');
  });
});
