import { Sigil } from '../src/index.js';

const Items = Sigil`{ id: number, price: number }[]`;

const validItems = [
  { id: 1, price: 10 },
  { id: 2, price: 20 },
];

function validateManual(items) {
  if (!Array.isArray(items)) return false;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (
      item === null ||
      typeof item !== 'object' ||
      typeof item.id !== 'number' ||
      typeof item.price !== 'number'
    ) {
      return false;
    }
  }

  return true;
}

function bench(name, fn, iterations = 100_000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  console.log(`${name}: ${(end - start).toFixed(2)}ms`);
}

function runSuite(title, data) {
  console.log(`\nBenchmark: ${title}`);
  console.log('='.repeat(title.length + 12));

  bench('Manual JS', () => validateManual(data));
  bench('Sigil (.validator)', () => Items.validator(data));
  bench('Sigil (.check)', () => Items.check(data));
}

console.log('Early benchmark (local, not scientific)');
runSuite('Valid items', validItems);
