# realType

`realType()` returns a clearer runtime type name than JavaScript's `typeof`.

```js
import { realType } from 'sigil';

realType('hello'); // string
realType(42); // number
realType(Number.NaN); // nan
realType(null); // null
realType([]); // array
realType(new Date()); // date
realType(new Map()); // map
realType(async () => {}); // asyncfunction
```

It is used internally by SigilJS diagnostics and is also exported for debugging or custom validation tools.

## Why not `typeof`?

```js
typeof null; // object
typeof []; // object
```

`realType()` reports those values as `null` and `array`.

## Custom hooks

Hooks let you name application-specific values before normal detection runs.

```js
class DatabaseConnection {}

const conn = new DatabaseConnection();

realType(conn, {
  hooks: [
    (value) => (value instanceof DatabaseConnection ? 'db_connection' : null),
  ],
}); // db_connection
```

A hook should return a string when it recognizes a value, or `null` when it does not.
