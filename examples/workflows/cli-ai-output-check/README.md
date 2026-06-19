# CLI AI Output Check

This example shows how SigilJS validates unknown AI structured output before application code trusts it.

LLM responses are unknown input. The `.sigil` file is an executable contract that turns valid model output into trusted output and rejects malformed structured responses.

## Contract

`contract.sigil` defines the lead intent object expected from an AI structured-output call.

## Valid data

`valid.json` is trusted output after `safe-parse` succeeds.

## Invalid data

`invalid.json` includes an unsupported `urgency` literal and a non-string `summary`.

## Run

```bash
bash examples/workflows/cli-ai-output-check/run.sh
```

## Expected output

The script prints a successful `safe-parse` result, a deterministic JSON validation failure for invalid model output, and the contract description projection for tooling.
