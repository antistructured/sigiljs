import { describe, test, expect, beforeEach } from 'bun:test';
import {
  Sigil,
  oneOf,
  optional,
  pipe,
  sigil,
  trim,
  union,
} from '../src/index.js';
import { clear } from '../src/core/registry.js';

describe('Phase 5 canonical contract description', () => {
  beforeEach(() => {
    clear();
  });

  test('describes primitives', () => {
    expect(Sigil`string`.describe()).toEqual({ kind: 'string' });
    expect(sigil(Number).describe()).toEqual({ kind: 'number' });
    expect(Sigil`boolean`.describe()).toEqual({ kind: 'boolean' });
    expect(Sigil`bigint`.describe()).toEqual({ kind: 'bigint' });
    expect(Sigil`symbol`.describe()).toEqual({ kind: 'symbol' });
    expect(Sigil`null`.describe()).toEqual({ kind: 'literal', value: null });
    expect(sigil(Array).describe()).toEqual({ kind: 'array' });
    expect(sigil(Object).describe()).toEqual({ kind: 'object' });
  });

  test('describes arrays', () => {
    expect(Sigil`string[]`.describe()).toEqual({
      kind: 'array',
      element: { kind: 'string' },
    });
  });

  test('describes objects and optionals', () => {
    expect(
      sigil({
        id: Number,
        name: String,
        age: optional(Number),
      }).describe(),
    ).toEqual({
      kind: 'object',
      exact: false,
      properties: [
        { key: 'id', required: true, contract: { kind: 'number' } },
        { key: 'name', required: true, contract: { kind: 'string' } },
        { key: 'age', required: false, contract: { kind: 'number' } },
      ],
    });
  });

  test('describes primitive unions and literal unions', () => {
    expect(sigil({ id: union(String, Number) }).describe()).toEqual({
      kind: 'object',
      exact: false,
      properties: [
        {
          key: 'id',
          required: true,
          contract: {
            kind: 'union',
            variants: [{ kind: 'string' }, { kind: 'number' }],
          },
        },
      ],
    });

    expect(sigil({ role: oneOf('admin', 'user') }).describe()).toEqual({
      kind: 'object',
      exact: false,
      properties: [
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

  test('describes named sigil references without exposing parser internals', () => {
    Sigil.define('Email')`string`;

    expect(Sigil`{ email: Email }`.describe()).toEqual({
      kind: 'object',
      exact: false,
      properties: [
        {
          key: 'email',
          required: true,
          contract: { kind: 'reference', name: 'Email' },
        },
      ],
    });
  });

  test('describes exact mode', () => {
    expect(sigil.exact({ name: String }).describe()).toEqual({
      kind: 'object',
      exact: true,
      properties: [
        { key: 'name', required: true, contract: { kind: 'string' } },
      ],
    });
  });

  test('describe() returns a fresh stable model each call', () => {
    const User = sigil({ name: String });
    const first = User.describe();
    const second = User.describe();

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
    first.properties.push({ key: 'mutated', required: true, contract: {} });
    expect(User.describe()).toEqual(second);
  });

  test('describes optional contract metadata', () => {
    const User = sigil({ name: String }).withMetadata({
      name: 'User',
      version: '1.2.0',
      description: 'Trusted user boundary object.',
      tags: ['api', 'user'],
    });

    expect(User.describe()).toEqual({
      kind: 'object',
      exact: false,
      properties: [
        { key: 'name', required: true, contract: { kind: 'string' } },
      ],
      metadata: {
        name: 'User',
        version: '1.2.0',
        description: 'Trusted user boundary object.',
        tags: ['api', 'user'],
      },
    });

    const first = User.describe();
    first.metadata.tags.push('mutated');
    expect(User.describe().metadata.tags).toEqual(['api', 'user']);
  });

  test('describes transform metadata without exposing transform functions', () => {
    const User = sigil({
      name: pipe(String, trim()),
      nested: {
        title: pipe(String, trim(), (value) => value.toUpperCase()),
      },
    }).transform((user) => ({ ...user, name: user.name.toUpperCase() }));

    expect(User.describe()).toEqual({
      kind: 'object',
      exact: false,
      properties: [
        { key: 'name', required: true, contract: { kind: 'string' } },
        {
          key: 'nested',
          required: true,
          contract: {
            kind: 'object',
            exact: false,
            properties: [
              { key: 'title', required: true, contract: { kind: 'string' } },
            ],
          },
        },
      ],
      metadata: {
        transforms: {
          contract: 1,
          fields: [
            { path: ['name'], count: 1 },
            { path: ['nested', 'title'], count: 2 },
          ],
        },
      },
    });
  });
});
