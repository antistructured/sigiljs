import { describe, test, expect, beforeEach } from 'bun:test';
import {
  Sigil,
  S,
  T,
  httpContract,
  realType,
  SigilValidationError,
} from '../src/index.js';
import { clear } from '../src/core/registry.js';

describe('Phase 1 contract core stabilization', () => {
  beforeEach(() => {
    clear();
  });

  test('public exports expose the current contract API', () => {
    expect(S).toBe(Sigil);
    expect(T).toBe(Sigil);
    expect(realType([])).toBe('array');
    expect(typeof httpContract).toBe('function');
    expect(typeof SigilValidationError).toBe('function');
  });

  test('Sigil contracts have a stable executable contract object shape', () => {
    const User = Sigil`{ name: string }`;

    expect(User.kind).toBe('sigil.contract');
    expect(User.name).toBeUndefined();
    expect(User.source).toBe('{ name: string }');
    expect(User.raw).toBe(User.source);
    expect(User.ast).toBeDefined();
    expect(User.normalized).toBeDefined();
    expect(typeof User.validator).toBe('function');
    expect(User.options).toEqual({ exact: false });
    expect(typeof User.check).toBe('function');
    expect(typeof User.assert).toBe('function');
    expect(typeof User.parse).toBe('function');
    expect(typeof User.safeParse).toBe('function');
    expect(typeof User.serialize).toBe('function');
    expect(typeof User.transform).toBe('function');
    expect(typeof User.describe).toBe('function');
    expect(typeof User.toJSONSchema).toBe('function');
    expect(typeof User.toTypeScript).toBe('function');
    expect(typeof User.toOpenAPI).toBe('function');
    expect(typeof User.toFormConstraints).toBe('function');
    expect(typeof User.mock).toBe('function');
    expect(typeof User.cases).toBe('function');
    expect(typeof User.diff).toBe('function');
    expect(typeof User.compile).toBe('function');
  });

  test('compiled validator reuse is stable', () => {
    const User = Sigil`{ name: string }`;

    expect(User.validator).toBe(User.compile());
    expect(User.validator).toBe(Sigil`{ name: string }`.validator);
    expect(User.check({ name: 'D' })).toBe(true);
  });

  test('parse aliases assert semantics and returns trusted input when valid', () => {
    const User = Sigil`{ name: string }`;
    const input = { name: 'D' };

    expect(User.assert(input)).toBe(input);
    expect(User.parse(input)).toBe(input);
    expect(() => User.parse({ name: 1 })).toThrow(SigilValidationError);
  });

  test('safeParse returns result objects and never throws', () => {
    const User = Sigil`{ name: string }`;

    expect(User.safeParse({ name: 'D' })).toEqual({
      success: true,
      data: { name: 'D' },
    });

    const result = User.safeParse({ name: 1 });
    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(SigilValidationError);
    expect(result.error.path).toEqual(['name']);
  });

  test('exact mode behavior is preserved', () => {
    const Loose = Sigil`{ name: string }`;
    const Exact = Sigil.exact`{ name: string }`;

    expect(Loose.check({ name: 'D', extra: true })).toBe(true);
    expect(Exact.check({ name: 'D' })).toBe(true);
    expect(Exact.check({ name: 'D', extra: true })).toBe(false);
    expect(Exact.options.exact).toBe(true);
  });

  test('named sigils work inside objects and arrays', () => {
    const Email = Sigil.define('Email')`string`;
    const User = Sigil`{ email: Email, backups: Email[] }`;

    expect(Email.kind).toBe('sigil.contract');
    expect(Email.name).toBe('Email');
    expect(User.check({ email: 'a@b.com', backups: ['c@d.com'] })).toBe(true);
    expect(User.check({ email: 1, backups: ['c@d.com'] })).toBe(false);
    expect(User.check({ email: 'a@b.com', backups: [1] })).toBe(false);
  });

  test('missing named sigil references fail clearly at enforcement time', () => {
    const Missing = Sigil`{ email: MissingEmail }`;

    expect(() => Missing.check({ email: 'a@b.com' })).toThrow(
      /Unknown sigil reference: MissingEmail/,
    );
    expect(() => Missing.assert({ email: 'a@b.com' })).toThrow(
      /Unknown sigil reference: MissingEmail/,
    );
    expect(Missing.safeParse({ email: 'a@b.com' }).success).toBe(false);
  });

  test('circular named sigils validate finite recursive structures', () => {
    const Node = Sigil.define('Node')`{ next: Node | null }`;

    expect(Node.check({ next: null })).toBe(true);
    expect(Node.check({ next: { next: null } })).toBe(true);
    expect(Node.check({ next: { next: 'bad' } })).toBe(false);
  });

  test('describe returns a stable public contract description', () => {
    const User = Sigil.exact`
    {
      id: string | number
      email?: Email
      tags: string[]
      role: "admin" | "user"
    }
    `;

    expect(User.describe()).toEqual({
      kind: 'object',
      exact: true,
      properties: [
        {
          key: 'id',
          required: true,
          contract: {
            kind: 'union',
            variants: [{ kind: 'string' }, { kind: 'number' }],
          },
        },
        {
          key: 'email',
          required: false,
          contract: { kind: 'reference', name: 'Email' },
        },
        {
          key: 'tags',
          required: true,
          contract: { kind: 'array', element: { kind: 'string' } },
        },
        {
          key: 'role',
          required: true,
          contract: {
            kind: 'union',
            variants: [
              { kind: 'literal', value: 'admin' },
              { kind: 'literal', value: 'user' },
            ],
          },
        },
      ],
    });
  });
});
