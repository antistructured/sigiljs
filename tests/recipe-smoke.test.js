/**
 * Task 11 — Recipe Smoke Tests
 *
 * Smoke-tests for all recipe examples. Verifies they run without error
 * and produce expected output shapes.
 * No external services. No network calls. Deterministic.
 */
import { describe, test, expect } from 'bun:test';
import { $, file } from 'bun';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dir, '..');
const recipe = (name) => resolve(ROOT, `examples/recipes/${name}`);

// ─── API Route Recipe ──────────────────────────────────────────────────────

describe('Recipe — API Route', () => {
  test('valid request returns status 201', async () => {
    const { stdout, exitCode } = await $`bun run ${recipe('api-route.js')}`.quiet();
    expect(exitCode).toBe(0);
    expect(stdout.toString()).toContain('201');
    expect(stdout.toString()).toContain('alex@example.com');
  });

  test('invalid role returns status 400', async () => {
    const { stdout } = await $`bun run ${recipe('api-route.js')}`.quiet();
    expect(stdout.toString()).toContain('400');
    expect(stdout.toString()).toContain('role');
  });

  test('produces JSON Schema with required fields', async () => {
    const { stdout } = await $`bun run ${recipe('api-route.js')}`.quiet();
    expect(stdout.toString()).toContain('required fields');
  });

  test('mock fixture parses successfully', async () => {
    const { stdout } = await $`bun run ${recipe('api-route.js')}`.quiet();
    expect(stdout.toString()).toContain('Fixture parses: true');
  });
});

// ─── LLM Output Recipe ────────────────────────────────────────────────────

describe('Recipe — LLM Output', () => {
  test('well-formed output validates successfully', async () => {
    const { stdout, exitCode } = await $`bun run ${recipe('llm-output.js')}`.quiet();
    expect(exitCode).toBe(0);
    expect(stdout.toString()).toContain('Well-formed output valid: true');
  });

  test('invalid urgency is caught', async () => {
    const { stdout } = await $`bun run ${recipe('llm-output.js')}`.quiet();
    expect(stdout.toString()).toContain('Bad urgency valid: false');
    expect(stdout.toString()).toContain('urgency');
  });

  test('missing field is caught', async () => {
    const { stdout } = await $`bun run ${recipe('llm-output.js')}`.quiet();
    expect(stdout.toString()).toContain('Incomplete output valid: false');
  });

  test('contract proof passes', async () => {
    const { stdout } = await $`bun run ${recipe('llm-output.js')}`.quiet();
    expect(stdout.toString()).toContain("Contract proof: passed");
  });
});

// ─── Form Submission Recipe ───────────────────────────────────────────────

describe('Recipe — Form Submission', () => {
  test('valid form submission is accepted', async () => {
    const { stdout, exitCode } = await $`bun run ${recipe('form-submission.js')}`.quiet();
    expect(exitCode).toBe(0);
    expect(stdout.toString()).toContain('Valid submission: true');
  });

  test('missing email is caught', async () => {
    const { stdout } = await $`bun run ${recipe('form-submission.js')}`.quiet();
    expect(stdout.toString()).toContain('Missing email: false');
    expect(stdout.toString()).toContain('email');
  });

  test('invalid plan is caught', async () => {
    const { stdout } = await $`bun run ${recipe('form-submission.js')}`.quiet();
    expect(stdout.toString()).toContain('Bad plan: false');
  });

  test('form constraint projection produces fields', async () => {
    const { stdout } = await $`bun run ${recipe('form-submission.js')}`.quiet();
    expect(stdout.toString()).toContain('Form field types:');
    expect(stdout.toString()).toContain('plan: type=select');
  });
});

// ─── Database Persistence Recipe ──────────────────────────────────────────

describe('Recipe — Database Persistence', () => {
  test('read boundary validates a good row', async () => {
    const { stdout, exitCode } = await $`bun run ${recipe('database-persistence.js')}`.quiet();
    expect(exitCode).toBe(0);
    expect(stdout.toString()).toContain('Trusted read:');
  });

  test('invalid row is caught at read boundary', async () => {
    const { stdout } = await $`bun run ${recipe('database-persistence.js')}`.quiet();
    expect(stdout.toString()).toContain('Invalid row accepted: false');
  });

  test('insert boundary catches extra fields', async () => {
    const { stdout } = await $`bun run ${recipe('database-persistence.js')}`.quiet();
    expect(stdout.toString()).toContain('Extra field in insert: false');
  });

  test('contract diff detects changes', async () => {
    const { stdout } = await $`bun run ${recipe('database-persistence.js')}`.quiet();
    expect(stdout.toString()).toContain('Schema changes:');
  });

  test('contract proof passes', async () => {
    const { stdout } = await $`bun run ${recipe('database-persistence.js')}`.quiet();
    expect(stdout.toString()).toContain('Contract proof success: true');
  });
});

// ─── Contract Testing Recipe ──────────────────────────────────────────────

describe('Recipe — Contract Testing', () => {
  test('mock generates a valid fixture', async () => {
    const { stdout, exitCode } = await $`bun run ${recipe('contract-testing.js')}`.quiet();
    expect(exitCode).toBe(0);
    expect(stdout.toString()).toContain('Generated fixture:');
  });

  test('fixture is deterministic', async () => {
    const { stdout } = await $`bun run ${recipe('contract-testing.js')}`.quiet();
    expect(stdout.toString()).toContain('Deterministic: true');
  });

  test('cases generates valid and invalid groups', async () => {
    const { stdout } = await $`bun run ${recipe('contract-testing.js')}`.quiet();
    expect(stdout.toString()).toContain('Generated cases:');
    expect(stdout.toString()).toContain('valid:');
    expect(stdout.toString()).toContain('invalid:');
  });

  test('contract proof report shows success', async () => {
    const { stdout } = await $`bun run ${recipe('contract-testing.js')}`.quiet();
    expect(stdout.toString()).toContain('success: true');
  });
});

// ─── Full Lifecycle Recipe ─────────────────────────────────────────────────

describe('Recipe — Full Lifecycle', () => {
  test('define step outputs contract kind', async () => {
    const { stdout, exitCode } = await $`bun run ${recipe('full-lifecycle.js')}`.quiet();
    expect(exitCode).toBe(0);
    expect(stdout.toString()).toContain('DEFINE — contract: object');
  });

  test('enforce step validates good and bad input', async () => {
    const { stdout } = await $`bun run ${recipe('full-lifecycle.js')}`.quiet();
    expect(stdout.toString()).toContain('ENFORCE — safeParse valid: true');
    expect(stdout.toString()).toContain('Invalid priority caught: true');
  });

  test('transform step normalizes input', async () => {
    const { stdout } = await $`bun run ${recipe('full-lifecycle.js')}`.quiet();
    expect(stdout.toString()).toContain('TRANSFORM — title trimmed:');
  });

  test('project step outputs schema information', async () => {
    const { stdout } = await $`bun run ${recipe('full-lifecycle.js')}`.quiet();
    expect(stdout.toString()).toContain('PROJECT — JSON Schema type: object');
    expect(stdout.toString()).toContain('TypeScript type generated: true');
  });

  test('prove step generates mock and runs proof', async () => {
    const { stdout } = await $`bun run ${recipe('full-lifecycle.js')}`.quiet();
    expect(stdout.toString()).toContain('PROVE — mock fixture:');
    expect(stdout.toString()).toContain('Contract proof success: true');
  });

  test('demonstrates all five pillars', async () => {
    const { stdout } = await $`bun run ${recipe('full-lifecycle.js')}`.quiet();
    expect(stdout.toString()).toContain('All five pillars demonstrated');
  });
});

// ─── CLI Recipe files ──────────────────────────────────────────────────────

describe('Recipe — CLI contract files', () => {
  test('user.sigil.js loads via CLI describe', async () => {
    const contractFile = recipe('cli/user.sigil.js');
    const { stdout, exitCode } =
      await $`bun run ${resolve(ROOT, 'src/playground.js')} describe ${contractFile}`.quiet();
    expect(exitCode).toBe(0);
    const result = JSON.parse(stdout.toString());
    expect(result.kind).toBe('object');
    expect(result.exact).toBe(true);
  });

  test('valid-user.json passes check against user.sigil.js', async () => {
    const contractFile = recipe('cli/user.sigil.js');
    const dataFile = recipe('cli/valid-user.json');
    const { exitCode } =
      await $`bun run ${resolve(ROOT, 'src/playground.js')} check ${contractFile} ${dataFile}`.quiet();
    expect(exitCode).toBe(0);
  });

  test('invalid-user.json fails check against user.sigil.js', async () => {
    const contractFile = recipe('cli/user.sigil.js');
    const dataFile = recipe('cli/invalid-user.json');
    const { exitCode } =
      await $`bun run ${resolve(ROOT, 'src/playground.js')} check ${contractFile} ${dataFile}`.nothrow().quiet();
    expect(exitCode).toBe(1);
  });

  test('diff detects changes between old and new user contracts', async () => {
    const oldFile = recipe('cli/old-user.sigil.js');
    const newFile = recipe('cli/new-user.sigil.js');
    const { stdout, exitCode } =
      await $`bun run ${resolve(ROOT, 'src/playground.js')} diff ${oldFile} ${newFile} --json`.quiet();
    expect(exitCode).toBe(0);
    const changes = JSON.parse(stdout.toString());
    expect(Array.isArray(changes)).toBe(true);
    expect(changes.length).toBeGreaterThan(0);
  });
});
