# API Request Contracts

Define structure once. Project it everywhere.

## 1. Boundary problem

An API handler receives unknown data from the network. Before application code uses it, turn that unknown data into trusted runtime data with an executable contract.

## 2. Sigil contract

```js
import { oneOf, sigil } from 'sigil';

const CreateUserRequest = sigil.exact({
  method: oneOf('POST'),
  path: String,
  body: {
    name: String,
    email: String,
    role: oneOf('user', 'admin'),
  },
});
```

## 3. Unknown input

```js
const requestBody = await request.json();
const unknownRequest = {
  method: request.method,
  path: new URL(request.url).pathname,
  body: requestBody,
};
```

## 4. Enforcement using parse/safeParse/assert

```js
const result = CreateUserRequest.safeParse(unknownRequest);

if (!result.success) {
  return Response.json({ error: result.error.message }, { status: 400 });
}
```

## 5. Trusted output

```js
const trustedRequest = result.data;
await createUser(trustedRequest.body);
```

## 6. Optional projection

```js
const requestProjection = CreateUserRequest.toJSONSchema();
```
