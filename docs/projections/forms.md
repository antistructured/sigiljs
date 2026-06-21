# Forms Projection

**Status: Experimental. May change before 1.0.0.**

Forms projection is experimental and intentionally small. It converts object contracts into basic field metadata that can help generate form inputs, labels, and client-side required markers.

Future direction:

```txt
@sigil/forms
```

For now, forms projection lives in core while the projection API stabilizes.

## Example

```js
import { optional, sigil } from 'sigil';

const User = sigil({
  name: String,
  age: optional(Number),
});

User.toFormConstraints();
```

returns:

```js
{
  name: {
    required: true,
    type: 'text',
  },
  age: {
    required: false,
    type: 'number',
  },
}
```

## Current metadata

`toFormConstraints()` currently supports basic object fields:

- `string` → `{ type: 'text' }`
- `number` / `bigint` → `{ type: 'number' }`
- `boolean` → `{ type: 'checkbox' }`
- literal unions → `{ type: 'select', options }`
- primitive unions → `{ type, accepts }`
- optional fields → `required: false`
- required fields → `required: true`

Non-object contracts currently project to an empty object:

```js
sigil(String).toFormConstraints();
// {}
```

## Runtime-first contract flow

Forms projection does not replace runtime validation. It gives UI metadata from the same contract used at boundaries:

```txt
Sigil contract → describe() → form constraints
             ↘ parse()/safeParse() runtime enforcement
```

This keeps the UI hints and runtime contract aligned without treating form metadata as the source of truth.
