# Quickstart

## Install

```bash
npm install @weipertda/sigiljs
```

or:

```bash
bun add @weipertda/sigiljs
```

## Your first contract

A sigil is an executable contract object. Define structure once, then use it to turn unknown runtime data into trusted data at a boundary.

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const User = sigil.exact({
  id: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});

// Validate unknown data
const result = User.safeParse(unknownInput);

if (result.success) {
  console.log(result.data.role); // 'admin' | 'user' — verified
} else {
  console.error(result.error.message);
  console.error(result.error.path); // ['role'] — path to the failing field
}
```

## Boolean checks

Use `check()` when you only need true or false:

```js
User.check(data); // boolean
```

## Throwing checks

Use `parse()` when you want to throw on invalid data:

```js
try {
  const trusted = User.parse(unknownInput);
} catch (error) {
  console.log(error.message); // Expected property "role" to be "admin" | "user", got superuser
  console.log(error.path);    // ['role']
}
```

## Projection

Project the contract into JSON Schema, TypeScript, or OpenAPI:

```js
User.toJSONSchema();
User.toTypeScript('User');
User.toOpenAPI();
```

## Mock data

Generate a valid sample fixture:

```js
const sample = User.mock({ seed: 1 });
// { id: 'string', email: 'string', role: 'admin' }

// The fixture is always valid
User.parse(sample); // no throw
```

## CLI

Validate a JSON file from the terminal:

```bash
sigil check contracts/user.sigil data/user.json
```

From this repository before installing:

```bash
bun run src/playground.js check examples/workflows/cli-check-api-response/contract.sigil examples/workflows/cli-check-api-response/valid.json
```

---

Next: [Sigils](sigils.md) · [Public API](api.md) · [Stability Map](stability.md)
