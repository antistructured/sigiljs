# CLI Diff Contracts

This example shows how SigilJS compares two executable contracts before a changed boundary reaches application code.

Contract diffing helps developers prove whether a contract change is breaking or non-breaking. The previous contract and next contract both describe data crossing the same user API boundary.

## Contract

`contract-v1.sigil` is the previous contract. `contract.sigil` is the next contract.

## Valid data

`valid.json` matches the next contract and represents trusted output after migration.

## Invalid data

`invalid.json` still resembles the old boundary and fails the next contract.

## Run

```bash
bash examples/workflows/cli-diff-contracts/run.sh
```

## Expected output

The script prints grouped human-readable contract changes and then prints the deterministic JSON diff array for automation.
