# Contract Diff Usage

`diff()` compares two object contracts and returns deterministic lifecycle change entries. Use it for migration review, API contract review, and release notes before data crosses a boundary.

---

## Direction

Call `Next.diff(Previous)` to describe how a contract changed from the previous version to the next version.

```js
const changes = UserV2.diff(UserV1);
```

In this direction:

- fields present in `UserV2` but absent in `UserV1` are `property.added`
- fields absent in `UserV2` but present in `UserV1` are `property.removed`
- fields whose contracts differ are `property.changed`
- requiredness changes are `property.required_changed`

The CLI follows the same direction:

```bash
sigil diff user-v1.sigil.js user-v2.sigil.js
```

The first file is the previous contract. The second file is the next contract.

---

## Practical example

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const UserV1 = sigil.exact({
  id: String,
  username: String,
  role: oneOf('admin', 'user'),
  email: optional(String),
});

const UserV2 = sigil.exact({
  id: String,
  displayName: String,
  role: oneOf('admin', 'user', 'owner'),
  email: String,
});

const changes = UserV2.diff(UserV1);
```

Example result shape:

```js
[
  {
    kind: 'property.added',
    path: ['displayName'],
    contract: { kind: 'string' },
    impact: 'non-breaking',
  },
  {
    kind: 'property.changed',
    path: ['role'],
    from: { kind: 'union', variants: [/* ... */] },
    to: { kind: 'union', variants: [/* ... */] },
    impact: 'unknown',
  },
  {
    kind: 'property.required_changed',
    path: ['email'],
    from: false,
    to: true,
    impact: 'breaking',
  },
  {
    kind: 'property.removed',
    path: ['username'],
    contract: { kind: 'string' },
    impact: 'breaking',
  },
]
```

---

## Reviewing migrations

Use `diff()` before deploying a schema or persistence boundary change:

```js
const changes = UserV2.diff(UserV1);
const breaking = changes.filter((change) => change.impact === 'breaking');

if (breaking.length > 0) {
  console.warn('Migration review required before deploying UserV2');
}
```

A breaking diff does not automatically mean the change is wrong. It means old data or old callers may fail against the new contract unless a migration or compatibility plan exists.

---

## Reviewing API contracts

Use `diff()` when reviewing request/response contract changes:

```js
const changes = PublicResponseV2.diff(PublicResponseV1);

for (const change of changes) {
  console.log(`[${change.impact}] ${change.kind} at ${change.path.join('.')}`);
}
```

Typical policy:

- `property.added` is often non-breaking for response bodies
- `property.removed` is usually breaking
- optional → required is breaking
- required → optional is non-breaking
- literal union changes may need human review because the boundary direction matters

---

## Change entry fields

Each entry includes:

| Field | Meaning |
|-------|---------|
| `kind` | machine-readable change type |
| `path` | array path to the changed field or metadata |
| `impact` | `breaking`, `non-breaking`, or `unknown` |
| `contract` | contract description for added/removed fields |
| `from` / `to` | previous and next values for changed fields |

---

## Known limitations

`diff()` is intentionally narrow today:

- object contracts only
- structural shape changes only
- no SQL/ORM/database migration generation
- no data scanning
- no semantic validation like email/date/range constraints
- literal union impact is `unknown` because expansion/narrowing depends on boundary direction
- generated output is useful for review, not a substitute for compatibility policy

---

## Relationship to Prove

`diff()` is part of the Prove pillar: it helps prove contract lifecycle changes are visible and reviewable. It complements `mock()`, `cases()`, and `test()`, but does not replace runtime validation with `parse()` or `safeParse()`.
