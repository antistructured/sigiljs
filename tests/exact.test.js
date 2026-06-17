import { expect, test, describe } from 'bun:test';
import { Sigil } from '../src/sigil.js';

describe('Exact Object Mode', () => {
  // ── Core spec cases ───────────────────────────────────────────────────────

  test('Sigil.exact rejects extra properties', () => {
    const User = Sigil.exact`
{
  name: string
}
`;
    expect(User.check({ name: 'D' })).toBe(true);
    expect(User.check({ name: 'D', admin: true })).toBe(false);
  });

  test('Sigil.exact accepts exactly the declared shape', () => {
    const User = Sigil.exact`{ name: string }`;
    expect(User.check({ name: 'Alex' })).toBe(true);
  });

  test('Sigil.exact fails when extra properties are present', () => {
    const User = Sigil.exact`{ name: string }`;
    expect(User.check({ name: 'Alex', extra: true })).toBe(false);
  });

  test('Sigil.exact fails when required properties are missing', () => {
    const User = Sigil.exact`{ name: string }`;
    expect(User.check({})).toBe(false);
    expect(User.check({ admin: true })).toBe(false);
  });

  test('Sigil.exact fails on non-objects', () => {
    const User = Sigil.exact`{ name: string }`;
    expect(User.check('string')).toBe(false);
    expect(User.check(null)).toBe(false);
    expect(User.check(42)).toBe(false);
    expect(User.check([])).toBe(false);
  });

  // ── Contrast with non-exact Sigil ─────────────────────────────────────────

  test('Normal Sigil allows extra properties', () => {
    const User = Sigil`{ name: string }`;
    expect(User.check({ name: 'Alex' })).toBe(true);
    expect(User.check({ name: 'Alex', extra: true })).toBe(true);
  });

  // ── Optional properties ────────────────────────────────────────────────────

  test('Sigil.exact with optional properties: declared optional key is allowed', () => {
    const User = Sigil.exact`{ name: string, age?: number }`;
    expect(User.check({ name: 'Alex' })).toBe(true);
    expect(User.check({ name: 'Alex', age: 30 })).toBe(true);
  });

  test('Sigil.exact with optional properties: extra undeclared key is rejected', () => {
    const User = Sigil.exact`{ name: string, age?: number }`;
    expect(User.check({ name: 'Alex', age: 30, extra: true })).toBe(false);
  });

  // ── Nested objects ─────────────────────────────────────────────────────────
  //
  // BEHAVIOR: When a sigil is created with Sigil.exact, the `exact: true`
  // flag is propagated to ALL object nodes in the schema during parsing.
  // This means nested objects are also strict — extra keys anywhere fail.
  //
  // This is a global mode, not just top-level. If you need mixed behavior
  // (strict top-level, lenient nested), compose separate sigils.

  test('Sigil.exact with nested object: valid data passes', () => {
    const User = Sigil.exact`{
      name: string,
      profile: { bio: string }
    }`;

    expect(User.check({
      name: 'Alex',
      profile: { bio: 'hello' },
    })).toBe(true);
  });

  test('Sigil.exact with nested object: extra key in nested object fails', () => {
    const User = Sigil.exact`{
      name: string,
      profile: { bio: string }
    }`;

    expect(User.check({
      name: 'Alex',
      profile: { bio: 'hello', extra: 1 },
    })).toBe(false);
  });

  test('Sigil.exact with nested object: extra key on top-level object fails', () => {
    const User = Sigil.exact`{
      name: string,
      profile: { bio: string }
    }`;

    expect(User.check({
      name: 'Alex',
      profile: { bio: 'hello' },
      surplus: true,
    })).toBe(false);
  });

  // ── Caching: exact vs non-exact sigils are distinct objects ───────────────

  test('Sigil.exact and Sigil with same schema are different sigil objects', () => {
    const Exact = Sigil.exact`{ name: string }`;
    const Loose = Sigil`{ name: string }`;
    expect(Exact).not.toBe(Loose);
  });

  test('Two Sigil.exact calls with same schema return same cached sigil', () => {
    const A = Sigil.exact`{ name: string }`;
    const B = Sigil.exact`{ name: string }`;
    expect(A).toBe(B);
  });
});
