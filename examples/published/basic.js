import { sigil, optional, oneOf } from '@weipertda/sigiljs';

const User = sigil.exact({
  id: Number,
  name: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});

console.log(
  User.safeParse({
    id: 1,
    name: 'D',
    role: 'admin',
  }),
);
