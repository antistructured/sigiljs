# API Response Contracts

Define structure once. Project it everywhere.

## 1. Boundary problem

An API response is a system boundary too. Before returning data to callers, enforce the contract object so internal runtime data does not leak accidental fields or wrong shapes.

## 2. Sigil contract

```js
import { optional, sigil } from '@weipertda/sigiljs';

const UserResponse = sigil.exact({
  id: String,
  name: String,
  email: String,
  displayName: optional(String),
});
```

## 3. Unknown input

```js
const unknownOutput = await loadUserForResponse(userId);
```

## 4. Enforcement using parse/safeParse/assert

```js
const trustedResponse = UserResponse.parse(unknownOutput);
```

## 5. Trusted output

```js
return Response.json(trustedResponse);
```

## 6. Optional projection

```js
const responseProjection = UserResponse.toOpenAPI();
```
