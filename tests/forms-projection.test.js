import { describe, test, expect } from 'bun:test';
import { oneOf, optional, sigil, union } from '../src/index.js';

describe('Phase 9 Forms projection', () => {
  test('projects basic object fields into form constraints', () => {
    const User = sigil({
      name: String,
      age: optional(Number),
    });

    expect(User.toFormConstraints()).toEqual({
      fields: {
        name: {
          name: 'name',
          path: ['name'],
          required: true,
          label: 'Name',
          type: 'text',
        },
        age: {
          name: 'age',
          path: ['age'],
          required: false,
          label: 'Age',
          type: 'number',
        },
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
      fields: {
        email: {
          name: 'email',
          path: ['email'],
          required: true,
          label: 'Email',
          type: 'text',
        },
        newsletter: {
          name: 'newsletter',
          path: ['newsletter'],
          required: true,
          label: 'Newsletter',
          type: 'checkbox',
        },
        role: {
          name: 'role',
          path: ['role'],
          required: true,
          label: 'Role',
          type: 'select',
          options: ['admin', 'user'],
        },
      },
    });
  });

  test('projects primitive unions as typed choices when safe', () => {
    const Search = sigil({
      id: union(String, Number),
    });

    expect(Search.toFormConstraints()).toEqual({
      fields: {
        id: {
          name: 'id',
          path: ['id'],
          required: true,
          label: 'Id',
          type: 'text',
          accepts: ['text', 'number'],
        },
      },
    });
  });

  test('returns an empty fields map for non-object contracts', () => {
    expect(sigil(String).toFormConstraints()).toEqual({ fields: {} });
  });

  test('returns a fresh constraint map each call', () => {
    const User = sigil({ name: String });
    const first = User.toFormConstraints();
    first.fields.name.type = 'number';

    expect(User.toFormConstraints()).toEqual({
      fields: {
        name: {
          name: 'name',
          path: ['name'],
          required: true,
          label: 'Name',
          type: 'text',
        },
      },
    });
  });
});
