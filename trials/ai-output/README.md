# AI Output Trial

Provider-neutral AI structured-output validation trials.

## Run

```bash
bun run trials/ai-output/lead-intent.js
bun run trials/ai-output/support-ticket-classifier.js
```

## What this validates

- `toJSONSchema()` as a provider-neutral schema bridge
- `safeParse()` for simulated model output
- invalid output path errors
- repair-loop pseudocode
- `mock()` / `cases()` for generated output testing

No provider SDK or network call is used. No AI helper API is added.
