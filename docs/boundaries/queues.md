# Queue boundaries

Queue jobs travel through producers and consumers.
The job body should be trusted at the consumer boundary,
and can be kept inside a contract at the producer boundary.

Use `parse()` at the consumer so invalid jobs fail quickly.
Use `serialize()` when pushing work back into the queue
so the stored payload matches the contract.

## Recommended style

```js
const SendEmailJob = sigil.exact({
  jobId: String,
  action: 'send_email',
  payload: {
    to: String,
    subject: String,
    body: String,
  },
});
```

## Consumer side

```js
const job = await queue.get('emails');
const framed = SendEmailJob.assert(job);
```

Queue boundaries are useful for:

- email and notification queues
- report generation jobs
- one-off background tasks
- retryable worker payloads
- shape enforcement across language runtimes
