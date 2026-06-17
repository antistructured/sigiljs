import { expect, test, describe, beforeEach } from 'bun:test';
import { Sigil } from '../src/sigil.js';
import { clear } from '../src/core/registry.js';

describe('Named / Defined Sigils', () => {
  beforeEach(() => {
    clear();
  });

  // ── Sigil.define (alias for Sigil.named) ──────────────────────────────────

  test('Sigil.define is available as an alias for Sigil.named', () => {
    expect(Sigil.define).toBe(Sigil.named);
  });

  test('Sigil.define("Email")`string` creates and registers a named sigil', () => {
    const Email = Sigil.define('Email')`string`;
    expect(Email).toBeDefined();
    expect(Email.check('test@example.com')).toBe(true);
    expect(Email.check(42)).toBe(false);
  });

  test('Sigil.define: named sigil is resolvable inside another Sigil', () => {
    const Email = Sigil.define('Email')`string`;

    const User = Sigil`
{
  email: Email
}
`;

    expect(User.check({ email: 'hello@example.com' })).toBe(true);
    expect(User.check({ email: 123 })).toBe(false);
    expect(User.check({})).toBe(false);
  });

  // ── Sigil.named (original API) ────────────────────────────────────────────

  test('Sigil.named resolves named sigils in other schemas', () => {
    Sigil.named('Email')`string`;
    const User = Sigil`{ email: Email }`;

    expect(User.check({ email: 'test@example.com' })).toBe(true);
    expect(User.check({ email: 123 })).toBe(false);
  });

  // ── Nested references ──────────────────────────────────────────────────────

  test('nested reference: named sigil referencing another named sigil', () => {
    Sigil.define('ID')`number`;
    Sigil.define('User')`{ id: ID, name: string }`;
    const Org = Sigil`{ owner: User }`;

    expect(Org.check({ owner: { id: 1, name: 'Alex' } })).toBe(true);
    expect(Org.check({ owner: { id: 'not-a-number', name: 'Alex' } })).toBe(false);
    expect(Org.check({ owner: { name: 'Alex' } })).toBe(false);
  });

  test('named sigil used as array element type', () => {
    Sigil.define('Tag')`string`;
    const Post = Sigil`{ tags: Tag[] }`;

    expect(Post.check({ tags: ['news', 'update'] })).toBe(true);
    expect(Post.check({ tags: [1, 2] })).toBe(false);
  });

  test('named sigil used in a union', () => {
    Sigil.define('Email')`string`;
    const Contact = Sigil`{ contact: Email | number }`;

    expect(Contact.check({ contact: 'a@b.com' })).toBe(true);
    expect(Contact.check({ contact: 555 })).toBe(true);
    expect(Contact.check({ contact: true })).toBe(false);
  });

  // ── Missing reference ─────────────────────────────────────────────────────

  test('missing reference throws at validation time, not definition time', () => {
    // Defining the schema does NOT throw even though Missing is unknown
    const UnknownWrap = Sigil`{ ref: Missing }`;

    // Validation triggers resolution and throws
    expect(() => UnknownWrap.check({ ref: 1 })).toThrow(/Unknown sigil reference: Missing/);
  });

  // ── Duplicate name behavior ───────────────────────────────────────────────
  //
  // BEHAVIOR: last-write-wins. Re-registering a name overwrites the previous
  // sigil silently. There is no conflict error.

  test('duplicate name: second definition overwrites the first (last-write-wins)', () => {
    Sigil.define('Type')`string`;
    Sigil.define('Type')`number`;

    const S = Sigil`{ val: Type }`;

    // Now Type resolves to `number`
    expect(S.check({ val: 42 })).toBe(true);
    expect(S.check({ val: 'hello' })).toBe(false);
  });

  // ── Circular reference safety ─────────────────────────────────────────────
  //
  // Circular refs are resolved lazily at validation time via the deferred
  // lookup path in compile.js. Deep finite structures validate correctly.

  test('circular references are handled gracefully', () => {
    const A = Sigil.define('A')`{ b: B | null }`;
    const B = Sigil.define('B')`{ a: A | null }`;

    const valid = { b: { a: { b: null } } };
    expect(A.check(valid)).toBe(true);
    expect(A.check({ b: { a: { b: 123 } } })).toBe(false);
    expect(A.check({ b: null })).toBe(true);
  });

  test('self-referential sigil does not throw at definition time', () => {
    // Node → { next: Node | null }
    // Compiled lazily, so defining it doesn't cause infinite recursion
    expect(() => {
      Sigil.define('Node')`{ next: Node | null }`;
    }).not.toThrow();
  });

  test('self-referential sigil validates finite chains', () => {
    Sigil.define('Node')`{ next: Node | null }`;
    const Node = Sigil`{ next: Node | null }`;

    expect(Node.check({ next: null })).toBe(true);
    expect(Node.check({ next: { next: null } })).toBe(true);
    expect(Node.check({ next: { next: { next: null } } })).toBe(true);
    expect(Node.check({ next: 'bad' })).toBe(false);
  });
});
