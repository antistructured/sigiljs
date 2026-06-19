# CLI Generate Types

This example shows how SigilJS projects an executable contract into TypeScript text for developer-facing docs or generated artifacts.

The billing account payload starts as unknown input. The `.sigil` file is the executable contract, and the `types` projection gives application developers a matching static shape.

## Contract

`contract.sigil` defines a billing account boundary with a literal union for `plan`.

## Valid data

`valid.json` represents trusted output after `safe-parse` succeeds.

## Invalid data

`invalid.json` shows data that would fail at the boundary because `plan` and `seats` do not match.

## Run

```bash
bash examples/workflows/cli-generate-types/run.sh
```

## Expected output

The script prints a TypeScript `Account` type and then prints a successful `safe-parse` result for valid input.
