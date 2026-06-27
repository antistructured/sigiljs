# AI Output Trial

**Block:** Real-World Usage Trial  
**Pass:** 9 — AI Output Trial  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Trial Files

- `trials/ai-output/lead-intent.js`
- `trials/ai-output/support-ticket-classifier.js`
- `trials/ai-output/README.md`

---

## Commands Run

```bash
bun run trials/ai-output/lead-intent.js
bun run trials/ai-output/support-ticket-classifier.js
```

Result: **pass**

---

## Coverage

The trial exercised:

- `toJSONSchema()` as a provider-neutral schema bridge
- `safeParse()` for simulated model output
- invalid output path errors
- repair-loop pseudocode
- `mock()` / `cases()` for generated output testing

---

## Findings

### What Felt Good

- Direct contract usage is enough for provider-neutral structured-output validation.
- `toJSONSchema()` provides the right bridge for provider APIs that accept JSON Schema-like response schemas.
- `safeParse()` gives a clean retry/repair boundary.
- Error paths and expected values are useful for repair instructions.
- `mock()` / `cases()` / `test()` are useful for testing classifier/output contracts before connecting a model.

### Friction

- Provider-specific schema dialect differences are not handled by SigilJS, and that should remain outside the core package for now.
- Repair loops remain application-owned; SigilJS should not prescribe prompts or retry policy.
- `mock()` generated output is structurally valid but not representative model content.
- Numeric semantics like confidence range `0..1` are not encoded by the current stable core.

---

## AI Helper Assessment

An AI-specific helper remains unnecessary.

The useful primitive is still:

```txt
contract.toJSONSchema() + contract.safeParse(modelOutput)
```

Provider-specific adapters should remain deferred.

---

## Blocker Assessment

No AI-output blocker found.

Keep AI provider helpers deferred. Improve docs by showing provider-neutral schema + validation + repair-loop patterns.
