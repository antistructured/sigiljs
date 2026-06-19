# SigilJS Category Demo

This demo shows SigilJS as an executable data contract system.

One contract can validate runtime data, generate structural projections, detect contract changes, and enforce AI structured outputs.

It proves the core promise:

> Define structure once. Project it everywhere.

## Files

- `user.sigil` — the executable contract used across the demo.
- `user-v2.sigil` — a changed contract for lifecycle diffing.
- `api-response.json` — valid unknown API response data.
- `bad-api-response.json` — invalid API response data for diagnostics.
- `llm-output.json` — AI structured output that must satisfy the same contract before application code trusts it.
- `run.sh` — the under-two-minute demo script.

## Run

From the repository root:

```bash
bash examples/category-demo/run.sh
```

## What it shows

1. Define contract
2. Enforce runtime data
3. Show failure diagnostics
4. Project TypeScript
5. Project JSON Schema
6. Diff contract versions
7. Validate AI structured output

## Why it matters

The API response and AI output both start as unknown input. SigilJS turns the `.sigil` file into an executable contract, enforces the boundary, and produces trusted output for application code. The same contract also projects into developer tooling and contract lifecycle checks.

No external services are required.
