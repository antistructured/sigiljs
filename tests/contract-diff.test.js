import { describe, test, expect } from 'bun:test';
import { optional, sigil } from '../src/index.js';

describe('Phase 13 Contract lifecycle diff', () => {
  test('diff() detects added and removed object fields', () => {
    const UserV1 = sigil({
      id: Number,
      name: String,
    });
    const UserV2 = sigil({
      id: Number,
      email: String,
    });

    expect(UserV2.diff(UserV1)).toEqual({
      added: [
        {
          key: 'email',
          field: {
            key: 'email',
            required: true,
            contract: { kind: 'string' },
          },
        },
      ],
      removed: [
        {
          key: 'name',
          field: {
            key: 'name',
            required: true,
            contract: { kind: 'string' },
          },
        },
      ],
      changed: [],
      requiredness: [],
    });
  });

  test('diff() detects changed field types', () => {
    const UserV1 = sigil({ age: Number });
    const UserV2 = sigil({ age: String });

    expect(UserV2.diff(UserV1)).toEqual({
      added: [],
      removed: [],
      changed: [
        {
          key: 'age',
          before: { kind: 'number' },
          after: { kind: 'string' },
        },
      ],
      requiredness: [],
    });
  });

  test('diff() detects optional-to-required and required-to-optional changes', () => {
    const UserV1 = sigil({
      name: optional(String),
      email: String,
    });
    const UserV2 = sigil({
      name: String,
      email: optional(String),
    });

    expect(UserV2.diff(UserV1)).toEqual({
      added: [],
      removed: [],
      changed: [],
      requiredness: [
        {
          key: 'name',
          before: 'optional',
          after: 'required',
        },
        {
          key: 'email',
          before: 'required',
          after: 'optional',
        },
      ],
    });
  });

  test('diff() supports exact object contracts but currently ignores exact flag changes', () => {
    const UserV1 = sigil.exact({ name: String });
    const UserV2 = sigil.exact({ name: String, age: optional(Number) });

    expect(UserV2.diff(UserV1)).toEqual({
      added: [
        {
          key: 'age',
          field: {
            key: 'age',
            required: false,
            contract: { kind: 'number' },
          },
        },
      ],
      removed: [],
      changed: [],
      requiredness: [],
    });
  });

  test('diff() requires object contracts for the initial lifecycle diff', () => {
    const User = sigil({ name: String });
    const Name = sigil(String);

    expect(() => User.diff(Name)).toThrow(
      'Contract diff currently supports object contracts only',
    );
    expect(() => Name.diff(User)).toThrow(
      'Contract diff currently supports object contracts only',
    );
  });
});
