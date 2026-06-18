import { describe, test, expect } from 'bun:test';
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

  test('supports primitive, object, and reference projections', () => {
    const Email = Sigil.define('Email')`string`;
    const User = sigil({ email: Email });

    expect(User.toTypeScript('User')).toBe(`type User = {\n  email: Email\n}`);
  });
});
