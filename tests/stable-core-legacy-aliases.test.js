import { describe, expect, test } from 'bun:test';
import { Real, real, realType, S, Sigil, T } from '../src/index.js';

describe('stable core — legacy alias policy', () => {
  test('S and T remain legacy aliases of Sigil', () => {
    expect(S).toBe(Sigil);
    expect(T).toBe(Sigil);

    const FromS = S`{ name: string }`;
    const FromT = T`{ age: number }`;

    expect(FromS.check({ name: 'Ada' })).toBe(true);
    expect(FromT.check({ age: 42 })).toBe(true);
  });

  test('real and Real remain legacy aliases of realType', () => {
    expect(real).toBe(realType);
    expect(Real).toBe(realType);

    expect(real('x')).toBe('string');
    expect(Real([1, 2])).toBe('array');
  });
});
