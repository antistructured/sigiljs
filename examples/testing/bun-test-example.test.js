import { expect, test } from 'bun:test';
import { oneOf, sigil } from '@weipertda/sigiljs';

const User = sigil.exact({
  id: Number,
  name: String,
  role: oneOf('admin', 'user'),
});

test('generated user samples match contract', () => {
  const cases = User.cases();

  for (const item of cases.valid) {
    expect(User.check(item.value)).toBe(true);
  }

  for (const item of cases.invalid) {
    expect(User.check(item.value)).toBe(false);
  }
});

test('contract.test() reports generated cases as passing', () => {
  const report = User.test();

  expect(report.success).toBe(true);
  expect(report.valid.failed).toBe(0);
  expect(report.invalid.failed).toBe(0);
});
