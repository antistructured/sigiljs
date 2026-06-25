import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const User = sigil.exact({
  id: Number,
  name: String,
  age: optional(Number),
  role: oneOf('admin', 'user'),
});

const sample = User.mock();

console.log('Mock user:', JSON.stringify(sample, null, 2));
