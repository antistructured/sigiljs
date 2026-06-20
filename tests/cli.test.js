import { describe, test, expect } from 'bun:test';
import { $, write, file } from 'bun';
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

async function fixtureDir() {
  return mkdtemp(join(tmpdir(), 'sigil-cli-'));
}

async function fixtureFiles(schema, data) {
  const dir = await fixtureDir();
  const schemaPath = join(dir, 'user.sigil');
  const dataPath = join(dir, 'user.json');
  await write(schemaPath, schema);
  await write(dataPath, JSON.stringify(data));
  return { schemaPath, dataPath };
}

async function fixtureSchemas(beforeSchema, afterSchema) {
  const dir = await fixtureDir();
  const beforePath = join(dir, 'user-v1.sigil');
  const afterPath = join(dir, 'user-v2.sigil');
  await write(beforePath, beforeSchema);
  await write(afterPath, afterSchema);
  return { beforePath, afterPath };
}

describe('Phase 14 CLI foundation', () => {
  test('prints CLI help with command examples', async () => {
    const { stdout, exitCode } =
      await $`bun run src/playground.js --help`.quiet();

    const out = stdout.toString();
    expect(exitCode).toBe(0);
    expect(out).toContain('SigilJS CLI');
    expect(out).toContain('Usage: sigil <command> <contract-file> [data-file]');
    expect(out).toContain('sigil check contracts/user.sigil data/user.json');
    expect(out).toContain('sigil types contracts/user.sigil User');
  });

  test('check validates a JSON file against a .sigil schema file with human output', async () => {
    const { schemaPath, dataPath } = await fixtureFiles(
      '{ id: number, name: string }',
      { id: 1, name: 'Dana' },
    );

    const { stdout, exitCode } =
      await $`bun run src/playground.js check ${schemaPath} ${dataPath}`.quiet();

    expect(exitCode).toBe(0);
    expect(stdout.toString()).toBe(
      `✓ valid\n\nContract: User\nData: ${dataPath}\n`,
    );
  });

  test('check exits non-zero with human diagnostics for invalid data', async () => {
    const { schemaPath, dataPath } = await fixtureFiles('{ age: number }', {
      age: 'old',
    });

    const { stdout, exitCode } =
      await $`bun run src/playground.js check ${schemaPath} ${dataPath}`
        .nothrow()
        .quiet();

    const out = stdout.toString();
    expect(exitCode).toBe(1);
    expect(out).toContain('✗ invalid');
    expect(out).toContain('Path: age');
    expect(out).toContain('Expected: number');
    expect(out).toContain('Actual: string');
    expect(out).toContain(
      'Message: Expected property "age" to be number, got string',
    );
  });

  test('check supports deterministic JSON output for invalid data', async () => {
    const { schemaPath, dataPath } = await fixtureFiles('{ age: number }', {
      age: 'old',
    });

    const { stdout, exitCode } =
      await $`bun run src/playground.js check ${schemaPath} ${dataPath} --json`
        .nothrow()
        .quiet();

    expect(exitCode).toBe(1);
    expect(JSON.parse(stdout.toString())).toEqual({
      success: false,
      error: {
        code: 'SIGIL_VALIDATION_FAILED',
        path: ['age'],
        expected: 'number',
        actual: 'string',
        message: 'Expected property "age" to be number, got string',
      },
    });
  });

  test('describe prints contract description JSON', async () => {
    const { schemaPath } = await fixtureFiles('{ id: number }', { id: 1 });

    const { stdout, exitCode } =
      await $`bun run src/playground.js describe ${schemaPath}`.quiet();

    expect(exitCode).toBe(0);
    expect(JSON.parse(stdout.toString())).toEqual({
      kind: 'object',
      exact: false,
      properties: [
        {
          key: 'id',
          required: true,
          contract: { kind: 'number' },
        },
      ],
    });
  });

  test('describe reports a helpful error when a .sigil file is missing', async () => {
    const missingPath = join(await fixtureDir(), 'missing.sigil');

    const { stderr, exitCode } =
      await $`bun run src/playground.js describe ${missingPath}`
        .nothrow()
        .quiet();

    expect(exitCode).toBe(1);
    expect(stderr.toString()).toContain(
      `Contract file not found: ${missingPath}`,
    );
  });

  test('describe reports a helpful error when contract parsing fails', async () => {
    const { schemaPath } = await fixtureFiles('{ id: }', { id: 1 });

    const { stderr, exitCode } =
      await $`bun run src/playground.js describe ${schemaPath}`
        .nothrow()
        .quiet();

    expect(exitCode).toBe(1);
    expect(stderr.toString()).toContain(
      `Invalid Sigil contract in ${schemaPath}:`,
    );
  });

  test('check reports a helpful error when a JSON data file is missing', async () => {
    const { schemaPath } = await fixtureFiles('{ id: number }', { id: 1 });
    const missingPath = join(await fixtureDir(), 'missing.json');

    const { stderr, exitCode } =
      await $`bun run src/playground.js check ${schemaPath} ${missingPath}`
        .nothrow()
        .quiet();

    expect(exitCode).toBe(1);
    expect(stderr.toString()).toContain(`Data file not found: ${missingPath}`);
  });

  test('check reports a helpful error when JSON parsing fails', async () => {
    const dir = await fixtureDir();
    const schemaPath = join(dir, 'user.sigil');
    const dataPath = join(dir, 'user.json');
    await write(schemaPath, '{ id: number }');
    await write(dataPath, '{"id":}');

    const { stderr, exitCode } =
      await $`bun run src/playground.js check ${schemaPath} ${dataPath}`
        .nothrow()
        .quiet();

    expect(exitCode).toBe(1);
    expect(stderr.toString()).toContain(`Invalid JSON data in ${dataPath}:`);
  });

  test('json-schema prints JSON Schema projection', async () => {
    const { schemaPath } = await fixtureFiles('{ id: number, name?: string }', {
      id: 1,
    });

    const { stdout, exitCode } =
      await $`bun run src/playground.js json-schema ${schemaPath}`.quiet();

    expect(exitCode).toBe(0);
    expect(JSON.parse(stdout.toString())).toEqual({
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
      },
      required: ['id'],
    });
  });

  test('openapi prints OpenAPI-compatible schema projection', async () => {
    const { schemaPath } = await fixtureFiles('{ id: number, name?: string }', {
      id: 1,
    });

    const { stdout, exitCode } =
      await $`bun run src/playground.js openapi ${schemaPath}`.quiet();

    expect(exitCode).toBe(0);
    expect(JSON.parse(stdout.toString())).toEqual({
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
      },
      required: ['id'],
    });
  });

  test('types prints TypeScript from the schema filename', async () => {
    const { schemaPath } = await fixtureFiles('{ id: number }', { id: 1 });

    const { stdout, exitCode } =
      await $`bun run src/playground.js types ${schemaPath}`.quiet();

    expect(exitCode).toBe(0);
    expect(stdout.toString()).toBe('type User = {\n  id: number\n}\n');
  });

  test('types accepts an explicit TypeScript name', async () => {
    const { schemaPath } = await fixtureFiles('{ id: number }', { id: 1 });

    const { stdout, exitCode } =
      await $`bun run src/playground.js types ${schemaPath} Account`.quiet();

    expect(exitCode).toBe(0);
    expect(stdout.toString()).toBe('type Account = {\n  id: number\n}\n');
  });

  test('parse prints parsed trusted data as JSON', async () => {
    const { schemaPath, dataPath } = await fixtureFiles(
      '{ id: number, name: string }',
      { id: 1, name: 'Dana' },
    );

    const { stdout, exitCode } =
      await $`bun run src/playground.js parse ${schemaPath} ${dataPath}`.quiet();

    expect(exitCode).toBe(0);
    expect(JSON.parse(stdout.toString())).toEqual({ id: 1, name: 'Dana' });
  });

  test('parse exits non-zero with diagnostics for invalid data', async () => {
    const { schemaPath, dataPath } = await fixtureFiles('{ id: number }', {
      id: '1',
    });

    const { stdout, exitCode } =
      await $`bun run src/playground.js parse ${schemaPath} ${dataPath}`
        .nothrow()
        .quiet();

    const out = stdout.toString();
    expect(exitCode).toBe(1);
    expect(out).toContain('✗ invalid');
    expect(out).toContain('Path: id');
    expect(out).toContain('Expected: number');
    expect(out).toContain('Actual: string');
    expect(out).toContain(
      'Message: Expected property "id" to be number, got string',
    );
  });

  test('parse supports deterministic JSON output for invalid data', async () => {
    const { schemaPath, dataPath } = await fixtureFiles('{ id: number }', {
      id: '1',
    });

    const { stdout, exitCode } =
      await $`bun run src/playground.js parse ${schemaPath} ${dataPath} --json`
        .nothrow()
        .quiet();

    expect(exitCode).toBe(1);
    expect(JSON.parse(stdout.toString())).toEqual({
      success: false,
      error: {
        code: 'SIGIL_VALIDATION_FAILED',
        path: ['id'],
        expected: 'number',
        actual: 'string',
        message: 'Expected property "id" to be number, got string',
      },
    });
  });

  test('safe-parse prints success result objects', async () => {
    const { schemaPath, dataPath } = await fixtureFiles('{ id: number }', {
      id: 1,
    });

    const { stdout, exitCode } =
      await $`bun run src/playground.js safe-parse ${schemaPath} ${dataPath}`.quiet();

    expect(exitCode).toBe(0);
    expect(JSON.parse(stdout.toString())).toEqual({
      success: true,
      data: { id: 1 },
    });
  });

  test('safe-parse prints failure result objects', async () => {
    const { schemaPath, dataPath } = await fixtureFiles('{ id: number }', {
      id: '1',
    });

    const { stdout, exitCode } =
      await $`bun run src/playground.js safe-parse ${schemaPath} ${dataPath}`.quiet();

    expect(exitCode).toBe(0);
    expect(JSON.parse(stdout.toString())).toEqual({
      success: false,
      error: {
        code: 'SIGIL_VALIDATION_FAILED',
        message: 'Expected property "id" to be number, got string',
        path: ['id'],
        expected: 'number',
        actual: 'string',
      },
    });
  });

  test('mock prints deterministic valid sample data', async () => {
    const { schemaPath } = await fixtureFiles(
      '{ id: number, name: string, age?: number }',
      { id: 1, name: 'Dana' },
    );

    const { stdout, exitCode } =
      await $`bun run src/playground.js mock ${schemaPath}`.quiet();

    expect(exitCode).toBe(0);
    expect(JSON.parse(stdout.toString())).toEqual({
      id: 1,
      name: 'string',
    });
  });

  test('diff prints readable human contract changes by default', async () => {
    const { beforePath, afterPath } = await fixtureSchemas(
      '{ id: number, name: string, email?: string }',
      '{ id: number, displayName: string, email: string }',
    );

    const { stdout, exitCode } =
      await $`bun run src/playground.js diff ${beforePath} ${afterPath}`.quiet();

    const out = stdout.toString();
    expect(exitCode).toBe(0);
    expect(out).toContain('Contract changes:');
    expect(out).toContain('BREAKING');
    expect(out).toContain('- required property: email');
    expect(out).toContain('- removed property: name');
    expect(out).toContain('NON-BREAKING');
    expect(out).toContain('- added property: displayName');
  });

  test('diff supports deterministic JSON output', async () => {
    const { beforePath, afterPath } = await fixtureSchemas(
      '{ id: number, name: string, email?: string }',
      '{ id: number, displayName: string, email: string }',
    );

    const { stdout, exitCode } =
      await $`bun run src/playground.js diff ${beforePath} ${afterPath} --json`.quiet();

    expect(exitCode).toBe(0);
    expect(JSON.parse(stdout.toString())).toEqual([
      {
        kind: 'property.added',
        path: ['displayName'],
        contract: { kind: 'string' },
        impact: 'non-breaking',
      },
      {
        kind: 'property.required_changed',
        path: ['email'],
        from: false,
        to: true,
        impact: 'breaking',
      },
      {
        kind: 'property.removed',
        path: ['name'],
        contract: { kind: 'string' },
        impact: 'breaking',
      },
    ]);
  });

  test('bin command points at the Bun-native CLI', async () => {
    const { schemaPath } = await fixtureFiles('string', 'value');
    const packageJson = await file('package.json').json();

    expect(packageJson.bin.sigil).toBe('./src/playground.js');

    const { stdout } =
      await $`bun run ${packageJson.bin.sigil} mock ${schemaPath}`.quiet();
    expect(JSON.parse(stdout.toString())).toBe('string');
  });
});
