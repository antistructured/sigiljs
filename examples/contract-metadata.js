import { sigil } from '../src/index.js';

const User = sigil(
  {
    id: Number,
    name: String,
  },
  {
    name: 'User',
    version: '1.2.0',
    description: 'Trusted user boundary object.',
    tags: ['api', 'user'],
  },
);

const NextUser = User.version('1.3.0');

console.log('Description:');
console.log(JSON.stringify(User.describe(), null, 2));

console.log('\nJSON Schema:');
console.log(JSON.stringify(User.toJSONSchema(), null, 2));

console.log('\nTypeScript:');
console.log(User.toTypeScript('User'));

console.log('\nVersion diff:');
console.log(JSON.stringify(NextUser.diff(User), null, 2));
