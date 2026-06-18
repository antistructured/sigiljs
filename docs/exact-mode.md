# Exact Mode

Normal SigilJS object checks allow extra keys.

```js
const User = Sigil`{ name: string }`;

User.check({ name: 'Dana', admin: true }); // true
```

This is useful for API responses where you only care about a few fields.

Use `Sigil.exact` when the object must match the blueprint exactly:

```js
const User = Sigil.exact`{ name: string }`;

User.check({ name: 'Dana' }); // true
User.check({ name: 'Dana', admin: true }); // false
```

## Nested objects

Exact mode also applies to nested object expressions inside the same sigil.

```js
const Order = Sigil.exact`
{
  id: string
  customer: {
    name: string
  }
}
`;

Order.check({
  id: 'order_1',
  customer: {
    name: 'Dana',
    email: 'dana@example.com',
  },
}); // false
```

## Diagnostics

`.assert()` reports the unexpected key:

```js
try {
  User.assert({ name: 'Dana', admin: true });
} catch (error) {
  console.log(error.path); // ['admin']
  console.log(error.message); // Unexpected property "admin"
}
```

Use exact mode at strict boundaries: config files, command payloads, generated data, or tests where accidental extra fields should fail fast.
