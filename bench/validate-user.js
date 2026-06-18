import { Sigil } from '../src/index.js';

const User = Sigil`
{
  name: string
  age?: number
  email: string
  active: boolean
}
`;

const validUser = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  active: true,
};

const invalidUser = {
  name: 'Alice',
  age: 'thirty',
  email: 'alice@example.com',
  active: true,
};

function validateManual(user) {
  return (
    user !== null &&
    typeof user === 'object' &&
    typeof user.name === 'string' &&
    (user.age === undefined || typeof user.age === 'number') &&
    typeof user.email === 'string' &&
    typeof user.active === 'boolean'
  );
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

  const suites = [
    { name: 'Manual JS', fn: () => validateManual(data) },
    { name: 'Sigil (.validator)', fn: () => User.validator(data) },
    { name: 'Sigil (.check)', fn: () => User.check(data) },
  ];

  for (const suite of suites) {
    bench(suite.name, suite.fn);
  }
}

console.log('Early benchmark (local, not scientific)');
runSuite('Valid user', validUser);
runSuite('Invalid user', invalidUser);
