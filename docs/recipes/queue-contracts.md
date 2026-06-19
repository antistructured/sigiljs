# Queue Contracts

Define structure once. Project it everywhere.

## 1. Boundary problem

A queue worker receives unknown data that may have been produced by another service version. Enforce an executable contract before running the job.

## 2. Sigil contract

```js
import { oneOf, sigil } from 'sigil';

const QueueJob = sigil.exact({
  jobId: String,
  action: oneOf('send_email', 'process_report'),
  payload: {
    accountId: String,
  },
});
```

## 3. Unknown input

```js
const unknownJob = JSON.parse(queueMessage.body);
```

## 4. Enforcement using parse/safeParse/assert

```js
const result = QueueJob.safeParse(unknownJob);

if (!result.success) {
  await deadLetter(queueMessage, result.error);
  return;
}
```

## 5. Trusted output

```js
await runJob(result.data.action, result.data.payload);
```

## 6. Optional projection

```js
const queueContractDescription = QueueJob.describe();
```
