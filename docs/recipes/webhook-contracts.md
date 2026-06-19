# Webhook Contracts

Define structure once. Project it everywhere.

## 1. Boundary problem

Webhook payloads are unknown data from another system. Verify signatures first, then enforce the payload contract before business logic runs.

## 2. Sigil contract

```js
import { oneOf, sigil } from 'sigil';

const BillingWebhook = sigil.exact({
  provider: oneOf('stripe'),
  topic: oneOf('invoice.paid', 'invoice.failed'),
  payload: {
    customerId: String,
    invoiceId: String,
  },
});
```

## 3. Unknown input

```js
const unknownWebhook = await request.json();
```

## 4. Enforcement using parse/safeParse/assert

```js
verifyWebhookSignature(request);
const webhook = BillingWebhook.parse(unknownWebhook);
```

## 5. Trusted output

```js
await handleBillingWebhook(webhook.topic, webhook.payload);
```

## 6. Optional projection

```js
const webhookProjection = BillingWebhook.toJSONSchema();
```
