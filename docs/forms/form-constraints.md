# Form Constraints Projection

**Status: Experimental. May change before 1.0.0.**

`toFormConstraints()` projects a Sigil object contract into plain field metadata. The metadata can drive form UI construction, client-side required markers, field type hints, and select option lists — all from the same contract used for runtime enforcement.

---

## Quick example

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const UserForm = sigil.exact({
  name: String,
  age: optional(Number),
  role: oneOf('admin', 'user'),
  subscribed: Boolean,
});

UserForm.toFormConstraints();
```

Returns:

```js
{
  fields: {
    name: {
      name: 'name',
      path: ['name'],
      type: 'text',
      required: true,
      label: 'Name',
    },
    age: {
      name: 'age',
      path: ['age'],
      type: 'number',
      required: false,
      label: 'Age',
    },
    role: {
      name: 'role',
      path: ['role'],
      type: 'select',
      required: true,
      label: 'Role',
      options: ['admin', 'user'],
    },
    subscribed: {
      name: 'subscribed',
      path: ['subscribed'],
      type: 'checkbox',
      required: true,
      label: 'Subscribed',
    },
  }
}
```

---

## Field shape

Each entry in `fields` has:

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Field key from the contract |
| `path` | `string[]` | Path from root (e.g. `['address', 'city']` for nested fields) |
| `type` | `string` | Input type hint — see type mapping below |
| `required` | `boolean` | `true` unless wrapped in `optional()` |
| `label` | `string` | Human-readable label derived from the field key |
| `options?` | `(string\|number)[]` | Present for `select` type fields |
| `accepts?` | `string[]` | Present for mixed union fields |
| `fields?` | `object` | Present for `object` type — recursive field map |
| `items?` | `object` | Present for `array` type — element type constraint |

---

## Type mapping

| Sigil type | `type` output | Extra fields |
|------------|---------------|--------------|
| `String` | `text` | — |
| `Number` / `BigInt` | `number` | — |
| `Boolean` | `checkbox` | — |
| `oneOf(...)` (all literals) | `select` | `options: [...]` |
| `union(A, B)` (mixed) | first non-boolean type | `accepts: [...]` |
| nested `sigil.exact({...})` | `object` | `fields: { ... }` |
| `Array` | `array` | `items: { type, ... }` |
| other / unsupported | `text` | — (fallback, no error) |

---

## Label derivation

Labels are derived automatically from the field key:

| Key | Label |
|-----|-------|
| `name` | `Name` |
| `firstName` | `First Name` |
| `dateOfBirth` | `Date Of Birth` |
| `email_address` | `Email Address` |

---

## Nested objects

Nested contracts project recursively. The `path` array tracks the full path from root:

```js
const Form = sigil.exact({
  address: sigil.exact({ city: String, zip: optional(String) }),
});

Form.toFormConstraints().fields.address.fields.city.path
// → ['address', 'city']
```

---

## Non-object contracts

A non-object contract (e.g. `sigil(String)`) returns an empty fields map:

```js
sigil(String).toFormConstraints()
// → { fields: {} }
```

---

## Fresh result each call

`toFormConstraints()` returns a new object each call. Mutations do not affect subsequent calls:

```js
const a = Form.toFormConstraints();
a.fields.name.type = 'number'; // mutate
const b = Form.toFormConstraints();
b.fields.name.type // still 'text'
```

---

## Non-goals

`toFormConstraints()` does not:
- generate HTML, JSX, or DOM nodes
- require a browser or DOM runtime
- depend on any UI framework
- validate form values at runtime (use `parse()` / `safeParse()` for that)
- freeze or cache the returned object
