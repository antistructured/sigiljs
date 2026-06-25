# Update Contracts

SigilJS can validate data as it crosses persistence boundaries, without becoming your ORM.

An update contract validates patch payloads before applying them to a stored record. Optional fields support partial updates — only the fields provided are validated and changed.

---

## Define an update contract

Use `optional()` for fields that can be changed, and require `updatedAt` to signal an intentional update:

```js
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const UserUpdate = sigil.exact({
  name: optional(String),
  role: optional(oneOf('admin', 'user')),
  updatedAt: String, // required — signals intentional update
});
```

---

## Validate update payloads

```js
// Full update
const fullPatch = { name: 'Alex W.', role: 'admin', updatedAt: new Date().toISOString() };
const update = UserUpdate.parse(fullPatch);

// Partial update — only name changes
const namePatch = { name: 'Alexander', updatedAt: new Date().toISOString() };
const nameUpdate = UserUpdate.parse(namePatch);
// nameUpdate.role → undefined (not changed)
```

---

## Applying a patch (application layer)

SigilJS validates the patch shape. The application layer merges it:

```js
const result = UserUpdate.safeParse(patchPayload);
if (!result.success) {
  return { ok: false, error: result.error.message };
}

// Merge — only spread defined (non-undefined) fields
const definedFields = Object.fromEntries(
  Object.entries(result.data).filter(([, v]) => v !== undefined),
);
const updatedRow = { ...existingRecord, ...definedFields };
await db.update('users', updatedRow);
```

---

## Extra field rejection

`sigil.exact()` rejects update payloads with unexpected fields:

```js
const result = UserUpdate.safeParse({
  name: 'Alex',
  updatedAt: now(),
  isAdmin: true, // not in update contract
});
// result.success → false — isAdmin not allowed
```

---

## Limitation — no "at least one field" constraint

SigilJS has no native "at least one optional field must be present" rule. A payload of `{ updatedAt: '...' }` with no other changes is technically valid.

If your application requires at least one non-timestamp field, enforce that in application logic:

```js
const update = UserUpdate.parse(patchPayload);
const hasChanges = Object.keys(update).some((k) => k !== 'updatedAt' && update[k] !== undefined);
if (!hasChanges) {
  throw new Error('Update must include at least one changed field');
}
```

---

## Non-goals

SigilJS does not:
- enforce "at least one optional field" constraints
- run UPDATE queries
- manage optimistic locking or versioning
- handle conflict resolution
