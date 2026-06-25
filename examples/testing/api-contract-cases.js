import { oneOf, pipe, sigil, trim } from '@weipertda/sigiljs';

const ApiResponse = sigil({
  id: String,
  status: oneOf('ok', 'error'),
  message: pipe(String, trim()),
});

const validSample = ApiResponse.mock();
console.log('Valid API response sample:', JSON.stringify(validSample, null, 2));

const cases = ApiResponse.cases();

console.log('\nValid API response cases:');
for (const item of cases.valid) {
  console.log(`- ${item.label}:`, JSON.stringify(item.value));
}

console.log('\nInvalid API response cases:');
for (const item of cases.invalid) {
  console.log(`- ${item.label}:`, JSON.stringify(item.value));
}

const report = ApiResponse.test();
console.log('\nAPI response contract report:', JSON.stringify(report, null, 2));
