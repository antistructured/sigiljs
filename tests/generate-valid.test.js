import { describe, test, expect, beforeEach } from 'bun:test';
import { generateValid } from '../src/testing/generate.js';
import { Sigil, oneOf, optional, sigil, union } from '../src/index.js';
import { clear } from '../src/core/registry.js';

describe('generateValid', () => {
  beforeEach(() => {
    clear();
  });

  test('string', () => {
    expect(generateValid({ kind: 'string' })).toBe('string');
  });

  test('number', () => {
    expect(generateValid({ kind: 'number' })).toBe(0);
  });

  test('boolean', () => {
    expect(generateValid({ kind: 'boolean' })).toBe(true);
  });

  test('bigint', () => {
    expect(generateValid({ kind: 'bigint' })).toBe(0n);
  });

  test('null', () => {
    expect(generateValid({ kind: 'null' })).toBe(null);
  });

  test('symbol', () => {
    expect(typeof generateValid({ kind: 'symbol' })).toBe('symbol');
  });

  test('literal', () => {
    expect(generateValid({ kind: 'literal', value: 'a' })).toBe('a');
    expect(generateValid({ kind: 'literal', value: 1 })).toBe(1);
    expect(generateValid({ kind: 'literal', value: true })).toBe(true);
    expect(generateValid({ kind: 'literal', value: null })).toBe(null);
  });

  test('union uses first variant', () => {
    expect(
      generateValid({
        kind: 'union',
        variants: [{ kind: 'string' }, { kind: 'number' }],
      }),
    ).toBe('string');
  });

  test('union falls back to undefined when empty', () => {
    expect(generateValid({ kind: 'union', variants: [] })).toBeUndefined();
  });

  test('array produces one generated element by default', () => {
    expect(
      generateValid({ kind: 'array', element: { kind: 'string' } }),
    ).toEqual(['string']);
  });

  test('array respects arrayLength option', () => {
    expect(
      generateValid(
        { kind: 'array', element: { kind: 'number' } },
        { arrayLength: 4 },
      ),
    ).toEqual([0, 0, 0, 0]);
  });

  test('object includes required properties only', () => {
    expect(
      generateValid({
        kind: 'object',
        exact: false,
        properties: [
          { key: 'id', required: true, contract: { kind: 'number' } },
          { key: 'name', required: false, contract: { kind: 'string' } },
        ],
      }),
    ).toEqual({ id: 0 });
  });

  test('object includes optional properties when includeOptional is true', () => {
    expect(
      generateValid(
        {
          kind: 'object',
          exact: false,
          properties: [
            { key: 'id', required: true, contract: { kind: 'number' } },
            { key: 'name', required: false, contract: { kind: 'string' } },
          ],
        },
        { includeOptional: true },
      ),
    ).toEqual({ id: 0, name: 'string' });
  });

  test('broad object returns empty object', () => {
    expect(
      generateValid({ kind: 'object', exact: false, properties: [] }),
    ).toEqual({});
  });

  test('resolve named reference via resolve option', () => {
    const Email = Sigil`string`;
    expect(
      generateValid(
        { kind: 'reference', name: 'Email' },
        {
          resolve: (name) => (name === 'Email' ? Email : undefined),
        },
      ),
    ).toBe('string');
  });

  test('unresolved reference returns undefined', () => {
    expect(
      generateValid(
        { kind: 'reference', name: 'Missing' },
        { resolve: () => undefined },
      ),
    ).toBeUndefined();
  });

  test('unknown kind returns undefined', () => {
    expect(generateValid({ kind: 'unknown' })).toBeUndefined();
  });
});
