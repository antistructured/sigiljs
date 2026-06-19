# Webhook boundaries

Webhooks deliver data created by an external system: payment events,
deploy notifications, issue comments, and similar events.
Treat every webhook payload as untrusted input.

SigilJS validates the body shape with `assert()` or `safeParse()`,
and `toJSONSchema()` can describe the expected payload for each topic.

## Recommended style

```js
const PushEvent = sigil.exact({
  provider: 'github',
  topic: 'push',
  payload: {
    ref: String,
    commits: Array,
  },
});
```

## Validation

```js
const raw = req.body;
const event = PushEvent.safeParse(raw);

if (!event.success) {
  return res.status(400).send('invalid webhook');
}

handlePush(event.data);
```

Webhook boundaries are useful for:

- GitHub and GitLab events
- payment processor notifications
- CI/CD webhook envelopes
- outbound delivery confirmations
- vendor-specific event topics
