import { describe, test, expect } from 'bun:test';
import { $, write, file } from 'bun';
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

async function fixtureFiles(schema, data) {
  const dir = await mkdtemp(join(tmpdir(), 'sigil-cli-'));
  const schemaPath = join(dir, 'user.sigil');
  const dataPath = join(dir, 'user.json');
  await write(schemaPath, schema);
  await write(dataPath, JSON.stringify(data));
  return { schemaPath, dataPath };
}

describe('Phase 14 CLI foundation', () => {
  test('check validates a JSON file against a .sigil schema file', async () => {
    const { schemaPath, dataPath } = await fixtureFiles(
      '{ id: number, name: string }',
      { id: 1, name: 'Dana' },
    );

    const { stdout, exitCode } =
      await $`bun run src/playground.js check ${schemaPath} ${dataPath}`.quiet();

    expect(exitCode).toBe(0);
    expect(stdout.toString()).toContain('Result: valid');
  });

  test('check exits non-zero with diagnostics for invalid data', async () => {
    const { schemaPath, dataPath } = await fixtureFiles('{ age: number }', {
      age: 'old',
    });

    const { stdout, exitCode } =
      await $`bun run src/playground.js check ${schemaPath} ${dataPath}`
        .nothrow()
        .quiet();

    const out = stdout.toString();
    expect(exitCode).toBe(1);
    expect(out).toContain('Result: invalid');
    expect(out).toContain('Path: age');
    expect(out).toContain('Expected: number');
    expect(out).toContain('Actual: string');
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

  test('types prints TypeScript from the schema filename', async () => {
    const { schemaPath } = await fixtureFiles('{ id: number }', { id: 1 });

    const { stdout, exitCode } =
      await $`bun run src/playground.js types ${schemaPath}`.quiet();

    expect(exitCode).toBe(0);
    expect(stdout.toString()).toBe('type User = {\n  id: number\n}\n');
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

  test('bin command points at the Bun-native CLI', async () => {
    const { schemaPath } = await fixtureFiles('string', 'value');
    const packageJson = await file('package.json').json();

    expect(packageJson.bin.sigil).toBe('./src/playground.js');

    const { stdout } =
      await $`bun run ${packageJson.bin.sigil} mock ${schemaPath}`.quiet();
    expect(JSON.parse(stdout.toString())).toBe('string');
  });
});
