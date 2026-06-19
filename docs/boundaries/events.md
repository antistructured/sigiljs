# Event boundaries

Events carry a type, timestamp, and payload produced by another
service or internal producer.
The event envelope itself is often trusted enough, but the payload
is application data and should be validated.

Describe the event schema once and use it at publish time and
consume time. At publish time, `serialize()` enforces the outgoing
envelope. At consume time, `parse()` or `assert()` enforces the
incoming payload.

## Recommended style

```js
const UserUpdated = Sigil.exact`
  type: "user.updated"
  occurredAt: number
  payload: object
`;
```

## Consume an event

```js
const event = await queue.receive();
const shaped = UserUpdated.parse(event);
```

Events can also describe wildcard topics or typed payload unions.

```js
const AccountEvent = sigil.exact({
  topic: oneOf('user.updated', 'account.deactivated'),
  occurredAt: Number,
  payload: union(
    sigil({ userId: String, name: String }),
    sigil({ userId: String, reason: String }),
  ),
});
```

Event boundaries are useful for:

- audit streams
- webhook retries
- cqrs command envelopes
- activity notifications
- inter-service contracts
