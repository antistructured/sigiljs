# CLI Validation

Validate JSON data against a contract from the terminal.

---

## `check`

Validate JSON data and print human-readable output:

```bash
sigil check contracts/user.sigil.js data/user.json
```

**Valid:**
```
✓ valid

Contract: User
Data: data/user.json
```

Exit code `0`.

**Invalid:**
```
✗ invalid

Path: role
Expected: "admin" | "user"
Actual: string
Message: Expected property "role" to be "admin" | "user", got superuser
```

Exit code `1`.

**Machine-readable output:**

```bash
sigil check contracts/user.sigil.js data/user.json --json
```

```json
{ "success": false, "error": { "code": "SIGIL_VALIDATION_FAILED", "path": ["role"], ... } }
```

---

## `parse`

Parse JSON data and print trusted output:

```bash
sigil parse contracts/user.sigil.js data/user.json
```

Exits `0` with the parsed data on success. Exits `1` with diagnostics on failure.

Use `--json` for machine-readable error format on failure.

---

## `safe-parse`

Parse without exiting non-zero on validation failure:

```bash
sigil safe-parse contracts/user.sigil.js data/user.json
```

Always exits `0`. Prints `{ "success": true, "data": ... }` or `{ "success": false, "error": ... }`.

---

## Error messages

| Situation | Behavior |
|-----------|----------|
| Valid data | exits 0, prints success |
| Invalid data | exits 1, prints path-aware diagnostics |
| Malformed JSON | exits 1, prints `Invalid JSON data in <path>: ...` |
| Missing data file | exits 1, prints `Data file not found: <path>` |
| Missing contract | exits 1, prints `Contract file not found: <path>` |
