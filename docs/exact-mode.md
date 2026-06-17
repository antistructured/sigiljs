# Exact Mode

By default, SigilJS allows objects to have extra, undeclared properties. This is called **Normal Mode**. 

If you want to strictly reject any undeclared properties, you can use **Exact Mode** via `Sigil.exact`.

## Normal Mode vs. Exact Mode

### Normal Mode (Default)
In normal mode, extra keys are ignored and permitted. This is useful when you only care about a subset of the fields in a payload (e.g. from an API response).

```javascript
import { Sigil } from "@antistructured/sigiljs";

const User = Sigil`
{
  name: string
}
`;

User.check({ name: "Dana" }); // true
User.check({ name: "Dana", admin: true }); // true (extra keys are allowed)
```

### Exact Mode
In exact mode, any undeclared keys are rejected, causing validation to fail.

```javascript
const StrictUser = Sigil.exact`
{
  name: string
}
`;

StrictUser.check({ name: "Dana" }); // true
StrictUser.check({ name: "Dana", admin: true }); // false (extra keys are rejected!)
```

## Nested Exact Objects

Exactness is applied globally to nested objects defined within a `Sigil.exact` block.

```javascript
const StrictOrder = Sigil.exact`
{
  id: string
  customer: {
    name: string
  }
}
`;

// Fails validation because of the extra "email" key inside the nested customer object
StrictOrder.check({
  id: "order_123",
  customer: {
    name: "Dana",
    email: "dana@example.com"
  }
}); // false
```

## Validation Errors

When a validation fails in exact mode due to an unexpected property, the assertion error reports exactly which property was unexpected:

```javascript
try {
  StrictUser.assert({ name: "Dana", admin: true });
} catch (error) {
  console.log(error.toJSON());
  /*
  {
    code: "SIGIL_VALIDATION_FAILED",
    message: "Unexpected property \"admin\"",
    path: ["admin"],
    expected: "undefined",
    actual: "boolean"
  }
  */
}
```
