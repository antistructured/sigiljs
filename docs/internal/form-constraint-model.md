# Form Constraint Model Design

**Block:** Form Constraint Contracts  
**Task:** 2 — Form Constraint Model Design  
**Package:** `@weipertda/sigiljs`

---

## Boundary shape

A form constraint projection converts a Sigil object contract description into plain metadata suitable for driving form UI, validation hints, or testing fixtures. It must not produce HTML, JSX, DOM nodes, or framework-specific structures.

The top-level shape is a wrapper object containing a `fields` map:

```js
{
  fields: {
    [fieldName]: FieldConstraint,
    ...
  }
}
```

Non-object contracts (e.g. `sigil(String)`) return `{ fields: {} }`.

---

## Field shape

Each field in the `fields` map has this shape:

```js
{
  name:     string,           // field key
  path:     string[],         // path from root, e.g. ['address', 'city']
  type:     FieldType,        // see type mapping below
  required: boolean,          // false if wrapped in optional()
  label:    string,           // titleCase of field key (when no metadata name)
  options?: (string|number)[], // present for 'select' type
  accepts?: string[],          // present for mixed unions
  fields?:  FieldMap,          // present for 'object' type (nested)
  items?:   FieldConstraint,   // present for 'array' type
}
```

`label` is derived from the field key (e.g. `firstName` → `First Name`). If the contract carries a metadata name (via `withMetadata`), use that instead.

---

## Type mapping

| Sigil kind | Output `type` | Extra fields |
|------------|---------------|--------------|
| `string` | `text` | — |
| `number` / `bigint` | `number` | — |
| `boolean` | `checkbox` | — |
| all-literal union (`oneOf`) | `select` | `options: [...]` |
| mixed union | first non-boolean type | `accepts: [...]` |
| single literal | `select` | `options: [value]` |
| exact/open object | `object` | `fields: { ... }` |
| array | `array` | `items: FieldConstraint` |
| anything else (null, symbol, unknown) | `text` | — (fallback) |

---

## Required behavior

- A field is `required: true` when its contract is not wrapped in `optional()`.
- A field is `required: false` when wrapped in `optional()`.
- Nested fields within a nested object inherit required semantics independently.

---

## Optional behavior

Optional fields project exactly like required fields except `required: false`.  
The inner type mapping is applied to the unwrapped inner contract.

---

## Literal union (select) behavior

When every variant in a `union` is a `literal`, the result is:

```js
{ type: 'select', options: ['admin', 'user'] }
```

Options are in the order they were defined. Single literals project to `select` with one option.

---

## Array behavior

Arrays project to:

```js
{
  type: 'array',
  items: { type: 'text', required: true }  // field constraint for the element type
}
```

`required` on the array entry refers to whether the field itself is required in the parent object. The `items` entry describes the element contract — not whether individual items are required (that is an application concern).

---

## Nested object behavior

Nested object contracts (including `sigil.exact({ ... })` and open objects) project recursively:

```js
{
  name: 'address',
  path: ['address'],
  type: 'object',
  required: true,
  label: 'Address',
  fields: {
    city:  { name: 'city',  path: ['address', 'city'],  type: 'text',   required: true,  label: 'City'  },
    state: { name: 'state', path: ['address', 'state'], type: 'text',   required: true,  label: 'State' },
    zip:   { name: 'zip',   path: ['address', 'zip'],   type: 'number', required: false, label: 'Zip'   },
  }
}
```

---

## Metadata behavior

If a field carries metadata (e.g. via `withMetadata({ name: 'Email Address' })`), the projection uses that name as the `label`.  
Otherwise `label` is derived: camelCase key → Title Case words (e.g. `dateOfBirth` → `Date Of Birth`).

---

## Unsupported behavior

Fields with kinds that cannot be meaningfully projected (e.g. null literals, symbol types) receive:

```js
{ type: 'text' }  // silent fallback, no error
```

This matches the existing fallback and keeps the projection non-throwing for all inputs.

---

## Non-goals

The form constraint model does not:

- generate HTML elements or attribute strings
- generate JSX/TSX
- require a DOM runtime
- depend on any UI framework
- validate form data at runtime (use `parse()` / `safeParse()` for that)
- replace browser-native validation
- enforce field order beyond the order of `description.properties`

---

## Stability

All form constraint projection is experimental. The `{ fields }` wrapper shape, `path`, `label`, and nested/array behavior are new additions in this block and may change before 1.0.0.

The existing flat map behavior (pre-block) is superseded by the `{ fields }` wrapper. The migration is additive and backward-incompatible in output shape — callers consuming the old flat object must update to `result.fields`.
