import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const User = sigil.exact({
  id: Number,
  name: String,
  age: optional(Number),
  role: oneOf('admin', 'user'),
});

const cases = User.cases();

console.log('Valid cases:');
for (const item of cases.valid) {
  console.log(`- ${item.label}:`, JSON.stringify(item.value));
}

console.log('\nInvalid cases:');
for (const item of cases.invalid) {
  console.log(`- ${item.label}:`, JSON.stringify(item.value));
}
