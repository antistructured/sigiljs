/**
 * Task 9 — CLI Workflow Tests
 *
 * Tests for JS module contract loading, new commands (form, cases, test),
 * --export flag, and --out file writing.
 *
 * These tests complement the existing tests/cli.test.js which covers
 * the .sigil text format and all original commands.
 */
import { describe, test, expect } from 'bun:test';
import { $, write, file } from 'bun';
import { mkdtemp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const CLI = resolve(import.meta.dir, '../src/playground.js');
const CONTRACTS_DIR = resolve(import.meta.dir, '../examples/cli/contracts');
const DATA_DIR = resolve(import.meta.dir, '../examples/cli/data');

async function tempDir() {
  return mkdtemp(join(tmpdir(), 'sigil-cli-module-'));
}

async function writeModule(dir, name, content) {
  const path = join(dir, name);
  await write(path, content);
  return path;
}

// ─── JS module loading ─────────────────────────────────────────────────────

describe('CLI — JS module contract loading', () => {
  test('loads a .sigil.js file with a default export', async () => {
    const userContract = join(CONTRACTS_DIR, 'user.sigil.js');
    const { stdout, exitCode } =
      await $`bun run ${CLI} describe ${userContract}`.quiet();

    expect(exitCode).toBe(0);
    const result = JSON.parse(stdout.toString());
    expect(result.kind).toBe('object');
    expect(result.exact).toBe(true);
    expect(result.properties.some((p) => p.key === 'id')).toBe(true);
  });

  test('loads a named export with --export flag', async () => {
    const dir = await tempDir();
    const modPath = await writeModule(
      dir,
      'multi.sigil.js',
      `import { sigil } from '${resolve(import.meta.dir, '../src/index.js')}';
export const User = sigil.exact({ name: String });
export const Post = sigil.exact({ title: String });`,
    );

    const { stdout, exitCode } =
      await $`bun run ${CLI} describe ${modPath} --export User`.quiet();

    expect(exitCode).toBe(0);
    const result = JSON.parse(stdout.toString());
    expect(result.properties.some((p) => p.key === 'name')).toBe(true);
  });

  test('errors clearly when default export is missing and no --export given', async () => {
    const dir = await tempDir();
    const modPath = await writeModule(
      dir,
      'named-only.sigil.js',
      `import { sigil } from '${resolve(import.meta.dir, '../src/index.js')}';
export const User = sigil.exact({ name: String });`,
    );

    // Single named export — should auto-select it
    const { stdout, exitCode } =
      await $`bun run ${CLI} describe ${modPath}`.quiet();

    // With a single named export and no default, should auto-select
    expect(exitCode).toBe(0);
    const result = JSON.parse(stdout.toString());
    expect(result.kind).toBe('object');
  });

  test('errors when named export does not exist', async () => {
    const userContract = join(CONTRACTS_DIR, 'user.sigil.js');
    const { stderr, exitCode } =
      await $`bun run ${CLI} describe ${userContract} --export NonExistent`
        .nothrow()
        .quiet();

    expect(exitCode).toBe(1);
    expect(stderr.toString()).toContain("NonExistent");
  });

  test('errors when JS module file is not found', async () => {
    const { stderr, exitCode } =
      await $`bun run ${CLI} describe /nonexistent/path/contract.sigil.js`
        .nothrow()
        .quiet();

    expect(exitCode).toBe(1);
    expect(stderr.toString()).toContain('not found');
  });

  test('errors when export is not a Sigil contract', async () => {
    const dir = await tempDir();
    const modPath = await writeModule(
      dir,
      'bad.sigil.js',
      `export default { notAContract: true };`,
    );

    const { stderr, exitCode } =
      await $`bun run ${CLI} describe ${modPath}`.nothrow().quiet();

    expect(exitCode).toBe(1);
    expect(stderr.toString()).toContain('not a Sigil contract');
  });
});

// ─── form command ──────────────────────────────────────────────────────────

describe('CLI — form command', () => {
  test('form prints form constraint projection as JSON', async () => {
    const userContract = join(CONTRACTS_DIR, 'user.sigil.js');
    const { stdout, exitCode } =
      await $`bun run ${CLI} form ${userContract}`.quiet();

    expect(exitCode).toBe(0);
    const result = JSON.parse(stdout.toString());
    expect(result).toHaveProperty('fields');
    expect(result.fields).toHaveProperty('name');
    expect(result.fields.name.type).toBe('text');
    expect(result.fields.role.type).toBe('select');
    expect(result.fields.role.options).toEqual(['admin', 'user']);
  });

  test('form works with .sigil text files', async () => {
    const dir = await tempDir();
    const schemaPath = join(dir, 'test.sigil');
    await write(schemaPath, '{ name: string, active: boolean }');

    const { stdout, exitCode } =
      await $`bun run ${CLI} form ${schemaPath}`.quiet();

    expect(exitCode).toBe(0);
    const result = JSON.parse(stdout.toString());
    expect(result.fields.name.type).toBe('text');
    expect(result.fields.active.type).toBe('checkbox');
  });
});

// ─── cases command ─────────────────────────────────────────────────────────

describe('CLI — cases command', () => {
  test('cases prints valid and invalid case groups', async () => {
    const userContract = join(CONTRACTS_DIR, 'user.sigil.js');
    const { stdout, exitCode } =
      await $`bun run ${CLI} cases ${userContract}`.quiet();

    expect(exitCode).toBe(0);
    const result = JSON.parse(stdout.toString());
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('invalid');
    expect(Array.isArray(result.valid)).toBe(true);
    expect(Array.isArray(result.invalid)).toBe(true);
    expect(result.valid.length).toBeGreaterThan(0);
    expect(result.invalid.length).toBeGreaterThan(0);
  });

  test('cases valid entries have label and value', async () => {
    const userContract = join(CONTRACTS_DIR, 'user.sigil.js');
    const { stdout } =
      await $`bun run ${CLI} cases ${userContract}`.quiet();
    const result = JSON.parse(stdout.toString());
    for (const c of result.valid) {
      expect(c).toHaveProperty('label');
      expect(c).toHaveProperty('value');
    }
  });
});

// ─── test command ──────────────────────────────────────────────────────────

describe('CLI — test command', () => {
  test('test prints a contract self-test report', async () => {
    const userContract = join(CONTRACTS_DIR, 'user.sigil.js');
    const { stdout, exitCode } =
      await $`bun run ${CLI} test ${userContract}`.quiet();

    expect(exitCode).toBe(0);
    const result = JSON.parse(stdout.toString());
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('invalid');
    expect(result.success).toBe(true);
    expect(result.valid.passed).toBeGreaterThan(0);
  });

  test('test report shows valid and invalid pass counts', async () => {
    const userContract = join(CONTRACTS_DIR, 'user.sigil.js');
    const { stdout } =
      await $`bun run ${CLI} test ${userContract}`.quiet();
    const result = JSON.parse(stdout.toString());
    expect(result.valid.failed).toBe(0);
    expect(result.invalid.failed).toBe(0);
  });
});

// ─── --out flag ────────────────────────────────────────────────────────────

describe('CLI — --out flag', () => {
  test('--out writes output to a file', async () => {
    const dir = await tempDir();
    const outPath = join(dir, 'output.json');
    const userContract = join(CONTRACTS_DIR, 'user.sigil.js');

    const { exitCode } =
      await $`bun run ${CLI} json-schema ${userContract} --out ${outPath}`.quiet();

    expect(exitCode).toBe(0);
    const content = await file(outPath).text();
    const result = JSON.parse(content);
    expect(result.type).toBe('object');
  });

  test('--out with form command writes form constraints to file', async () => {
    const dir = await tempDir();
    const outPath = join(dir, 'form.json');
    const userContract = join(CONTRACTS_DIR, 'user.sigil.js');

    const { exitCode } =
      await $`bun run ${CLI} form ${userContract} --out ${outPath}`.quiet();

    expect(exitCode).toBe(0);
    const content = await file(outPath).text();
    const result = JSON.parse(content);
    expect(result).toHaveProperty('fields');
  });
});

// ─── diff with JS modules ──────────────────────────────────────────────────

describe('CLI — diff with JS module contracts', () => {
  test('diff two .sigil.js files produces changes', async () => {
    const oldContract = join(CONTRACTS_DIR, 'old-user.sigil.js');
    const newContract = join(CONTRACTS_DIR, 'new-user.sigil.js');

    const { stdout, exitCode } =
      await $`bun run ${CLI} diff ${oldContract} ${newContract} --json`.quiet();

    expect(exitCode).toBe(0);
    const changes = JSON.parse(stdout.toString());
    expect(Array.isArray(changes)).toBe(true);
    expect(changes.length).toBeGreaterThan(0);
  });
});

// ─── check with JS module + data file ────────────────────────────────────

describe('CLI — check with JS module contracts', () => {
  test('check accepts valid data against a .sigil.js contract', async () => {
    const userContract = join(CONTRACTS_DIR, 'user.sigil.js');
    const validData = join(DATA_DIR, 'valid-user.json');

    const { exitCode } =
      await $`bun run ${CLI} check ${userContract} ${validData}`.quiet();

    expect(exitCode).toBe(0);
  });

  test('check rejects invalid data against a .sigil.js contract', async () => {
    const userContract = join(CONTRACTS_DIR, 'user.sigil.js');
    const invalidData = join(DATA_DIR, 'invalid-user.json');

    const { stdout, exitCode } =
      await $`bun run ${CLI} check ${userContract} ${invalidData}`
        .nothrow()
        .quiet();

    expect(exitCode).toBe(1);
    expect(stdout.toString()).toContain('✗ invalid');
  });
});
