# Sigils

A **sigil** is a runtime contract written with `sigil()`. Template syntax with `Sigil` is also supported for compact type expressions.

## Primary API: `sigil(definition, metadata?)`

```js
import { sigil, optional, union, oneOf, pipe, trim } from '@weipertda/sigiljs';

const User = sigil({
  id: union(String, Number),
  name: String,
  age: optional(Number),
  role: oneOf('admin', 'user'),
  displayName: pipe(String, trim()),
});

User.check({ id: 1, name: 'Ada', role: 'admin' });   // true
User.assert({ id: 1, name: 'Ada', role: 'admin' });   // returns the value
```

Object definitions produce the same stable contract object shape as template sigils. They are the recommended front door because they use plain JavaScript values and native constructors.

Use `sigil.exact({ ... })` when extra object keys should be rejected.

```js
const ExactUser = sigil.exact({ id: Number, name: String });
ExactUser.check({ id: 1, name: 'Ada', extra: true }); // false
```

### Native constructor mappings

| Constructor | Contract type |
|------|------|
| `String` | `string` |
| `Number` | `number` |
| `Boolean` | `boolean` |
| `BigInt` | `bigint` |
| `Symbol` | `symbol` |
| `Array` | `array` |
| `Object` | `object` |

## Alternative API: `Sigil`\`...\`

```js
import { Sigil } from '@weipertda/sigiljs';

const User = Sigil`
  id: string
  name: string
  age?: number
`;
```

Template syntax parses a compact type expression and creates the same contract object shape as `sigil()`.  
It is supported and stable, but `sigil()` is the preferred API for new code.

### Exactly mode

```js
const ExactUser = Sigil.exact`
  id: string
  name: string
`;
```

## Metadata

Contracts carry optional metadata for descriptions and projections.

```js
const User = sigil(
  { id: Number },
  {
    name: 'User',
    version: '1.2.0',
    description: 'Trusted user boundary object.',
    tags: ['api', 'user'],
  },
);
```

Template contracts can attach metadata with `Sigil.meta()`:

```js
const User = Sigil.meta({ name: 'User', version: '1.2.0' })`
  id: string
  name: string
`;
```

Metadata does not change validation behavior.

## Registry helpers

```js
const Email = Sigil.named('Email')`string`;

const Login = Sigil`
  email: Email
  token: string
`;
```

`Sigil.define('Name')` is an alias for `Sigil.named('Name')`.

```js
const Auth = Sigil.collection({
  Email: Sigil`string`,
  Session: Sigil`
    email: Email
    token: string
  `,
});
```

## Transforms

Transforms normalize valid input into a trusted shape during `parse()`.

```js
const User = sigil({
  id: Number,
  name: pipe(String, trim()),
}).transform((user) => ({
  ...user,
  name: user.name.toUpperCase(),
}));

User.parse({ id: 1, name: '  dana  ' });
// { id: 1, name: 'DANA' }
```

Transform safety is conservative: SigilJS validates input, applies transforms, then validates the transformed output again.

Use `serialize(value)` to validate trusted data before sending it back across a boundary.

## Contract descriptions

`describe()` returns the stable public contract description used by projections.

```js
sigil({ id: Number }).describe();
// {
//   kind: 'object',
//   exact: false,
//   properties: [
//     { key: 'id', required: true, contract: { kind: 'number' } }
//   ]
// }
```

Projections such as JSON Schema, TypeScript, OpenAPI, and `diff()` should build from this canonical model.

```js
sigil.exact({ id: Number }).toJSONSchema();
// {
//   type: 'object',
//   properties: { id: { type: 'number' } },
//   required: ['id'],
//   additionalProperties: false
// }
```

## Primitive types

SigilJS supports common runtime types:

```js
Sigil`string`;
Sigil`number`;  // rejects NaN
Sigil`boolean`;
Sigil`bigint`;
Sigil`symbol`;
Sigil`undefined`;
Sigil`null`;
Sigil`array`;
Sigil`object`;
Sigil`function`;
Sigil`any`;
Sigil`unknown`;
Sigil`never`;
```

## Literals

String, number, boolean, and `null` literals are supported.

```js
const Status = Sigil`"draft" | "published" | "archived"`;

Status.check('draft'); // true
Status.check('deleted'); // false
```

## Unions

Use `|` for alternatives:

```js
const ID = Sigil`string | number`;

ID.check('user_123'); // true
ID.check(123); // true
ID.check(false); // false
```

## Arrays

Use `[]` after any type expression:

```js
Sigil`string[]`;
Sigil`(string | number)[]`;
Sigil`{ id: string }[]`;
```

## Objects

```js
const User = Sigil`
{
  id: string
  name: string
  age?: number
}
`;
```

Object properties can be separated by newlines or commas. Extra properties are allowed by default. Use [Exact Mode](exact-mode.md) when you want to reject extra keys.

## Alias note

`S` and `T` are legacy convenience aliases for `Sigil`. They remain exported for backward compatibility, but new code should prefer `Sigil` or `sigil()` directly.

```js
// Legacy convenience aliases
const A = S`string`;
const B = T`string`;
```

## Blueprint for data

A sigil is easiest to read as a blueprint for data:

```js
const LoginRequest = Sigil`
{
  email: string
  password: string
}
`;
```

That blueprint can be reused anywhere your program accepts unknown input.
