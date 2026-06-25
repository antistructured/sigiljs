# Insert Contracts

SigilJS can validate data as it crosses persistence boundaries, without becoming your ORM.

An insert contract validates caller-supplied fields before writing a new record. It does not include generated fields — IDs, timestamps, and auto-incremented values are the application or database layer's responsibility.

---

## Define a separate insert contract

The insert shape is different from the stored record shape. Use a separate contract:

```js
import { oneOf, sigil } from '@weipertda/sigiljs';

// Stored record — includes all persisted columns
const UserRecord = sigil.exact({
  id: String,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
  createdAt: String,
  updatedAt: String,
});

// Insert input — only caller-supplied fields
const NewUser = sigil.exact({
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});
```

---

## Validate before insert

```js
const input = { email: 'alex@example.com', name: 'Alex', role: 'user' };

// Trust boundary — validate caller input before writing
const validated = NewUser.parse(input);

// Application layer adds generated fields
const rowToInsert = {
  id: generateId(),       // your ID strategy
  ...validated,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

await db.insert('users', rowToInsert);
```

SigilJS validates. Your application layer owns IDs and timestamps.

---

## Using safeParse for insert validation

```js
const result = NewUser.safeParse(userInput);

if (!result.success) {
  return { ok: false, error: result.error.message, field: result.error.path?.at(-1) };
}

const rowToInsert = { id: generateId(), ...result.data, createdAt: now(), updatedAt: now() };
```

---

## Normalize before insert with transform()

Use `transform()` to normalize input before writing:

```js
const NormalizedNewUser = NewUser.transform((data) => ({
  ...data,
  email: data.email.toLowerCase().trim(),
  name: data.name.trim(),
}));

// parse() validates AND applies transforms in one step
const normalized = NormalizedNewUser.parse(rawInput);
```

---

## Extra field rejection

`sigil.exact()` rejects inputs with unexpected fields. This catches cases where a caller accidentally includes a generated field (e.g. passes `id` from a previous request):

```js
const result = NewUser.safeParse({
  email: 'a@b.com',
  name: 'Alex',
  role: 'user',
  id: 'user_leaked_from_client', // unexpected
});
// result.success → false
```

---

## Non-goals

SigilJS does not:
- generate IDs or timestamps
- insert records into databases
- manage auto-increment or sequence values
- replace an ORM or query builder
