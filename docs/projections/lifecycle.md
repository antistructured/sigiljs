# Contract Lifecycle

Contracts change over time. `diff()` helps catch API and data-model drift before it silently breaks callers, stored data, or integration boundaries.

## Object contract diffs

```js
const UserV1 = sigil({
  id: Number,
  name: String,
});

const UserV2 = sigil({
  id: Number,
  email: String,
});

UserV2.diff(UserV1);
```

returns:

```js
{
  added: [
    {
      key: 'email',
      field: {
        key: 'email',
        required: true,
        contract: { kind: 'string' },
      },
    },
  ],
  removed: [
    {
      key: 'name',
      field: {
        key: 'name',
        required: true,
        contract: { kind: 'string' },
      },
    },
  ],
  changed: [],
  requiredness: [],
}
```

Initial lifecycle diffs support object contracts only.

## Detected changes

`diff()` currently detects:

- added fields
- removed fields
- changed field contracts
- optional-to-required changes
- required-to-optional changes

Example requiredness change:

```js
const V1 = sigil({ name: optional(String) });
const V2 = sigil({ name: String });

V2.diff(V1).requiredness;
```

returns:

```js
[
  {
    key: 'name',
    before: 'optional',
    after: 'required',
  },
];
```

## Migration safety

Use contract diffs to catch API and data model drift:

- before changing an API request contract
- before changing an API response contract
- before changing config-file contracts
- before changing queue-message contracts
- before changing database record contracts
- before changing LLM structured-output contracts

A recommended release check:

```js
const diff = UserV2.diff(UserV1);

if (diff.removed.length > 0 || diff.changed.length > 0) {
  throw new Error('Potentially breaking contract change');
}
```

Adding an optional field may be safe. Removing a field, changing a field type, or making an optional field required is usually migration-sensitive.

## Scope

This is intentionally minimal lifecycle support.

Current limitations:

- object contracts only
- top-level fields only
- exact-mode flag changes are not reported yet
- no semantic version classifier yet

Future package work may add nested diffs, compatibility scoring, migration planning, and release-gate helpers.
