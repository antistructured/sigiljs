import { sigil, optional, oneOf, union } from '@weipertda/sigiljs';

const User = sigil.exact({
  id: union(String, Number),
  name: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});

console.log(User.toTypeScript('User'));
console.log(JSON.stringify(User.toJSONSchema(), null, 2));
console.log(JSON.stringify(User.toOpenAPI(), null, 2));
