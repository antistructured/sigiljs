# Quickstart

## Install

```bash
bun add @weipertda/sigiljs
```

or:

```bash
npm install @weipertda/sigiljs
```

## Your first sigil

```js
import { Sigil } from '@weipertda/sigiljs';

const Name = Sigil`string`;

Name.check('Dana'); // true
Name.check(42); // false
```

## Objects

Template syntax:

```js
const User = Sigil`
{
  name: string
  age?: number
  tags: string[]
}
`;
```

Plain JavaScript syntax:

```js
import { sigil, optional } from '@weipertda/sigiljs';

const User = sigil({
  name: String,
  age: optional(Number),
  tags: Array,
});

User.check({
  name: 'Dana',
  tags: ['admin', 'editor'],
}); // true
```

`?` marks an optional property in template syntax. `optional()` marks an optional property in object syntax. `[]` marks an array in template syntax; `Array` maps to the runtime array contract in object syntax.

## Boolean checks vs diagnostics

Use `.check(value)` when you only need true or false:

```js
User.check(data);
```

Use `.assert(value)` when you want useful failure details:

```js
try {
  User.assert({ name: 'Dana', age: 'old', tags: [] });
} catch (error) {
  console.log(error.message); // Expected property "age" to be number, got string
  console.log(error.path); // ['age']
  console.log(error.expected); // number
  console.log(error.actual); // string
}
```

## CLI smoke test

```bash
bun run src/playground.js '{"name":"D"}' '{ name: string }'
```

Output:

```text
Sigil: { name: string }
Value: { "name": "D" }
Result: valid
```

Next: [Sigils](sigils.md).
