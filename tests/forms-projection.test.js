import { describe, test, expect } from 'bun:test';
import { oneOf, optional, sigil, union } from '../src/index.js';

describe('Phase 9 Forms projection', () => {
  test('projects basic object fields into form constraints', () => {
    const User = sigil({
      name: String,
      age: optional(Number),
    });

    expect(User.toFormConstraints()).toEqual({
      name: {
        required: true,
        type: 'text',
      },
      age: {
        required: false,
        type: 'number',
      },
    });
  });

  test('projects booleans and literal choices into form metadata', () => {
    const Signup = sigil({
      email: String,
      newsletter: Boolean,
      role: oneOf('admin', 'user'),
    });

    expect(Signup.toFormConstraints()).toEqual({
      email: {
        required: true,
        type: 'text',
      },
      newsletter: {
        required: true,
        type: 'checkbox',
      },
      role: {
        required: true,
        type: 'select',
        options: ['admin', 'user'],
      },
    });
  });

  test('projects primitive unions as typed choices when safe', () => {
    const Search = sigil({
      id: union(String, Number),
    });

    expect(Search.toFormConstraints()).toEqual({
      id: {
        required: true,
        type: 'text',
        accepts: ['text', 'number'],
      },
    });
  });

  test('returns an empty constraint map for non-object contracts', () => {
    expect(sigil(String).toFormConstraints()).toEqual({});
  });

  test('returns a fresh constraint map each call', () => {
    const User = sigil({ name: String });
    const first = User.toFormConstraints();
    first.name.type = 'number';

    expect(User.toFormConstraints()).toEqual({
      name: {
        required: true,
        type: 'text',
      },
    });
  });
});
