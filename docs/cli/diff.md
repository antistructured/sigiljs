# CLI Diff

Compare two contract files from the terminal.

---

## `diff`

```bash
sigil diff contracts/old-user.sigil.js contracts/new-user.sigil.js
```

The first file is treated as the previous contract, the second as the next contract.

Human-readable output (default):

```
Contract changes:

BREAKING
- required property: email

NON-BREAKING
- added property: age
```

Machine-readable output:

```bash
sigil diff contracts/old-user.sigil.js contracts/new-user.sigil.js --json
```

```json
[
  { "kind": "property.removed", "path": ["email"], "impact": "breaking" },
  { "kind": "property.removed", "path": ["age"], "impact": "non-breaking" }
]
```

---

## Change kinds

| Kind | Description |
|------|-------------|
| `property.added` | Field exists in new but not old |
| `property.removed` | Field exists in old but not new |
| `property.required_changed` | Optional/required status changed |
| `property.contract_changed` | Field type changed |
| `exact.changed` | Exact mode changed |
| `metadata.changed` | Metadata changed |

---

## Impact levels

| Impact | Meaning |
|--------|---------|
| `breaking` | Existing data or code may fail with the new contract |
| `non-breaking` | New contract is backward-compatible |

---

## Important limitations

Contract diffs describe structural shape changes only. They do not:
- inspect actual database or API data
- generate SQL migrations or schema changes
- run migrations
- detect data-level inconsistencies

Use a dedicated migration tool for schema changes. Use `diff` to reason about what changed.

---

## Using with `--out`

```bash
sigil diff old.sigil.js new.sigil.js --json --out diffs/contract-diff.json
```
