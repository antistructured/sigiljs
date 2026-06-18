# Examples

SigilJS is useful anywhere JavaScript interacts with unknown runtime data.

The examples in `examples/` are small Bun-runnable boundary enforcement scripts. They show how a contract turns unknown input into trusted runtime data with `parse`, `safeParse`, or `assert`.

## Boundary examples

Run any example with Bun:

```bash
bun examples/api-request.js
```

Available examples:

- `examples/api-request.js` — validate an incoming request body with `parse()`.
- `examples/api-response.js` — validate an upstream response with `parse()`.
- `examples/config-file.js` — validate parsed config with `assert()`.
- `examples/webhook.js` — validate a webhook payload with `safeParse()`.
- `examples/queue-message.js` — validate a queue message with `parse()`.
- `examples/http-request-contract.js` — enforce request bodies and generate request OpenAPI docs through `httpContract()`.
- `examples/http-response-contract.js` — enforce handler responses and generate response OpenAPI docs through `httpContract()`.
- `examples/llm-structured-output.js` — validate uncertain LLM output with `parse()` and generate a structured-output schema with `toJSONSchema()`.
- `examples/ai-tool-call.js` — validate AI tool-call arguments and generate tool parameters from one contract.

## Enforcement methods

### `check()`

Returns a boolean and stays on the fast validation path.

```js
User.check(data);
```

### `assert()`

Returns the input value when valid. Throws `SigilValidationError` when invalid.

```js
const user = User.assert(data);
```

### `parse()`

The Enforce-pillar name for trusted boundary parsing. It currently has the same semantics as `assert()`.

```js
const user = User.parse(data);
```

### `safeParse()`

Never throws. Returns a result object.

```js
const result = User.safeParse(data);

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.toJSON());
}
```

## Path-aware errors

`assert()` and `parse()` throw `SigilValidationError` with a stable diagnostic shape:

```js
{
  name: 'SigilValidationError',
  code: 'SIGIL_VALIDATION_FAILED',
  message: 'Expected property "age" to be number, got string',
  path: ['user', 'age'],
  expected: 'number',
  actual: 'string'
}
```
