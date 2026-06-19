# CLI Generate JSON Schema

This example shows how SigilJS projects an executable contract into JSON Schema while still enforcing unknown event data at runtime.

The event message is unknown input from an event bus. The `.sigil` contract creates trusted output for consumers and projects into JSON Schema for integration tooling.

## Contract

`contract.sigil` defines an event boundary with a literal `type` union and nested payload object.

## Valid data

`valid.json` is a trusted event after contract enforcement.

## Invalid data

`invalid.json` uses an unsupported event type and the wrong `payload.userId` shape.

## Run

```bash
bash examples/workflows/cli-generate-json-schema/run.sh
```

## Expected output

The script prints the JSON Schema projection, then prints deterministic JSON failure output for the invalid event input.
