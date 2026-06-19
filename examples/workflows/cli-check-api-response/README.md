# CLI API Response Check

This example shows how SigilJS validates unknown API response data before application code trusts it.

An API response is unknown input until an executable contract enforces the boundary. After `sigil check` succeeds, application code can treat the response as trusted output.

## Contract

`contract.sigil` defines the response contract object expected from an upstream user API.

## Valid data

`valid.json` matches the contract and exits successfully.

## Invalid data

`invalid.json` has an unsupported `role` and an invalid nested `profile.age` value.

## Run

```bash
bash examples/workflows/cli-check-api-response/run.sh
```

## Expected output

The valid response prints human-readable success output. The invalid response uses `--json` to show deterministic automation output with `success: false`, path, expected, actual, and message fields.
