# Quickstart — Package Smoke Test

This directory verifies the five-pillar quickstart pattern works correctly.

## Run

```bash
bun run examples/quickstart/user.js
```

## Expected output

```
safeParse valid: true
Trusted data: { id: 'user_1', email: 'alex@example.com', role: 'user' }
safeParse invalid: false
Error path: [ 'role' ]
Error message: Expected property "role" to be "admin" | "user", got superuser
Normalized email: alex@example.com
JSON Schema type: object
JSON Schema required: [ 'id', 'email', 'role' ]
Mock fixture: { id: 'string', email: 'string', role: 'admin' }
Fixture valid: true
Valid cases: 1
Invalid cases: 5
```

## From npm install

Replace the import in `user.js`:

```js
// Change:
import { ... } from '../../src/index.js';

// To:
import { ... } from '@weipertda/sigiljs';
```
