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
  return sigil({
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
}

function arrayOfObjects() {
  return Sigil`{ id: number, name: string }[]`;
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

describe('TypeScript snapshot projection', () => {
  test('primitive', () => {
    expect(primitive().toTypeScript('Value')).toBe(
      `type Value = string`,
    );
  });

  test('literal union', () => {
    expect(literalUnion().toTypeScript('Value')).toBe(
      `type Value = "admin" | "user" | null`,
    );
  });

  test('simple object', () => {
    expect(simpleObject().toTypeScript('User')).toBe(`type User = {
  id: number
  name: string
  age?: number
}`);
  });

  test('exact object', () => {
    expect(exactObject().toTypeScript('User')).toBe(`type User = {
  id: number
  name: string
  role: "admin" | "user"
}`);
  });

  test('nested object', () => {
    expect(nestedObject().toTypeScript('User')).toBe(`type User = {
  id: string | number
  name: string
  role: "admin" | "user"
  active: true | false
  tags: string[]
  profile: {
    age?: number
    score: 1 | 2
  }
}`);
  });

  test('array of objects', () => {
    expect(arrayOfObjects().toTypeScript('Items')).toBe(
      `type Items = Array<{
  id: number
  name: string
}>`,
    );
  });

  test('named sigil reference', () => {
    expect(namedSigilReference().toTypeScript('User')).toBe(
      `type User = {
  email: Email
}`,
    );
  });

  test('metadata contract', () => {
    expect(metadataContract().toTypeScript('User')).toBe(`/**
 * Application user shape.
 * @version 1.2.0
 * @tags api, user
 */
type User = {
  id: number
}`);
  });
});
