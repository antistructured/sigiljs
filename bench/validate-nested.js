import { Sigil } from '../src/index.js';

const Order = Sigil`
{
  id: number
  user: {
    name: string
  }
  items: {
    sku: string
    qty: number
  }[]
}
`;

const validOrder = {
  id: 99,
  user: { name: 'Dana' },
  items: [{ sku: 'A1', qty: 2 }],
};

const invalidOrder = {
  id: 99,
  user: { name: 'Dana' },
  items: [{ sku: 'A1', qty: 'two' }],
};

function validateManual(order) {
  if (
    order === null ||
    typeof order !== 'object' ||
    typeof order.id !== 'number' ||
    typeof order.user !== 'object' ||
    order.user === null ||
    typeof order.user.name !== 'string' ||
    !Array.isArray(order.items)
  ) {
    return false;
  }

  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    if (
      item === null ||
      typeof item !== 'object' ||
      typeof item.sku !== 'string' ||
      typeof item.qty !== 'number'
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
  bench('Sigil (.validator)', () => Order.validator(data));
  bench('Sigil (.check)', () => Order.check(data));
}

console.log('Early benchmark (local, not scientific)');
runSuite('Valid order', validOrder);
runSuite('Invalid order', invalidOrder);
