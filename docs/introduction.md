# Introduction

SigilJS is an executable data contract system for JavaScript.

A sigil is not a schema. It is a contract object: one runtime artifact that can validate, transform, describe, and project data across system boundaries.

```js
import { Sigil } from '@weipertda/sigiljs';

const User = Sigil`
{
  name: string
  age?: number
}
`;

User.check({ name: 'Dana' }); // true
User.check({ name: 'Dana', age: 'old' }); // false
```

Think of a sigil as an executable contract for data that exists while your program is actually running.

## Why executable data contracts?

JavaScript programs constantly receive unknown data:

- API requests and responses
- form submissions
- webhooks
- config files
- database rows
- queue messages
- browser storage
- plugin inputs
- AI structured outputs

TypeScript helps while you write code, but its types disappear at runtime. `typeof` also has sharp edges:

```js
typeof []; // "object"
typeof null; // "object"
```

SigilJS gives you a small contract object that can sit at the edge of your app and turn unknown data into trusted runtime data.

## What SigilJS is good for

- Defining executable contracts in readable syntax
- Enforcing system boundaries with `parse`, `safeParse`, and `assert`
- Transforming data safely after enforcement
- Describing contract objects for tooling
- Projecting contracts into JSON Schema, TypeScript, OpenAPI, forms, tests, and lifecycle diffs
- Reusing small named runtime contracts across a codebase

## What it is not

SigilJS is not a full data modeling framework and it is not trying to replace every feature in large validation libraries. It focuses on small executable data contracts that can be defined once and projected everywhere.

Next: [Quickstart](quickstart.md).
