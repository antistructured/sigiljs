# HTTP Runtime Trial

Framework-neutral HTTP boundary trials.

## Run

```bash
bun run trials/http-runtime/create-user-route.js
bun run trials/http-runtime/update-user-route.js
```

## What this validates

- direct request-body `safeParse()`
- response-body `parse()`
- error response contracts
- OpenAPI/path-item projection
- experimental `httpContract()` request/response helpers
- response status maps

No server or framework dependency is required. `httpContract()` remains experimental.
