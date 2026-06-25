# Event Contracts

Define structure once. Project it everywhere.

## 1. Boundary problem

Application events often cross module, process, or browser boundaries. Treat event payloads as unknown data before dispatching them to handlers.

## 2. Sigil contract

```js
import { oneOf, sigil } from '@weipertda/sigiljs';

const UserEvent = sigil.exact({
  type: oneOf('user.created', 'user.updated'),
  occurredAt: Number,
  payload: {
    userId: String,
    email: String,
  },
});
```

## 3. Unknown input

```js
const unknownEvent = JSON.parse(message.data);
```

## 4. Enforcement using parse/safeParse/assert

```js
const event = UserEvent.parse(unknownEvent);
```

## 5. Trusted output

```js
dispatchUserEvent(event.type, event.payload);
```

## 6. Optional projection

```js
const eventContract = UserEvent.describe();
```
