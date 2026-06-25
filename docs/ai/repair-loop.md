# AI Repair Loop

SigilJS does not implement automatic repair for invalid AI output.
It does provide the primitives that make a repair loop possible:

1. Run `safeParse()` or `parse()` against model output.
2. Inspect the returned `SigilValidationError`.
3. Use the error path to identify the invalid field(s).
4. Send a repair prompt to the model yourself.
5. Re-run the contract against the repaired output.

## Why SigilJS stops at validation

Automatic repair requires provider-specific behavior, network calls, and prompt generation.
Those concerns belong outside core.
Core's job is to tell you exactly what failed and where.

## Path-aware errors as the key enabler

`SigilValidationError` includes:

- `message` — human-readable summary
- `path` — array of keys/indexes that led to the failure
- `expected` — contract expectation at the failing location
- `actual` — value that failed

```js
const result = LeadIntent.safeParse(llmOutput);

if (!result.success) {
  console.log(result.error.path);
  console.log(result.error.expected);
  console.log(result.error.actual);
}
```

Use `path` to scope a repair prompt to the failing field only.
This keeps repair prompts small and reduces hallucinations.

## Pseudocode

```js
const result = LeadIntent.safeParse(output);

if (!result.success) {
  const repairPrompt = buildRepairPrompt({
    error: result.error,
    original: output,
    schema: LeadIntent.toJSONSchema(),
  });

  const repaired = await callYourModel(repairPrompt);
  const repairedResult = LeadIntent.safeParse(repaired);

  if (!repairedResult.success) {
    throw repairedResult.error;
  }

  return repairedResult.data;
}

return result.data;
```

`callYourModel()` is intentionally left as application code.
SigilJS does not import or call provider SDKs.

## Honest boundaries

SigilJS:

- generates the schema the model should follow
- validates model output
- reports what failed and where
- generates cases and mocks for tests and prompts

SigilJS does not:

- call models
- generate provider-specific requests
- rewrite or repair model output automatically
- guarantee any API accepts JSON Schema universally
