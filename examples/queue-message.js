import { sigil, oneOf } from '../src/index.js';

const QueueMessage = sigil.exact({
  id: String,
  topic: oneOf('email.send', 'invoice.create'),
  attempts: Number,
  payload: Object,
});

const message = {
  id: 'msg_123',
  topic: 'email.send',
  attempts: 0,
  payload: { to: 'dana@example.com' },
};

const trustedMessage = QueueMessage.parse(message);

console.log('Queue message accepted:', trustedMessage.topic);
