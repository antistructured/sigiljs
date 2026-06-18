# SigilJS

Define structure once. Project it everywhere.

SigilJS is an executable data contract system for JavaScript. You define a **sigil** — a readable runtime contract — and SigilJS can enforce it, transform through it, and project it into schemas, types, docs, forms, tests, and CLI workflows.

<img src="assets/images/sigiljs-logo-banner-v1.png" alt="SigilJS – Executable Data Contracts in Plain JS" width="100%" height="auto">

```js
import { Sigil } from '@weipertda/sigiljs';

const User = Sigil`
{
  name: string
  age?: number
  tags: string[]
}
`;

User.check({
  name: 'Dana',
  tags: ['admin'],
}); // true

User.check({
  name: 'Dana',
  age: 'old',
  tags: [],
}); // false
```

## Install

```bash
bun add @weipertda/sigiljs
```

or:

```bash
npm install @weipertda/sigiljs
```

## Why SigilJS?

JavaScript applications receive unknown data all the time: API responses, form submissions, config files, webhooks, and database rows.

TypeScript helps while you write code, but those types are gone at runtime. SigilJS gives you one executable contract that can sit at boundaries and project into the artifacts around them.

- Define: readable template syntax and plain JavaScript object definitions
- Enforce: `.check()`, `.assert()`, `.parse()`, and `.safeParse()` for runtime boundaries
- Transform: safe validate → transform → validate pipelines
- Project: JSON Schema, TypeScript, OpenAPI, forms, testing helpers, and CLI workflows
- Reuse: named sigils and scoped collections
- Zero runtime dependencies

## Core API

```js
import {
  Sigil,
  S,
  T,
  sigil,
  optional,
  union,
  oneOf,
  pipe,
  trim,
  httpContract,
  SigilValidationError,
  realType,
} from '@weipertda/sigiljs';

const Name = Sigil`string`;
const AlsoName = S`string`;
const LegacyAlias = T`string`;
```

### Boolean checks

```js
const ID = Sigil`string | number`;

ID.check('user_123'); // true
ID.check(123); // true
ID.check(false); // false
```

### Plain JavaScript definitions

```js
const User = sigil({
  id: union(String, Number),
  name: String,
  age: optional(Number),
  role: oneOf('admin', 'user'),
});

User.check({ id: 1, name: 'Dana', role: 'admin' }); // true
```

Template syntax and object syntax create the same kind of executable contract object.

### Transform and describe

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

User.describe();
// stable public contract description for projections

User.toOpenAPI();
// OpenAPI-compatible schema for request/response docs

User.toFormConstraints();
// basic form metadata from the same contract

User.mock();
// deterministic valid sample data

User.cases();
// basic valid and invalid contract test cases

UserV2.diff(UserV1);
// detect object contract drift over time
```

### Diagnostics

```js
const User = Sigil`{ age: number }`;

try {
  User.assert({ age: 'old' });
} catch (error) {
  if (error instanceof SigilValidationError) {
    console.log(error.path); // ['age']
    console.log(error.expected); // number
    console.log(error.actual); // string
  }
}
```

### Exact mode

```js
const User = Sigil.exact`{ name: string }`;

User.check({ name: 'Dana' }); // true
User.check({ name: 'Dana', admin: true }); // false
```

### Named sigils

```js
Sigil.define('Email')`string`;

const Login = Sigil`
{
  email: Email
  password: string
}
`;
```

### Collections

```js
const Auth = Sigil.collection({
  Email: Sigil`string`,
  Login: Sigil`
  {
    email: Email
  }
  `,
});

Auth.Login.check({ email: 'a@b.com' }); // true
```

### HTTP boundaries

```js
const LoginHTTP = httpContract({
  request: LoginRequest,
  response: LoginResponse,
});

const request = LoginHTTP.parseRequest(body);
const response = LoginHTTP.serializeResponse(result);
const operation = LoginHTTP.toOpenAPI();
```

`httpContract()` is framework-neutral. Future Express, Fastify, and Hono adapters should wrap it instead of adding framework dependencies to core.

## CLI

SigilJS includes a Bun-native, dependency-free CLI for contract workflows:

```bash
sigil check schema.sigil data.json
sigil describe schema.sigil
sigil json-schema schema.sigil
sigil types schema.sigil
sigil mock schema.sigil
```

From the repository:

```bash
bun run src/playground.js check schema.sigil data.json
```

A future `@sigil/cli` package may split this out later, but the CLI stays in core while the API stabilizes.

## Docs

- [Quickstart](docs/quickstart.md)
- [Sigils](docs/sigils.md)
- [Exact Mode](docs/exact-mode.md)
- [Named Sigils](docs/named-sigils.md)
- [SigilJS vs Zod](docs/sigil-vs-zod.md)
- [JSON Schema Projection](docs/projections/json-schema.md)
- [OpenAPI Projection](docs/projections/openapi.md)
- [Forms Projection](docs/projections/forms.md)
- [AI Structured Output Contracts](docs/projections/ai-structured-output.md)
- [HTTP Boundary Helpers](docs/projections/http.md)
- [Testing Helpers](docs/projections/testing.md)
- [Contract Lifecycle](docs/projections/lifecycle.md)
- [v1 Readiness](docs/v1-readiness.md)
- [Package Split Policy](docs/package-split.md)

More docs:

- [Introduction](docs/introduction.md)
- [realType](docs/realtype.md)
- [Roadmap](docs/roadmap.md)
- [CLI](docs/cli.md)

## SigilJS vs Zod

Zod is a mature, expressive validation library with a builder API and broad ecosystem. SigilJS is a smaller expression-first alternative for teams that want readable runtime contracts and compiled validators.

Read the longer comparison: [SigilJS vs Zod](docs/sigil-vs-zod.md).

## License

MIT
