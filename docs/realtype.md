# realType

SigilJS includes ` realType() `, which improves on JavaScript's ` typeof `.

```javascript

import { realType } from "sigiljs"

realType([])         // "array"
realType(null)       // "null"
realType(new Map())  // "map"
realType(new Date()) // "date"

```

This is especially useful when building validation or debugging tools.

## Custom Type Hooks

You can supply custom override hooks to map instances of custom classes or objects back to nominal type strings. Hooks are checked before standard type resolution:

```javascript
import { realType } from "@antistructured/sigiljs";

class MyCustomConnection {}

const conn = new MyCustomConnection();

const typeName = realType(conn, {
  hooks: [
    val => val instanceof MyCustomConnection ? 'connection' : null
  ]
});

console.log(typeName); // "connection"
```
