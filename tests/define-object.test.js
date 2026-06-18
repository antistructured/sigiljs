import { describe, test, expect } from 'bun:test';
import { Sigil, sigil, optional, union, oneOf } from '../src/index.js';

describe('Phase 2 Define pillar object API', () => {
  test('preserves existing Sigil template API', () => {
    const User = Sigil`
    {
      id: string
      name: string
    }
    `;

    expect(User.check({ id: 'u_1', name: 'D' })).toBe(true);
    expect(User.check({ id: 1, name: 'D' })).toBe(false);
  });

  test('sigil() creates the same kind of contract object as Sigil', () => {
    const User = sigil({
      id: Number,
      name: String,
    });

    expect(User.kind).toBe('sigil.contract');
    expect(User.source).toBe('{ id: number, name: string }');
    expect(User.check({ id: 1, name: 'D' })).toBe(true);
    expect(User.check({ id: '1', name: 'D' })).toBe(false);
    expect(User.check({ id: 1, name: 123 })).toBe(false);
  });

  test('native constructors map to primitive contract types', () => {
    const Values = sigil({
      string: String,
      number: Number,
      boolean: Boolean,
      bigint: BigInt,
      symbol: Symbol,
      array: Array,
      object: Object,
    });

    expect(
      Values.check({
        string: 'x',
        number: 1,
        boolean: true,
        bigint: 1n,
        symbol: Symbol('x'),
        array: [],
        object: {},
      }),
    ).toBe(true);

    expect(
      Values.check({
        string: 'x',
        number: Number.NaN,
        boolean: true,
        bigint: 1n,
        symbol: Symbol('x'),
        array: [],
        object: {},
      }),
    ).toBe(false);
  });

  test('optional() marks object definition fields optional', () => {
    const User = sigil({
      id: Number,
      name: String,
      age: optional(Number),
    });

    expect(User.check({ id: 1, name: 'D' })).toBe(true);
    expect(User.check({ id: 1, name: 'D', age: 42 })).toBe(true);
    expect(User.check({ id: 1, name: 'D', age: 'old' })).toBe(false);
    expect(User.describe().properties.find((p) => p.key === 'age')).toEqual({
      key: 'age',
      required: false,
      contract: { kind: 'number' },
    });
  });

  test('union() matches template union behavior', () => {
    const ObjectAPI = sigil({ id: union(String, Number) });
    const TemplateAPI = Sigil`{ id: string | number }`;

    expect(ObjectAPI.check({ id: 'u_1' })).toBe(true);
    expect(ObjectAPI.check({ id: 1 })).toBe(true);
    expect(ObjectAPI.check({ id: false })).toBe(false);
    expect(ObjectAPI.describe()).toEqual(TemplateAPI.describe());
  });

  test('oneOf() creates literal enum-like contracts', () => {
    const Role = sigil({
      role: oneOf('admin', 'user', false, null, 1),
    });

    expect(Role.check({ role: 'admin' })).toBe(true);
    expect(Role.check({ role: 'user' })).toBe(true);
    expect(Role.check({ role: false })).toBe(true);
    expect(Role.check({ role: null })).toBe(true);
    expect(Role.check({ role: 1 })).toBe(true);
    expect(Role.check({ role: 'guest' })).toBe(false);
  });

  test('sigil.exact() creates exact object contracts', () => {
    const User = sigil.exact({ name: String });

    expect(User.check({ name: 'D' })).toBe(true);
    expect(User.check({ name: 'D', extra: true })).toBe(false);
    expect(User.options.exact).toBe(true);
  });
});
