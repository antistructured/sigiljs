export function runContractTests(contract, casesInput) {
  const report = {
    success: true,
    valid: {
      passed: 0,
      failed: 0,
    },
    invalid: {
      passed: 0,
      failed: 0,
    },
    failures: [],
  };

  const cases =
    typeof casesInput === 'undefined' ? contract.cases() : casesInput;

  for (const item of cases.valid ?? []) {
    if (typeof item.value === 'undefined') continue;
    if (!contract.check(item.value)) {
      report.success = false;
      report.valid.failed += 1;
      report.failures.push({
        kind: 'valid',
        label: item.label,
        value: item.value,
      });
      continue;
    }

    report.valid.passed += 1;
  }

  for (const item of cases.invalid ?? []) {
    if (typeof item.value === 'undefined') continue;
    if (contract.check(item.value)) {
      report.success = false;
      report.invalid.failed += 1;
      report.failures.push({
        kind: 'invalid',
        label: item.label,
        value: item.value,
      });
      continue;
    }

    report.invalid.passed += 1;
  }

  return report;
}
