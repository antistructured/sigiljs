# Sigils

A **sigil** is a runtime contract written as a compact type expression.

```js
const StringValue = Sigil`string`;
const StringOrNumber = Sigil`string | number`;
const StringList = Sigil`string[]`;
```

Sigils are created with a JavaScript tagged template. They parse once, compile once, and expose stable validation methods.

## Core API

```js
const User = Sigil`{ name: string }`;

User.check({ name: 'Ada' }); // true
User.assert({ name: 'Ada' }); // returns the value
User.validator({ name: 'Ada' }); // true, direct compiled function
User.compile() === User.validator; // true
```

`S` and `T` are aliases for `Sigil`:

```js
import { Sigil, S, T } from 'sigil';

Sigil`string`;
S`string`;
T`string`;
```

## Plain JavaScript object definitions

You can also define contracts with JavaScript objects:

```js
import { sigil, optional, union, oneOf, pipe, trim } from 'sigil';

const User = sigil({
  id: union(String, Number),
  name: String,
  age: optional(Number),
  role: oneOf('admin', 'user'),
});

User.check({ id: 1, name: 'Ada', role: 'admin' }); // true
```

Object definitions produce the same contract object shape as template sigils. They are another Define-pillar front door into the same runtime contract engine.

Native constructor mappings:

```txt
String  → string
Number  → number
Boolean → boolean
BigInt  → bigint
Symbol  → symbol
Array   → array
Object  → object
```

Use `sigil.exact({ ... })` when extra object keys should be rejected.

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

`describe()` returns the stable public contract model used by future projections.

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

Future projections such as TypeScript and OpenAPI should build from this canonical model instead of parser internals. JSON Schema projection is available now:

```js
sigil.exact({ id: Number }).toJSONSchema();
// {
//   type: 'object',
//   properties: { id: { type: 'number' } },
//   required: ['id'],
//   additionalProperties: false
// }
```

## Contract metadata

Use the optional metadata argument when a contract needs a stable name, version, description, or tags for docs, projections, and lifecycle diffs.

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

User.describe().metadata;
// {
//   name: 'User',
//   version: '1.2.0',
//   description: 'Trusted user boundary object.',
//   tags: ['api', 'user']
// }
```

Existing contracts can also attach metadata fluently:

```js
const User = sigil({ id: Number }).withMetadata({
  name: 'User',
  version: '1.2.0',
});
```

When only the contract version changes, `version()` is a shorthand for version metadata:

```js
const UserV1 = sigil({ id: Number, name: String })
  .withMetadata({ name: 'User' })
  .version('1.0.0');

const UserV2 = UserV1.version('1.1.0');
```

This is contract metadata, not package versioning. SigilJS does not create a hosted registry, package registry, remote sync protocol, or migration engine for contract versions. Version strings appear in `describe()`, JSON Schema/OpenAPI `x-version`, TypeScript doc comments, and `diff()` lifecycle entries.

Template sigils can use `Sigil.meta()`:

```js
const User = Sigil.meta({ name: 'User', version: '1.2.0' })`
{
  id: string
  name: string
}
`;
```

Metadata is optional and does not change validation behavior. Existing contracts work without it. JSON Schema and OpenAPI projections include `title`, `description`, `x-version`, and `x-tags` where present. TypeScript projection emits a doc comment when description, version, or tags are present. `diff()` reports name, version, description, and tag changes as `metadata.*_changed` lifecycle entries.

## Primitive types

SigilJS supports common runtime types:

```js
Sigil`string`;
Sigil`number`; // rejects NaN
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

```js
const Status = Sigil`"draft" | "published" | "archived"`;

Status.check('draft'); // true
Status.check('deleted'); // false
```

String, number, boolean, and `null` literals are supported.

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
