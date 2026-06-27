import { describe, expect, test } from 'bun:test';
import { oneOf, optional, sigil } from '../src/index.js';

describe('regression matrix — Prove API', () => {
  test('mock returns deterministic data accepted by the contract', () => {
    const User = sigil.exact({ id: Number, name: String, role: oneOf('admin', 'user') });

    expect(User.mock()).toEqual({ id: 0, name: 'string', role: 'admin' });
    expect(User.mock()).toEqual(User.mock());
    expect(User.check(User.mock())).toBe(true);
  });

  test('mock optional-field behavior is deterministic', () => {
    const User = sigil.exact({ id: Number, name: String, age: optional(Number) });

    expect(User.mock()).toEqual({ id: 0, name: 'string' });
    expect(User.mock({ includeOptional: true })).toEqual({
      id: 0,
      name: 'string',
      age: 0,
    });
  });

  test('cases returns deterministic valid and invalid arrays', () => {
    const User = sigil.exact({ id: Number, name: String, role: oneOf('admin', 'user') });
    const cases = User.cases();

    expect(Object.keys(cases).sort()).toEqual(['invalid', 'valid']);
    expect(cases).toEqual(User.cases());
    expect(Array.isArray(cases.valid)).toBe(true);
    expect(Array.isArray(cases.invalid)).toBe(true);
    expect(cases.valid.length).toBeGreaterThan(0);
    expect(cases.invalid.length).toBeGreaterThan(0);
  });

  test('generated case labels exist and values exercise the contract', () => {
    const User = sigil.exact({ id: Number, name: String, role: oneOf('admin', 'user') });
    const cases = User.cases();

    for (const item of cases.valid) {
      expect(typeof item.label).toBe('string');
      expect('value' in item).toBe(true);
      expect(User.check(item.value)).toBe(true);
    }

    for (const item of cases.invalid) {
      expect(typeof item.label).toBe('string');
      expect('value' in item).toBe(true);
      expect(User.check(item.value)).toBe(false);
    }
  });

  test('invalid cases include expectedPath when practical', () => {
    const User = sigil.exact({ id: Number, name: String });

    expect(User.cases().invalid).toContainEqual({
      label: 'missing required property: id',
      value: { name: 'string' },
      expectedPath: ['id'],
    });
    expect(User.cases().invalid).toContainEqual({
      label: 'extra key in exact object',
      value: { id: 0, name: 'string', _extra: 'extra' },
      expectedPath: ['_extra'],
    });
  });

  test('test returns stable report shape with success boolean and counts', () => {
    const User = sigil.exact({ id: Number, name: String });
    const report = User.test();

    expect(report).toEqual({
      success: true,
      valid: { passed: 1, failed: 0 },
      invalid: { passed: User.cases().invalid.length, failed: 0 },
      failures: [],
    });
  });

  test('test reports custom case mismatches without throwing', () => {
    const User = sigil.exact({ id: Number });

    expect(() => User.test({
      valid: [{ label: 'bad valid case', value: { id: '1' } }],
      invalid: [{ label: 'bad invalid case', value: { id: 1 } }],
    })).not.toThrow();

    expect(User.test({
      valid: [{ label: 'bad valid case', value: { id: '1' } }],
      invalid: [{ label: 'bad invalid case', value: { id: 1 } }],
    })).toEqual({
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
