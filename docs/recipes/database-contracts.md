# Database Contracts

Define structure once. Project it everywhere.

## 1. Boundary problem

Rows from a database adapter are runtime data crossing a system boundary. Treat them as unknown data until an executable contract confirms the shape your app expects.

## 2. Sigil contract

```js
import { optional, sigil } from '@weipertda/sigiljs';

const TicketRow = sigil.exact({
  id: Number,
  title: String,
  createdBy: String,
  archived: optional(Boolean),
});
```

## 3. Unknown input

```js
const row = await db.get('select * from tickets where id = ?', [ticketId]);
```

## 4. Enforcement using parse/safeParse/assert

```js
const ticket = TicketRow.parse(row);
```

## 5. Trusted output

```js
renderTicket(ticket);
```

## 6. Optional projection

```js
const rowContractDescription = TicketRow.describe();
```
