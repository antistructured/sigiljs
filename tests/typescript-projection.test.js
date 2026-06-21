import { describe, test, expect } from 'bun:test';
import { SigilProjectionError } from '../src/projection-error.js';
import { Sigil, oneOf, optional, sigil, union } from '../src/index.js';

describe('Phase 7 TypeScript projection', () => {
  test('projects object contracts to a TypeScript type', () => {
    const User = sigil({ id: Number, name: String });
    expect(User.toTypeScript('User')).toBe(`type User = {
  id: number
  name: string
}`);
  });

  test('projects optional fields', () => {
    const User = sigil({ id: Number, name: optional(String) });
    expect(User.toTypeScript('User')).toBe(`type User = {
  id: number
  name?: string
}`);
  });

  test('projects arrays', () => {
    const Model = Sigil`string[]`;
    expect(Model.toTypeScript('Model')).toBe(`type Model = string[]`);
  });

  test('projects broad array and object constructors without inventing structure', () => {
    expect(sigil(Array).toTypeScript('Values')).toBe(
      `type Values = unknown[]`,
    );
    expect(sigil(Object).toTypeScript('RecordValue')).toBe(
      `type RecordValue = Record<string, unknown>`,
    );
  });

  test('projects literal strings, numbers, booleans, and null', () => {
    expect(sigil(oneOf('admin', 1, true, false, null)).toTypeScript('Value'))
      .toBe(`type Value = "admin" | 1 | true | false | null`);
  });

  test('projects literal unions', () => {
    const Role = sigil(oneOf('admin', 'user', null));
    expect(Role.toTypeScript('Role')).toBe(
      `type Role = "admin" | "user" | null`,
    );
  });

  test('projects primitive unions', () => {
    const ID = Sigil`string | number`;
    expect(ID.toTypeScript('ID')).toBe(`type ID = string | number`);
  });

  test('projects nested objects, arrays, unions, literals, and optionals readably', () => {
    const User = sigil({
      id: union(String, Number),
      name: String,
      role: oneOf('admin', 'user'),
      active: oneOf(true, false),
      tags: Sigil`string[]`,
      profile: {
        age: optional(Number),
        score: oneOf(1, 2),
      },
    });

    const expected = `type User = {
  id: string | number
  name: string
  role: "admin" | "user"
  active: true | false
  tags: string[]
  profile: {
    age?: number
    score: 1 | 2
  }
}`;

    expect(User.toTypeScript('User')).toBe(expected);
    expect(User.toTypeScript('User')).toBe(expected);
  });

  test('supports primitive, object, and reference projections', () => {
    const Email = Sigil.define('Email')`string`;
    const User = sigil({ email: Email });

    expect(User.toTypeScript('User')).toBe(`type User = {\n  email: Email\n}`);
  });

  test('uses referenced contract metadata names when available', () => {
    const Email = Sigil.define('Email')`string`.withMetadata({
      name: 'EmailAddress',
    });
    const User = sigil({ email: Email });

    expect(User.toTypeScript('User')).toBe(
      `type User = {\n  email: EmailAddress\n}`,
    );
  });

  test('uses metadata name as the declaration name when no explicit name is supplied', () => {
    const User = sigil({ id: Number }).withMetadata({ name: 'User' });

    expect(User.toTypeScript()).toBe(`type User = {
  id: number
}`);
  });

  test('projects contract metadata as a TypeScript doc comment without runtime-safety claims', () => {
    const User = sigil({ id: Number }).withMetadata({
      description: 'Application user shape.',
      version: '1.2.0',
      tags: ['api', 'user'],
    });

    const output = User.toTypeScript('User');

    expect(output).toBe(`/**
 * Application user shape.
 * @version 1.2.0
 * @tags api, user
 */
type User = {
  id: number
}`);
    expect(output).not.toContain('runtime safe');
    expect(output).not.toContain('trusted');
  });

  test('throws SigilProjectionError for unsupported contract kinds', () => {
    const Contract = Sigil`symbol`;

    const error = Contract.toTypeScript('Contract');

    expect(error).toBeInstanceOf(SigilProjectionError);
    expect(error.code).toBe('SIGIL_PROJECTION_FAILED');
    expect(error.projection).toBe('typescript');
    expect(error.path).toEqual([]);
    expect(error.reason).toBe('unsupported contract description');
  });
});
