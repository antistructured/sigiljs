# Local Storage Contracts

Define structure once. Project it everywhere.

## 1. Boundary problem

Browser local storage is user-controlled unknown data. Enforce an executable contract before rehydrating application state.

## 2. Sigil contract

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const StoredSession = sigil.exact({
  userId: String,
  token: String,
  theme: optional(oneOf('light', 'dark')),
});
```

## 3. Unknown input

```js
const raw = localStorage.getItem('session');
const unknownSession = raw ? JSON.parse(raw) : null;
```

## 4. Enforcement using parse/safeParse/assert

```js
const result = StoredSession.safeParse(unknownSession);

if (!result.success) {
  localStorage.removeItem('session');
  return;
}
```

## 5. Trusted output

```js
restoreSession(result.data);
```

## 6. Optional projection

```js
const storageProjection = StoredSession.toJSONSchema();
```
