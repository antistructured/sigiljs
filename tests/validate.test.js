import { describe, it, expect, beforeEach } from 'bun:test';
import { parse } from '../src/core/parser.js';
import { normalize } from '../src/core/normalize.js';
import { partial } from '../src/core/partial.js';
import { validate } from '../src/core/validate.js';
import { assert } from '../src/core/assert.js';
import { clear } from '../src/core/registry.js';
import { Sigil, SigilValidationError } from '../src/index.js';

// Shorthand: build a normalized AST from a raw schema string
const ast = (s) => partial(normalize(parse(s)));

describe('validate & assert', () => {
  beforeEach(() => clear());

  // ── validate() basics ─────────────────────────────────────────────────────

  it('validates correctly', () => {
    const schema = ast('{ a: string }');
    expect(validate(schema, { a: 'foo' })).toBe(true);
    expect(validate(schema, { a: 42 })).toBe(false);
  });

  it('assert returns the validated value on success', () => {
    const schema = ast('string');
    expect(assert(schema, 'hello')).toBe('hello');
  });

  // ── Error shape ───────────────────────────────────────────────────────────

  it('error has the canonical shape', () => {
    const schema = ast('number');
    let err;
    try {
      assert(schema, 'oops');
    } catch (e) {
      err = e;
    }

    expect(err.code).toBe('SIGIL_VALIDATION_FAILED');
    expect(typeof err.message).toBe('string');
    expect(Array.isArray(err.path)).toBe(true);
    expect(typeof err.expected).toBe('string');
    expect(typeof err.actual).toBe('string');
  });

  it('error is an instance of SigilValidationError', () => {
    const schema = ast('number');
    expect(() => assert(schema, 'hello')).toThrow(SigilValidationError);
  });

  it('toJSON() returns the canonical structured shape', () => {
    const schema = ast('number');
    let err;
    try {
      assert(schema, 'hello');
    } catch (e) {
      err = e;
    }

    const json = err.toJSON();
    expect(json).toEqual({
      code: 'SIGIL_VALIDATION_FAILED',
      message: expect.any(String),
      path: [],
      expected: 'number',
      actual: 'string',
    });
  });

  it('JSON.stringify(err) produces the canonical shape', () => {
    const schema = ast('boolean');
    let err;
    try {
      assert(schema, 42);
    } catch (e) {
      err = e;
    }

    const parsed = JSON.parse(JSON.stringify(err));
    expect(parsed.code).toBe('SIGIL_VALIDATION_FAILED');
    expect(parsed.expected).toBe('boolean');
    expect(parsed.actual).toBe('number');
  });

  // ── Primitive type mismatches ─────────────────────────────────────────────

  it('primitive: reports correct expected/actual', () => {
    let err;
    try {
      assert(ast('string'), 42);
    } catch (e) {
      err = e;
    }
    expect(err.expected).toBe('string');
    expect(err.actual).toBe('number');
    expect(err.path).toEqual([]);
  });

  it('primitive: message is human-readable', () => {
    let err;
    try {
      assert(ast('number'), 'oops');
    } catch (e) {
      err = e;
    }
    expect(err.message).toMatch(/number/);
    expect(err.message).toMatch(/string/);
  });

  // ── Object property path tracking ─────────────────────────────────────────

  it('object: reports path to failing property', () => {
    const schema = ast('{ a: string }');
    let err;
    try {
      assert(schema, { a: 42 });
    } catch (e) {
      err = e;
    }

    expect(err.code).toBe('SIGIL_VALIDATION_FAILED');
    expect(err.path).toEqual(['a']);
    expect(err.expected).toBe('string');
    expect(err.actual).toBe('number');
  });

  it('object: message includes property name', () => {
    const schema = ast('{ age: number }');
    let err;
    try {
      assert(schema, { age: 'thirty' });
    } catch (e) {
      err = e;
    }

    expect(err.message).toBe(
      'Expected property "age" to be number, got string',
    );
  });

  it('object: matches the target error shape from spec', () => {
    // { code, message, path, expected, actual }
    const schema = ast('{ user: { age: number } }');
    let err;
    try {
      assert(schema, { user: { age: 'thirty' } });
    } catch (e) {
      err = e;
    }

    expect(err.toJSON()).toEqual({
      code: 'SIGIL_VALIDATION_FAILED',
      message: 'Expected property "age" to be number, got string',
      path: ['user', 'age'],
      expected: 'number',
      actual: 'string',
    });
  });

  // ── Deep path tracking ────────────────────────────────────────────────────

  it('deep: 3-level nesting produces full path', () => {
    const schema = ast('{ a: { b: { c: boolean } } }');
    let err;
    try {
      assert(schema, { a: { b: { c: 42 } } });
    } catch (e) {
      err = e;
    }

    expect(err.path).toEqual(['a', 'b', 'c']);
    expect(err.expected).toBe('boolean');
    expect(err.actual).toBe('number');
  });

  it('deep: assert for existing test (profile.email[0])', () => {
    const schema = ast('{ profile: { email: string[], age?: number } }');
    let err;
    try {
      assert(schema, { profile: { email: [42] } });
    } catch (e) {
      err = e;
    }

    expect(err.path).toEqual(['profile', 'email', 0]);
    expect(err.expected).toBe('string');
    expect(err.actual).toBe('number');
  });

  // ── Array path tracking ───────────────────────────────────────────────────

  it('array: reports path with index to failing item', () => {
    const schema = ast('number[]');
    let err;
    try {
      assert(schema, [1, 2, 'bad', 4]);
    } catch (e) {
      err = e;
    }

    expect(err.path).toEqual([2]);
    expect(err.expected).toBe('number');
    expect(err.actual).toBe('string');
  });

  it('array: message includes item index', () => {
    const schema = ast('string[]');
    let err;
    try {
      assert(schema, ['ok', 42]);
    } catch (e) {
      err = e;
    }

    expect(err.message).toBe('Expected item [1] to be string, got number');
  });

  it('array inside object: full path includes key and index', () => {
    const schema = ast('{ tags: string[] }');
    let err;
    try {
      assert(schema, { tags: ['news', 99] });
    } catch (e) {
      err = e;
    }

    expect(err.path).toEqual(['tags', 1]);
    expect(err.expected).toBe('string');
    expect(err.actual).toBe('number');
  });

  // ── Missing required properties ───────────────────────────────────────────

  it('missing required property: path points to the key', () => {
    const schema = ast('{ name: string, age: number }');
    let err;
    try {
      assert(schema, { name: 'D' });
    } catch (e) {
      err = e;
    }

    expect(err.path).toEqual(['age']);
    expect(err.expected).toBe('number');
    expect(err.actual).toBe('undefined');
  });

  it('missing required property: message names the property and expected type', () => {
    const schema = ast('{ email: string }');
    let err;
    try {
      assert(schema, {});
    } catch (e) {
      err = e;
    }

    expect(err.message).toBe(
      'Missing required property "email" (expected string)',
    );
  });

  it('missing required property: complex expected type in message', () => {
    const schema = ast('{ tags: string[] }');
    let err;
    try {
      assert(schema, {});
    } catch (e) {
      err = e;
    }

    expect(err.expected).toBe('string[]');
    expect(err.message).toBe(
      'Missing required property "tags" (expected string[])',
    );
  });

  // ── Exact mode ────────────────────────────────────────────────────────────

  it('exact: reports unexpected extra property', () => {
    const User = Sigil.exact`{ name: string }`;
    let err;
    try {
      User.assert({ name: 'D', admin: true });
    } catch (e) {
      err = e;
    }

    expect(err.code).toBe('SIGIL_VALIDATION_FAILED');
    expect(err.path).toEqual(['admin']);
    expect(err.expected).toBe('never');
    expect(err.message).toBe('Unexpected property "admin"');
  });

  it('exact: path to extra key in nested object', () => {
    const User = Sigil.exact`{ profile: { bio: string } }`;
    let err;
    try {
      User.assert({ profile: { bio: 'hi', extra: 1 } });
    } catch (e) {
      err = e;
    }

    expect(err.path).toEqual(['profile', 'extra']);
    expect(err.expected).toBe('never');
  });

  // ── Union failures ────────────────────────────────────────────────────────

  it('primitive union: reports all expected types', () => {
    const schema = ast('string | number');
    let err;
    try {
      assert(schema, true);
    } catch (e) {
      err = e;
    }

    expect(err.expected).toBe('string | number');
    expect(err.actual).toBe('boolean');
    expect(err.path).toEqual([]);
  });

  it('complex union: surfaces deepest sub-path failure', () => {
    // Value matches the shape of the object branch but has a type error inside
    const schema = ast('string | { name: string }');
    let err;
    try {
      assert(schema, { name: 42 });
    } catch (e) {
      err = e;
    }

    // The object branch got deepest — report the inner failure
    expect(err.path).toEqual(['name']);
    expect(err.expected).toBe('string');
    expect(err.actual).toBe('number');
  });

  // ── Named sigil (identifier) errors ──────────────────────────────────────

  it('identifier: resolves named sigil for error reporting', () => {
    Sigil.define('Email')`string`;
    const User = Sigil`{ email: Email }`;
    let err;
    try {
      User.assert({ email: 42 });
    } catch (e) {
      err = e;
    }

    expect(err.path).toEqual(['email']);
    expect(err.expected).toBe('string');
    expect(err.actual).toBe('number');
  });

  it('identifier: reports missing ref gracefully (re-wrapped as SigilValidationError)', () => {
    const schema = ast('{ ref: MissingType }');
    // validate() calls the compiled fn, which throws for unknown sigil refs.
    // assert() catches that and re-wraps it as a SigilValidationError.
    let err;
    try {
      assert(schema, { ref: 1 });
    } catch (e) {
      err = e;
    }

    expect(err).toBeInstanceOf(SigilValidationError);
    expect(err.code).toBe('SIGIL_VALIDATION_FAILED');
    expect(err.message).toMatch(/MissingType/);
  });

  // ── Sigil.assert convenience method ──────────────────────────────────────

  it('Sigil.assert() returns the validated value on valid data', () => {
    const User = Sigil`{ name: string }`;
    const data = { name: 'D' };
    expect(User.assert(data)).toBe(data);
  });

  it('Sigil.assert() throws SigilValidationError on invalid data', () => {
    const User = Sigil`{ name: string }`;
    expect(() => User.assert({ name: 42 })).toThrow(SigilValidationError);
  });

  it('Sigil.assert() error has correct path and types', () => {
    const Post = Sigil`{ title: string, views: number }`;
    let err;
    try {
      Post.assert({ title: 'Hi', views: 'many' });
    } catch (e) {
      err = e;
    }

    expect(err.path).toEqual(['views']);
    expect(err.expected).toBe('number');
    expect(err.actual).toBe('string');
    expect(err.message).toBe(
      'Expected property "views" to be number, got string',
    );
  });
});
