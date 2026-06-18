import { describe, expect, it } from 'bun:test';
import { Sigil } from '../src/index.js';
import { parse } from '../src/core/parser.js';

function propertyValue(ast, key) {
  return ast.properties.find((property) => property.key === key).value;
}

describe('literal values', () => {
  it('parses stable literal AST node shapes', () => {
    expect(parse('"admin"')).toEqual({
      kind: 'literal',
      value: 'admin',
      valueType: 'string',
    });
    expect(parse('200')).toEqual({
      kind: 'literal',
      value: 200,
      valueType: 'number',
    });
    expect(parse('true')).toEqual({
      kind: 'literal',
      value: true,
      valueType: 'boolean',
    });
    expect(parse('false')).toEqual({
      kind: 'literal',
      value: false,
      valueType: 'boolean',
    });
    expect(parse('null')).toEqual({
      kind: 'literal',
      value: null,
      valueType: 'null',
    });
  });

  it('validates string literal unions', () => {
    const Role = Sigil`"admin" | "user"`;

    expect(Role.check('admin')).toBe(true);
    expect(Role.check('user')).toBe(true);
    expect(Role.check('guest')).toBe(false);
  });

  it('validates number literal unions', () => {
    const SuccessStatus = Sigil`200 | 201`;

    expect(SuccessStatus.check(200)).toBe(true);
    expect(SuccessStatus.check(201)).toBe(true);
    expect(SuccessStatus.check(204)).toBe(false);
    expect(SuccessStatus.check('200')).toBe(false);
  });

  it('validates boolean literals', () => {
    const TrueOnly = Sigil`true`;
    const FalseOnly = Sigil`false`;

    expect(TrueOnly.check(true)).toBe(true);
    expect(TrueOnly.check(false)).toBe(false);
    expect(FalseOnly.check(false)).toBe(true);
    expect(FalseOnly.check(true)).toBe(false);
  });

  it('validates null literal', () => {
    const NullOnly = Sigil`null`;

    expect(NullOnly.check(null)).toBe(true);
    expect(NullOnly.check(undefined)).toBe(false);
    expect(NullOnly.check('null')).toBe(false);
  });

  it('validates literal unions inside objects', () => {
    const User = Sigil`
    {
      role: "admin" | "user"
    }
    `;

    expect(User.check({ role: 'admin' })).toBe(true);
    expect(User.check({ role: 'user' })).toBe(true);
    expect(User.check({ role: 'guest' })).toBe(false);
  });

  it('keeps literal union AST values stable inside objects', () => {
    const ast = Sigil`{ role: "admin" | "user" }`.normalized;

    expect(propertyValue(ast, 'role')).toEqual({
      kind: 'literal_union',
      values: ['admin', 'user'],
    });
  });
});
