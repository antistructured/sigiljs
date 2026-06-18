import { describe, it, expect, beforeEach } from 'bun:test';
import { parse } from '../src/core/parser.js';
import { normalize } from '../src/core/normalize.js';
import { partial } from '../src/core/partial.js';
import { compile } from '../src/core/compile.js';
import { Sigil } from '../src/sigil.js';

// ─────────────────────────────────────────────────────────────
// Low-level pipeline: compile() directly
// ─────────────────────────────────────────────────────────────
describe('compiler (low-level pipeline)', () => {
  it('compiles and validates primitives', () => {
    const ast = partial(normalize(parse('string')));
    const check = compile(ast);
    expect(check('hello')).toBe(true);
    expect(check(42)).toBe(false);
  });

  it('uses strict primitive semantics for number, null, and array', () => {
    const NumberCheck = compile(partial(normalize(parse('number'))));
    const NullCheck = compile(partial(normalize(parse('null'))));
    const ArrayCheck = compile(partial(normalize(parse('array'))));

    expect(NumberCheck(1)).toBe(true);
    expect(NumberCheck(Number.NaN)).toBe(false);
    expect(NullCheck(null)).toBe(true);
    expect(NullCheck(undefined)).toBe(false);
    expect(ArrayCheck([])).toBe(true);
    expect(ArrayCheck({ length: 0 })).toBe(false);
  });

  it('compiles unions', () => {
    const ast = partial(normalize(parse('string | number')));
    const check = compile(ast);
    expect(check('hello')).toBe(true);
    expect(check(42)).toBe(true);
    expect(check(Number.NaN)).toBe(false);
    expect(check(false)).toBe(false);
  });

  it('compiles objects', () => {
    const ast = partial(normalize(parse('{ name: string, age?: number }')));
    const check = compile(ast);
    expect(check({ name: 'D' })).toBe(true);
    expect(check({ name: 'D', age: 42 })).toBe(true);
    expect(check({ age: 42 })).toBe(false);
    expect(check('not object')).toBe(false);
    expect(check(null)).toBe(false);
  });

  it('memoizes compilation (same AST shape → same function reference)', () => {
    const ast1 = partial(normalize(parse('object')));
    const ast2 = partial(normalize(parse('object')));
    const check1 = compile(ast1);
    const check2 = compile(ast2);
    expect(check1).toBe(check2);
  });
});

// ─────────────────────────────────────────────────────────────
// High-level Sigil API: compiled validators via tagged template
// ─────────────────────────────────────────────────────────────
describe('Sigil compiled validators (high-level)', () => {
  it('Sigil`string` validates strings', () => {
    const S = Sigil`string`;
    expect(S.check('hello')).toBe(true);
    expect(S.check(42)).toBe(false);
    expect(S.check(null)).toBe(false);
    expect(S.check(undefined)).toBe(false);
  });

  it('Sigil`string | number` validates union', () => {
    const S = Sigil`string | number`;
    expect(S.check('hello')).toBe(true);
    expect(S.check(42)).toBe(true);
    expect(S.check(true)).toBe(false);
    expect(S.check(null)).toBe(false);
  });

  it('Sigil`string[]` validates string arrays', () => {
    const S = Sigil`string[]`;
    expect(S.check(['a', 'b', 'c'])).toBe(true);
    expect(S.check([])).toBe(true);
    expect(S.check(['a', 1])).toBe(false);
    expect(S.check('not array')).toBe(false);
    expect(S.check(null)).toBe(false);
  });

  it('Sigil`{ name: string }` validates object schema', () => {
    const S = Sigil`
{
  name: string
}
`;
    expect(S.check({ name: 'D' })).toBe(true);
    expect(S.check({ name: 'D', extra: true })).toBe(true); // non-exact: extra props ok
    expect(S.check({ name: 42 })).toBe(false);
    expect(S.check({})).toBe(false);
    expect(S.check(null)).toBe(false);
  });

  // ── Validator reuse: sigil.validator ──────────────────────────────────────

  it('sigil.validator is a function', () => {
    const User = Sigil`{ name: string }`;
    expect(typeof User.validator).toBe('function');
  });

  it('sigil.validator and sigil.compile() return the same reference', () => {
    const User = Sigil`{ name: string }`;
    const viaProperty = User.validator;
    const viaMethod = User.compile();
    expect(viaProperty).toBe(viaMethod);
  });

  it('sigil.validator is stable — same reference across multiple accesses', () => {
    const User = Sigil`{ name: string }`;

    const first = User.validator;
    User.check({ name: 'D' });
    User.check({ name: 42 });
    const second = User.validator;

    expect(first).toBe(second);
  });

  it('sigil.compile() is stable — same reference on repeated calls', () => {
    const User = Sigil`{ name: string }`;

    const first = User.compile();
    User.check({ name: 'D' });
    const second = User.compile();

    expect(first).toBe(second);
  });

  it('identical schema strings share the same sigil object (sigil-level cache)', () => {
    const A = Sigil`string | number`;
    const B = Sigil`string | number`;
    expect(A).toBe(B); // same object — zero re-parse
  });

  it('identical schema strings share the same validator reference', () => {
    const A = Sigil`boolean`;
    const B = Sigil`boolean`;
    expect(A.validator).toBe(B.validator);
  });

  it('sigil.validator correctly validates values', () => {
    const User = Sigil`{ name: string }`;
    const check = User.validator;
    expect(check({ name: 'Alice' })).toBe(true);
    expect(check({ name: 99 })).toBe(false);
    expect(check(null)).toBe(false);
  });
});
