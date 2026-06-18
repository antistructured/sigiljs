import { describe, test, expect } from 'bun:test';
import { Sigil, oneOf, optional, sigil, union } from '../src/index.js';

describe('Phase 6 JSON Schema projection', () => {
  test('projects the acceptance example to JSON Schema-like output', () => {
    const User = sigil.exact({
      id: Number,
      name: String,
      role: oneOf('admin', 'user'),
    });

    expect(User.toJSONSchema()).toEqual({
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        role: { enum: ['admin', 'user'] },
      },
      required: ['id', 'name', 'role'],
      additionalProperties: false,
    });
  });

  test('projects primitive contracts', () => {
    expect(Sigil`string`.toJSONSchema()).toEqual({ type: 'string' });
    expect(Sigil`number`.toJSONSchema()).toEqual({ type: 'number' });
    expect(Sigil`boolean`.toJSONSchema()).toEqual({ type: 'boolean' });
    expect(Sigil`null`.toJSONSchema()).toEqual({ type: 'null' });
  });

  test('projects arrays', () => {
    expect(Sigil`string[]`.toJSONSchema()).toEqual({
      type: 'array',
      items: { type: 'string' },
    });
  });

  test('projects objects with required and optional fields', () => {
    const User = sigil({
      id: Number,
      name: String,
      age: optional(Number),
    });

    expect(User.toJSONSchema()).toEqual({
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        age: { type: 'number' },
      },
      required: ['id', 'name'],
    });
  });

  test('projects exact mode using additionalProperties false', () => {
    expect(sigil.exact({ name: String }).toJSONSchema()).toEqual({
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
      additionalProperties: false,
    });
  });

  test('projects primitive unions using JSON Schema type arrays', () => {
    expect(sigil({ id: union(String, Number) }).toJSONSchema()).toEqual({
      type: 'object',
      properties: {
        id: { type: ['string', 'number'] },
      },
      required: ['id'],
    });
  });

  test('projects literal unions as enum', () => {
    expect(
      sigil({ role: oneOf('admin', 'user', null) }).toJSONSchema(),
    ).toEqual({
      type: 'object',
      properties: {
        role: { enum: ['admin', 'user', null] },
      },
      required: ['role'],
    });
  });

  test('projects mixed unions as anyOf', () => {
    expect(Sigil`string | "admin"[]`.toJSONSchema()).toEqual({
      anyOf: [{ type: 'string' }, { type: 'array', items: { const: 'admin' } }],
    });
  });

  test('projects named references as JSON Schema refs', () => {
    Sigil.define('Email')`string`;

    expect(Sigil`{ email: Email }`.toJSONSchema()).toEqual({
      type: 'object',
      properties: {
        email: { $ref: '#/$defs/Email' },
      },
      required: ['email'],
    });
  });
});
