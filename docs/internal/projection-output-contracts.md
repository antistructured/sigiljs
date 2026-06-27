# Projection Output Contracts

**Block:** Stable Core Hardening  
**Package:** `@weipertda/sigiljs` v0.14.0  
**Pass:** 7 — Projection Output Contract Hardening

---

## Scope

Stable-core projection methods:

- `describe()`
- `toJSONSchema()`
- `toTypeScript()`
- `toOpenAPI()`

Experimental projection method:

- `toFormConstraints()`

This document freezes SigilJS output expectations, not the entire JSON Schema, TypeScript, or OpenAPI ecosystems.

---

## `describe()` Output Contract

`describe()` returns a fresh plain-object structural model for each call.

Stable expectations:

- primitive descriptions use `{ kind: '<type>' }`
- object descriptions use:
  - `kind: 'object'`
  - `exact: boolean`
  - `properties: Array<{ key, required, contract }>`
- property ordering follows contract definition order
- optional fields use `required: false`
- literal unions use `{ kind: 'union', variants: [{ kind: 'literal', value }, ...] }`
- metadata is included under `metadata` when present
- transform metadata may be included, but transform function bodies are not exposed

`describe()` output is deterministic and safe to mutate locally because later calls return fresh description objects.

---

## `toJSONSchema()` Output Contract

`toJSONSchema()` projects the SigilJS description model into a deterministic JSON Schema-like subset.

Stable expectations:

- object contracts project to `{ type: 'object', properties }`
- required property order follows contract definition order
- exact object contracts include `additionalProperties: false`
- literal unions project to `enum`
- primitive unions project to `type: [...]` when supported by the subset
- unsupported kinds throw `SigilProjectionError`
- metadata projects to:
  - `title`
  - `description`
  - `x-version`
  - `x-tags`

Metadata keys are emitted before structural keys for deterministic output.

---

## `toTypeScript()` Output Contract

`toTypeScript(name?)` returns a deterministic TypeScript declaration string.

Stable expectations:

- output starts with `type <Name> = ...`
- explicit `name` argument wins
- contract metadata name is used when no name argument is provided
- fallback name is `Contract`
- object properties preserve contract definition order
- optional properties use `?`
- literal unions preserve variant order
- metadata description/version/tags project to a leading JSDoc comment when present

Unsupported TypeScript projection paths return a structured `SigilProjectionError` object rather than throwing in the current implementation.

---

## `toOpenAPI()` Output Contract

`toOpenAPI()` currently returns a cloned schema-level object equivalent to `toJSONSchema()` output.

Stable expectations:

- output is JSON-serializable
- output equals the current JSON Schema subset for supported contracts
- output is a separate cloned object
- it is schema-level output, not a full OpenAPI path item or document

---

## Deterministic Ordering Rules

Stable deterministic order:

1. contract properties follow definition order
2. `required` arrays follow definition order
3. union variants follow definition order
4. metadata projection keys precede structural schema keys in JSON Schema output
5. TypeScript properties follow definition order

---

## Metadata Behavior

Projection metadata is stable for:

- `name`
- `version`
- `description`
- `tags`

JSON Schema mapping:

| Sigil metadata | JSON Schema output |
|----------------|--------------------|
| `name` | `title` |
| `description` | `description` |
| `version` | `x-version` |
| `tags` | `x-tags` |

TypeScript mapping:

- `description` → JSDoc body line
- `version` → `@version`
- `tags` → `@tags`

---

## Unsupported Kind / Projection Error Behavior

Known unsupported stable projection behavior:

- JSON Schema projection of `symbol` throws `SigilProjectionError`.
- The error includes:
  - `code: 'SIGIL_PROJECTION_FAILED'`
  - `projection`
  - `path`
  - `reason`
  - `kind`

---

## `toFormConstraints()` Experimental Status

`toFormConstraints()` remains experimental.

Current shape is intentionally documented but not promoted into stable core:

```js
{
  fields: {
    fieldName: {
      name,
      path,
      required,
      label,
      type,
      // optional projection-specific keys
    }
  }
}
```

It remains out of stable-core hardening because it needs real UI/form usage before 1.0.

---

## Tests

Focused tests live in:

```txt
tests/stable-core-projection-contracts.test.js
```

They cover:

- deterministic `describe()` shape
- deterministic JSON Schema subset output
- deterministic TypeScript declaration string
- OpenAPI schema-level clone behavior
- metadata projection behavior
- structured unsupported-kind projection errors
- `toFormConstraints()` experimental shape smoke test

Current focused test status:

```txt
7 pass, 0 fail
```

---

## 1.0 Recommendation

Freeze `describe()`, `toJSONSchema()`, `toTypeScript()`, and `toOpenAPI()` as stable-core projections after one additional regression-matrix pass.

Keep `toFormConstraints()` experimental until real form/UI usage confirms its shape.

