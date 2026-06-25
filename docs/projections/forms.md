# Forms Projection

**Status: Experimental. May change before 1.0.0.**

`toFormConstraints()` converts object contracts into plain field metadata that can help generate form inputs, required markers, type hints, and select option lists.

No HTML is generated. No DOM is required. No framework is required.

For now, forms projection lives in core while the projection API stabilizes.

## Quick example

```js
import { optional, oneOf, sigil } from '@weipertda/sigiljs';

const User = sigil({
  name: String,
  age: optional(Number),
  role: oneOf('admin', 'user'),
});

User.toFormConstraints();
```

returns:

```js
{
  fields: {
    name: { name: 'name', path: ['name'], type: 'text',   required: true,  label: 'Name' },
    age:  { name: 'age',  path: ['age'],  type: 'number', required: false, label: 'Age' },
    role: { name: 'role', path: ['role'], type: 'select', required: true,  label: 'Role', options: ['admin', 'user'] },
  }
}
```

## Current metadata

`toFormConstraints()` currently supports:

- `string` → `{ type: 'text' }`
- `number` / `bigint` → `{ type: 'number' }`
- `boolean` → `{ type: 'checkbox' }`
- all-literal unions → `{ type: 'select', options }`
- mixed unions → `{ type, accepts }`
- nested exact objects → `{ type: 'object', fields: { ... } }`
- arrays → `{ type: 'array', items: { ... } }`
- optional fields → `required: false`
- required fields → `required: true`
- labels derived from field keys (camelCase and snake_case → Title Case)
- `path` array tracking full nested field location

Non-object contracts return `{ fields: {} }`.

## Runtime-first contract flow

Forms projection does not replace runtime validation. It gives UI metadata from the same contract used at boundaries:

```txt
Sigil contract → describe() → toFormConstraints() → plain field metadata
             ↘ parse() / safeParse() → runtime enforcement
```

The UI hints and runtime contract stay aligned without treating form metadata as the source of truth.

## Docs

- [Form Contracts](../forms/form-contracts.md) — define, enforce, transform form values
- [Form Constraints](../forms/form-constraints.md) — full projection API and field shape
- [Form Validation](../forms/form-validation.md) — safeParse, error paths, FormData
- [Form Testing](../forms/form-testing.md) — mock(), cases(), test()
