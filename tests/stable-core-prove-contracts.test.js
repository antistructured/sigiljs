import { describe, expect, test } from 'bun:test';
import { oneOf, optional, sigil } from '../src/index.js';

describe('stable core — Prove output contracts', () => {
  test('mock output is deterministic and passes the contract', () => {
    const User = sigil.exact({ id: Number, name: String, role: oneOf('admin', 'user') });

    expect(User.mock()).toEqual({ id: 0, name: 'string', role: 'admin' });
    expect(User.mock()).toEqual(User.mock());
    expect(User.check(User.mock())).toBe(true);
  });

  test('mock omits optional fields by default and includes them when requested', () => {
    const User = sigil.exact({ id: Number, name: String, age: optional(Number) });

    expect(User.mock()).toEqual({ id: 0, name: 'string' });
    expect(User.mock({ includeOptional: true })).toEqual({
      id: 0,
      name: 'string',
      age: 0,
    });
  });

  test('cases returns stable valid and invalid arrays', () => {
    const User = sigil.exact({ id: Number, name: String, role: oneOf('admin', 'user') });
    const cases = User.cases();

    expect(Object.keys(cases).sort()).toEqual(['invalid', 'valid']);
    expect(cases.valid).toEqual([
      {
        label: 'valid default',
        value: { id: 0, name: 'string', role: 'admin' },
      },
    ]);
    expect(cases.invalid.length).toBeGreaterThan(0);
    for (const item of [...cases.valid, ...cases.invalid]) {
      expect(typeof item.label).toBe('string');
      expect('value' in item).toBe(true);
    }
  });

  test('valid generated cases pass and invalid generated cases fail the contract', () => {
    const User = sigil.exact({ id: Number, name: String, role: oneOf('admin', 'user') });
    const cases = User.cases();

    for (const item of cases.valid) {
      expect(User.check(item.value)).toBe(true);
    }
    for (const item of cases.invalid) {
      expect(User.check(item.value)).toBe(false);
    }
  });

  test('invalid cases include expectedPath when practical', () => {
    const User = sigil.exact({ id: Number, name: String });
    const cases = User.cases();

    expect(cases.invalid).toContainEqual({
      label: 'missing required property: id',
      value: { name: 'string' },
      expectedPath: ['id'],
    });
    expect(cases.invalid).toContainEqual({
      label: 'extra key in exact object',
      value: { id: 0, name: 'string', _extra: 'extra' },
      expectedPath: ['_extra'],
    });
  });

  test('test returns stable success report shape for generated cases', () => {
    const User = sigil.exact({ id: Number, name: String });
    const report = User.test();

    expect(Object.keys(report).sort()).toEqual([
      'failures',
      'invalid',
      'success',
      'valid',
    ]);
    expect(report).toEqual({
      success: true,
      valid: { passed: 1, failed: 0 },
      invalid: { passed: User.cases().invalid.length, failed: 0 },
      failures: [],
    });
  });

  test('test returns stable failure entries for custom mismatched cases', () => {
    const User = sigil.exact({ id: Number });
    const report = User.test({
      valid: [{ label: 'bad valid case', value: { id: '1' } }],
      invalid: [{ label: 'bad invalid case', value: { id: 1 } }],
    });

    expect(report).toEqual({
      success: false,
      valid: { passed: 0, failed: 1 },
      invalid: { passed: 0, failed: 1 },
      failures: [
        { kind: 'valid', label: 'bad valid case', value: { id: '1' } },
        { kind: 'invalid', label: 'bad invalid case', value: { id: 1 } },
      ],
    });
  });
});
