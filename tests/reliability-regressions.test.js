import { describe, expect, test, beforeEach } from 'bun:test';
import { sigil, oneOf, optional, Sigil } from '../src/index.js';
import { aiSchema } from '../src/ai.js';
import { clear } from '../src/core/registry.js';

describe('Boundary/reliability/harmonization', () => {
  beforeEach(() => clear());

  test('contract validation rejects extra object properties', () => {
    const User = sigil.exact({ name: String });
    expect(User.check({ name: 'Ada', extra: true })).toBe(false);
    expect(User.check({ name: 'Ada' })).toBe(true);
  });

  test('contract validation returns deterministic expected/actual labels', () => {
    const error = (() => {
      try {
        return sigil.exact({ age: Number }).assert({ age: 'old' });
      } catch (err) {
        return err;
      }
      throw new Error('Expected validation failure');
    })();

    expect(error.code).toBe('SIGIL_VALIDATION_FAILED');
    expect(error.path).toEqual(['age']);
    expect(error.expected).toBe('number');
    expect(error.actual).toBe('string');
  });

  test('contract parsing throws on invalid shape', () => {
    expect(() => sigil({ id: Number }).parse({ id: 'x' })).toThrow();
  });

  test('safeParse returns success result for bad shape', () => {
    const result = sigil({ id: Number }).safeParse({ id: 'x' });
    expect(result.success).toBe(false);
  });

  test('safeParse returns success result for good shape', () => {
    const result = sigil({ id: Number }).safeParse({ id: 1 });
    expect(result.success).toBe(true);
  });

  test('contract assert returns trusted data on success', () => {
    const input = { budget: 10 };
    const data = sigil({ budget: Number }).assert(input);
    expect(data).toBe(input);
  });

  test('optional field parsing works when omitted', () => {
    const User = sigil({ name: String, age: optional(Number) });
    expect(User.check({ name: 'Ada' })).toBe(true);
  });

  test('literal union accepts only declared values', () => {
    const Role = sigil.exact({ role: oneOf('admin', 'user') });
    expect(Role.check({ role: 'admin' })).toBe(true);
    expect(Role.check({ role: 'superadmin' })).toBe(false);
  });

  test('nested object path errors surface leaf failure', () => {
    const error = (() => {
      try {
        return sigil.exact({ user: { age: Number } }).assert({ user: { age: 'old' } });
      } catch (err) {
        return err;
      }
      throw new Error('Expected validation failure');
    })();

    expect(error.path).toEqual(['user', 'age']);
    expect(error.expected).toBe('number');
    expect(error.actual).toBe('string');
  });

  test('aiSchema projection exposes JSON Schema contract shape', () => {
    const schema = aiSchema(sigil.exact({ name: String, priority: oneOf('low', 'high') }));
    expect(schema.type).toBe('object');
    expect(schema.properties.name.type).toBe('string');
    expect(schema.additionalProperties).toBe(false);
    expect(schema.required).toEqual(['name', 'priority']);
  });

  test('mock returns deterministic valid sample data', () => {
    const first = sigil({ name: String, id: Number }).mock();
    const second = sigil({ name: String, id: Number }).mock();
    expect(first).toEqual(second);
  });

  test('cases returns labeled valid and invalid examples', () => {
    const cases = sigil.exact({ id: Number, name: String }).cases();
    expect(cases.valid.length).toBeGreaterThan(0);
    expect(cases.invalid.length).toBeGreaterThan(0);
    for (const item of cases.valid) {
      expect(sigil.exact({ id: Number, name: String }).check(item.value)).toBe(true);
    }
    for (const item of cases.invalid) {
      expect(sigil.exact({ id: Number, name: String }).check(item.value)).toBe(false);
    }
  });

  test('named sigil registry resolves references inside contracts', () => {
    Sigil.define('Email')`string`;
    const User = Sigil`{ email: Email }`;
    expect(User.parse({ email: 'ada@example.com' })).toEqual({ email: 'ada@example.com' });
  });

  test('contract collection produces independent named sigils', () => {
    const Collection = Sigil.collection({
      Email: Sigil`string`,
      User: Sigil`{ email: Email }`,
    });

    expect(Collection.Email.check('ada@example.com')).toBe(true);
    expect(Collection.User.check({ email: 'ada@example.com' })).toBe(true);
  });

  test('transform contract validates input, transforms, then revalidates', () => {
    const Double = sigil({ value: Number }).transform((input) => ({ value: input.value * 2 }));
    const data = Double.parse({ value: 5 });
    expect(data).toEqual({ value: 10 });
  });

  test('describe returns stable plain contract description', () => {
    const description = sigil.exact({ id: Number, name: String }).describe();
    expect(description.kind).toBe('object');
    expect(description.exact).toBe(true);
    expect(description.properties.map((property) => property.key)).toEqual(['id', 'name']);
  });

  test('diff reports lifecycle changes between contracts', () => {
    const v1 = sigil({ name: String });
    const v2 = sigil({ name: String, age: optional(Number) });
    const changes = v2.diff(v1);
    expect(Array.isArray(changes)).toBe(true);
    expect(changes.length).toBeGreaterThan(0);
  });

  test('contract check remains boolean-only fast path', () => {
    const User = sigil({ name: String });
    expect(User.check(null)).toBe(false);
    expect(User.check({})).toBe(false);
    expect(User.check({ name: 'Ada' })).toBe(true);
  });
});
