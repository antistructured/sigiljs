# CLI Prove Commands

Generate and verify contract behavior from the terminal.

---

## `mock`

Print deterministic valid sample data:

```bash
sigil mock contracts/user.sigil.js
```

```json
{ "id": "string", "name": "string", "email": "string", "role": "admin" }
```

The output is always deterministic — same contract always produces the same mock. Generated values are type-correct but not semantically meaningful (strings are `"string"`, numbers are `0`, etc.).

---

## `cases`

Print generated valid and invalid test cases:

```bash
sigil cases contracts/user.sigil.js
```

```json
{
  "valid": [
    { "label": "valid default", "value": { "id": "string", "name": "string", ... } }
  ],
  "invalid": [
    { "label": "missing required property: id", "value": { "name": "string", ... } },
    { "label": "invalid string", "value": 0 }
  ]
}
```

Use this to drive automated test fixtures or to understand what boundary cases the contract covers.

---

## `test`

Run a contract self-test using generated cases and print a report:

```bash
sigil test contracts/user.sigil.js
```

```json
{
  "success": true,
  "valid": { "passed": 1, "failed": 0 },
  "invalid": { "passed": 6, "failed": 0 },
  "failures": []
}
```

`success: true` means all generated valid cases parsed successfully and all generated invalid cases failed correctly.

---

## Using with `--out`

```bash
sigil mock contracts/user.sigil.js --out fixtures/user-fixture.json
sigil cases contracts/user.sigil.js --out fixtures/user-cases.json
sigil test contracts/user.sigil.js --out reports/user-test.json
```
