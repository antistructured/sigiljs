# Introduction

SigilJS is a tiny JavaScript library for checking data at runtime.

You write a **sigil** — a readable type expression — and SigilJS turns it into a fast validator function.

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

Think of a sigil as a **blueprint for data**. It describes what a value should look like when your program is actually running.

## Why runtime checks?

JavaScript programs constantly receive unknown data:

- API responses
- form submissions
- webhooks
- config files
- database rows
- messages from queues

TypeScript helps while you write code, but its types disappear at runtime. `typeof` also has sharp edges:

```js
typeof []; // "object"
typeof null; // "object"
```

SigilJS gives you a small runtime contract that can sit at the edge of your app.

## What SigilJS is good for

- Validating JSON payloads
- Checking API boundaries
- Protecting config loading
- Documenting expected data shapes inline
- Reusing small named runtime contracts across a codebase

## What it is not

SigilJS is not a full data modeling framework. It does not aim to replace every feature in large validation libraries. It focuses on readable type expressions, fast checks, and a small API.

Next: [Quickstart](quickstart.md).
