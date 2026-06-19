import { describe, expect, test } from 'bun:test';
import { Sigil, sigil } from '../src/index.js';

describe('Contract metadata', () => {
  test('sigil() accepts optional metadata without changing validation behavior', () => {
    const PlainUser = sigil({ id: Number, name: String });
    const User = sigil(
      { id: Number, name: String },
      {
        name: 'User',
        version: '1.0.0',
        description: 'Application user contract',
        tags: ['api', 'public'],
      },
    );

    const valid = { id: 1, name: 'Ada' };
    const invalid = { id: '1', name: 'Ada' };

    expect(User.check(valid)).toBe(true);
    expect(User.check(invalid)).toBe(false);
    expect(User.check(valid)).toBe(PlainUser.check(valid));
    expect(User.check(invalid)).toBe(PlainUser.check(invalid));
  });

  test('sigil.exact() accepts optional metadata', () => {
    const User = sigil.exact(
      { id: Number, name: String },
      {
        name: 'User',
        version: '1.0.0',
      },
    );

    expect(User.describe()).toEqual({
      kind: 'object',
      exact: true,
      properties: [
        { key: 'id', required: true, contract: { kind: 'number' } },
        { key: 'name', required: true, contract: { kind: 'string' } },
      ],
      metadata: {
        name: 'User',
        version: '1.0.0',
      },
    });
    expect(User.check({ id: 1, name: 'Ada', extra: true })).toBe(false);
  });

  test('Sigil.meta() attaches metadata to template contracts', () => {
    const User = Sigil.meta({
      name: 'User',
      version: '1.0.0',
    })`{
      id: string
      name: string
    }`;

    expect(User.describe()).toEqual({
      kind: 'object',
      exact: false,
      properties: [
        { key: 'id', required: true, contract: { kind: 'string' } },
        { key: 'name', required: true, contract: { kind: 'string' } },
      ],
      metadata: {
        name: 'User',
        version: '1.0.0',
      },
    });
    expect(User.check({ id: 'u1', name: 'Ada' })).toBe(true);
  });

  test('metadata is preserved through relevant projections', () => {
    const User = sigil(
      { id: Number, name: String },
      {
        name: 'User',
        version: '1.0.0',
        description: 'Application user contract',
        tags: ['api', 'public'],
      },
    );

    expect(User.toJSONSchema()).toEqual({
      title: 'User',
      description: 'Application user contract',
      'x-version': '1.0.0',
      'x-tags': ['api', 'public'],
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
      },
      required: ['id', 'name'],
    });
    expect(User.toOpenAPI()).toEqual(User.toJSONSchema());
    expect(User.toTypeScript('User')).toBe(`/**
 * Application user contract
 * @version 1.0.0
 * @tags api, public
 */
type User = {
  id: number
  name: string
}`);
  });

  test('version() attaches metadata-only contract versions', () => {
    const UserV1 = sigil({ id: Number, name: String })
      .withMetadata({ name: 'User' })
      .version('1.0.0');
    const UserV2 = UserV1.version('1.1.0');

    const valid = { id: 1, name: 'Ada' };

    expect(UserV1.check(valid)).toBe(true);
    expect(UserV2.check(valid)).toBe(true);
    expect(UserV1.describe().metadata).toEqual({
      name: 'User',
      version: '1.0.0',
    });
    expect(UserV2.describe().metadata).toEqual({
      name: 'User',
      version: '1.1.0',
    });
    expect(UserV2.toJSONSchema()['x-version']).toBe('1.1.0');
    expect(UserV2.toOpenAPI()['x-version']).toBe('1.1.0');
    expect(UserV2.diff(UserV1)).toEqual([
      {
        kind: 'metadata.version_changed',
        path: ['metadata', 'version'],
        from: '1.0.0',
        to: '1.1.0',
        impact: 'unknown',
      },
    ]);
  });

  test('diff() reports metadata changes as lifecycle entries', () => {
    const UserV1 = sigil(
      { id: Number, name: String },
      {
        name: 'User',
        version: '1.0.0',
        tags: ['api'],
      },
    );
    const UserV2 = sigil(
      { id: Number, name: String },
      {
        name: 'User',
        version: '1.1.0',
        description: 'Application user contract',
        tags: ['api', 'public'],
      },
    );

    expect(UserV2.diff(UserV1)).toEqual([
      {
        kind: 'metadata.version_changed',
        path: ['metadata', 'version'],
        from: '1.0.0',
        to: '1.1.0',
        impact: 'unknown',
      },
      {
        kind: 'metadata.description_changed',
        path: ['metadata', 'description'],
        from: undefined,
        to: 'Application user contract',
        impact: 'unknown',
      },
      {
        kind: 'metadata.tags_changed',
        path: ['metadata', 'tags'],
        from: ['api'],
        to: ['api', 'public'],
        impact: 'unknown',
      },
    ]);
  });

  test('contracts without metadata still omit metadata from describe()', () => {
    expect(sigil({ id: Number }).describe()).toEqual({
      kind: 'object',
      exact: false,
      properties: [{ key: 'id', required: true, contract: { kind: 'number' } }],
    });
  });
});
