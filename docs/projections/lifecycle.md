# Contract Lifecycle

Contracts change over time. `diff()` helps catch API and data-model drift before it silently breaks callers, stored data, or integration boundaries.

## Object contract diffs

```js
const UserV1 = sigil(
  {
    id: Number,
    username: String,
    email: optional(String),
  },
  { name: 'User', version: '1.0.0' },
);

const UserV2 = sigil.exact(
  {
    id: Number,
    displayName: String,
    email: String,
  },
  { name: 'User', version: '1.1.0' },
);

UserV2.diff(UserV1);
```

returns:

```js
[
  {
    kind: 'property.added',
    path: ['displayName'],
    contract: { kind: 'string' },
    impact: 'non-breaking',
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
  {
    kind: 'object.exact_changed',
    path: [],
    from: false,
    to: true,
    impact: 'breaking',
  },
  {
    kind: 'metadata.version_changed',
    path: ['metadata', 'version'],
    from: '1.0.0',
    to: '1.1.0',
    impact: 'unknown',
  },
];
```

Lifecycle diffs currently support object contracts first.

## Detected changes

`diff()` currently detects:

- property added
- property removed
- property type changed
- property became required
- property became optional
- exact-mode changes
- literal union changes
- metadata name/version/description/tags changes
- nested object property changes where both sides are object descriptions

Each change has:

- `kind`: machine-readable change type
- `path`: contract path to the change
- `impact`: `breaking`, `non-breaking`, or `unknown`

## Change kinds

### Added property

```js
{
  kind: 'property.added',
  path: ['displayName'],
  contract: { kind: 'string' },
  impact: 'non-breaking',
}
```

### Removed property

```js
{
  kind: 'property.removed',
  path: ['username'],
  contract: { kind: 'string' },
  impact: 'breaking',
}
```

### Changed property contract

```js
{
  kind: 'property.changed',
  path: ['age'],
  from: { kind: 'number' },
  to: { kind: 'string' },
  impact: 'breaking',
}
```

Literal union changes use the same `property.changed` kind. Their impact is currently `unknown` because expanding or narrowing allowed literals depends on the boundary direction and migration policy.

### Requiredness change

```js
{
  kind: 'property.required_changed',
  path: ['email'],
  from: false,
  to: true,
  impact: 'breaking',
}
```

Optional → required is classified as `breaking`; required → optional is classified as `non-breaking`.

### Exact-mode change

```js
{
  kind: 'object.exact_changed',
  path: [],
  from: false,
  to: true,
  impact: 'breaking',
}
```

Loose → exact is classified as `breaking`; exact → loose is classified as `non-breaking`.

### Metadata version change

```js
{
  kind: 'metadata.version_changed',
  path: ['metadata', 'version'],
  from: '1.0.0',
  to: '1.1.0',
  impact: 'unknown',
}
```

Metadata changes are lifecycle signals. Their migration impact depends on release policy, so they are currently classified as `unknown`.

## Contract versioning

Contract versions are lightweight metadata:

```js
const UserV1 = sigil(
  {
    id: Number,
    name: String,
  },
  {
    name: 'User',
    version: '1.0.0',
  },
);

const UserV2 = UserV1.version('1.1.0');
```

The version appears in `describe().metadata.version`, JSON Schema/OpenAPI `x-version`, TypeScript `@version` comments, and `metadata.version_changed` diff entries.

This is not package versioning and it does not introduce a registry. SigilJS does not perform hosted lookup, package-registry publishing, remote sync, semantic-version solving, or migration execution for contract versions.

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
const changes = UserV2.diff(UserV1);
const breaking = changes.filter((change) => change.impact === 'breaking');

if (breaking.length > 0) {
  throw new Error(
    `Potentially breaking contract changes: ${breaking
      .map((change) => `${change.kind}:${change.path.join('.') || '(root)'}`)
      .join(', ')}`,
  );
}
```

Adding an optional field may be safe. Removing a field, changing a field type, making an optional field required, or changing loose contracts to exact contracts is usually migration-sensitive.

## Scope

This is intentionally minimal lifecycle support.

Current limitations:

- object contracts only at the diff root
- practical nested object property diffs only when both sides are object descriptions
- no full semantic diff for every possible contract kind
- no package split yet

Future package work may add compatibility scoring, migration planning, and release-gate helpers.
