import { describe, test, expect } from 'bun:test';
import {
  Sigil,
  oneOf,
  optional,
  sigil,
  union,
} from '../../src/index.js';

function primitive() {
  return Sigil`string`;
}

function literalUnion() {
  return Sigil`"admin" | "user" | null`;
}

function simpleObject() {
  return sigil({
    id: Number,
    name: String,
    age: optional(Number),
  });
}

function exactObject() {
  return sigil.exact({
    id: Number,
    name: String,
    role: oneOf('admin', 'user'),
  });
}

function nestedObject() {
  return sigil.exact({
    id: Number,
    profile: sigil.exact({
      displayName: String,
      timezone: optional(String),
      roles: Sigil`"admin"[]`,
    }),
  });
}

function arrayOfObjects() {
  return sigil({
    users: Sigil`{ id: number, name: string }[]`,
  });
}

function namedSigilReference() {
  const Email = Sigil.define('Email')`string`;
  return sigil({ email: Email });
}

function metadataContract() {
  return sigil({ id: Number }).withMetadata({
    name: 'User',
    version: '1.2.0',
    description: 'Application user shape.',
    tags: ['api', 'user'],
  });
}

describe('OpenAPI snapshot projection', () => {
  test('primitive', () => {
    expect(primitive().toOpenAPI()).toEqual({
      type: 'string',
    });
  });

  test('literal union', () => {
    expect(literalUnion().toOpenAPI()).toEqual({
      enum: ['admin', 'user', null],
    });
  });

  test('simple object', () => {
    expect(simpleObject().toOpenAPI()).toEqual({
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        age: { type: 'number' },
      },
      required: ['id', 'name'],
    });
  });

  test('exact object', () => {
    expect(exactObject().toOpenAPI()).toEqual({
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

  test('nested object', () => {
    expect(nestedObject().toOpenAPI()).toEqual({
      type: 'object',
      properties: {
        id: { type: 'number' },
        profile: {
          type: 'object',
          properties: {
            displayName: { type: 'string' },
            timezone: { type: 'string' },
            roles: {
              type: 'array',
              items: { const: 'admin' },
            },
          },
          required: ['displayName', 'roles'],
          additionalProperties: false,
        },
      },
      required: ['id', 'profile'],
      additionalProperties: false,
    });
  });

  test('array of objects', () => {
    expect(arrayOfObjects().toOpenAPI()).toEqual({
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
            },
            required: ['id', 'name'],
          },
        },
      },
      required: ['users'],
    });
  });

  test('named sigil reference', () => {
    expect(namedSigilReference().toOpenAPI()).toEqual({
      type: 'object',
      properties: {
        email: { $ref: '#/$defs/Email' },
      },
      required: ['email'],
    });
  });

  test('metadata contract', () => {
    expect(metadataContract().toOpenAPI()).toEqual({
      title: 'User',
      description: 'Application user shape.',
      'x-version': '1.2.0',
      'x-tags': ['api', 'user'],
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
      required: ['id'],
    });
  });
});
