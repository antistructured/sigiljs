import { describe, it, expect } from 'bun:test';
import { $ } from 'bun';

describe('CLI Playground', () => {
  it('validates matching data with clear output', async () => {
    const { stdout, exitCode } =
      await $`bun run src/playground.js '{"name": "D"}' '{ name: string }'`.quiet();

    const out = stdout.toString();
    expect(exitCode).toBe(0);
    expect(out).toContain('Sigil: { name: string }');
    expect(out).toContain('Value: { "name": "D" }');
    expect(out).toContain('Result: valid');
  });

  it('fails on mismatched data with assert diagnostics', async () => {
    const { stdout, exitCode } =
      await $`bun run src/playground.js '{"age": "old"}' '{ age: number }'`
        .nothrow()
        .quiet();

    const out = stdout.toString();
    expect(exitCode).toBe(1);
    expect(out).toContain('Result: invalid');
    expect(out).toContain('Path: age');
    expect(out).toContain('Expected: number');
    expect(out).toContain('Actual: string');
  });

  it('keeps the legacy nested playground path working', async () => {
    const { stdout, exitCode } =
      await $`bun run src/playground/playground.js '{"name": "D"}' '{ name: string }'`.quiet();

    expect(exitCode).toBe(0);
    expect(stdout.toString()).toContain('Result: valid');
  });

  it('fails on invalid JSON', async () => {
    const { stderr, exitCode } =
      await $`bun run src/playground.js '{"name":}' '{ name: string }'`
        .nothrow()
        .quiet();

    expect(exitCode).toBe(1);
    expect(stderr.toString()).toContain('Invalid JSON');
  });
});
