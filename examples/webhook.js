import { sigil, oneOf } from '../src/index.js';

const WebhookEvent = sigil.exact({
  id: String,
  type: oneOf('user.created', 'user.deleted'),
  createdAt: String,
});

const incomingWebhook = {
  id: 'evt_123',
  type: 'user.created',
  createdAt: '2026-06-18T00:00:00.000Z',
};

const result = WebhookEvent.safeParse(incomingWebhook);

if (!result.success) {
  console.error('Rejected webhook:', result.error.toJSON());
  process.exit(1);
}

console.log('Webhook accepted:', result.data.type);
