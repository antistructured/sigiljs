# Named Sigils

Named sigils let you reuse a runtime contract by name.

```js
import { Sigil } from 'sigil';

const Email = Sigil.define('Email')`string`;

const User = Sigil`
{
  email: Email
}
`;

User.check({ email: 'dana@example.com' }); // true
User.check({ email: 123 }); // false
```

`Sigil.define(name)` and `Sigil.named(name)` are aliases.

## Composition

Named sigils are useful when several contracts share the same piece.

```js
Sigil.define('Address')`
{
  street: string
  city: string
}
`;

const Customer = Sigil`
{
  name: string
  billing: Address
  shipping: Address
}
`;
```

## Recursive contracts

Names are resolved lazily, so recursive shapes can work.

```js
const Node = Sigil.define('Node')`
{
  name: string
  children?: Node[]
}
`;

Node.check({
  name: 'root',
  children: [{ name: 'src' }],
}); // true
```

## Collections

Use `Sigil.collection()` when you want grouped reusable sigils without adding names to the global registry.

```js
const Auth = Sigil.collection({
  Email: Sigil`string`,
  Password: Sigil`string`,
  LoginRequest: Sigil`
  {
    email: Email
    password: Password
  }
  `,
});

Auth.LoginRequest.check({
  email: 'dana@example.com',
  password: 'secret',
}); // true
```

Collections are good for feature-local vocabularies and avoiding name collisions.

## Registry behavior

Global named sigils use last-write-wins behavior: redefining the same name replaces the previous contract.

For tests, the internal registry can be cleared by importing `clear` from `src/core/registry.js` inside this repository. That helper is not part of the public package API.
