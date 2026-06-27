# TypeScript Usage

SigilJS is written in JavaScript and ships TypeScript declarations for consumers through `index.d.ts`.

The declarations are intentionally conservative: they describe the public runtime API accurately, but they do not deeply infer precise object shapes from every contract definition. For precise static return types, pass an explicit generic.

---

## Recommended pattern

```ts
import { oneOf, optional, sigil } from '@weipertda/sigiljs';

type User = {
  id: string;
  email: string;
  role: 'admin' | 'user';
  age?: number;
};

const UserContract = sigil.exact<User>({
  id: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});
```

`UserContract` is a `SigilContract<User>`.

---

## `sigil<T>()`

Use `sigil<T>()` when extra fields are allowed by the runtime contract and you still want typed parse results:

```ts
type EventEnvelope = {
  id: string;
  type: string;
};

const EventEnvelope = sigil<EventEnvelope>({
  id: String,
  type: String,
});

const event: EventEnvelope = EventEnvelope.parse(input);
```

---

## `sigil.exact<T>()`

Use `sigil.exact<T>()` when unknown keys should be rejected at runtime:

```ts
type LoginRequest = {
  email: string;
  password: string;
};

const LoginRequest = sigil.exact<LoginRequest>({
  email: String,
  password: String,
});

const trusted: LoginRequest = LoginRequest.parse(input);
```

---

## `safeParse()` narrowing

`safeParse()` returns a discriminated union:

```ts
const result = UserContract.safeParse(input);

if (result.success) {
  const user: User = result.data;
  user.role; // 'admin' | 'user'
} else {
  const error: unknown = result.error;
  console.error(error);
}
```

The failure branch uses `unknown` for safety because experimental helpers may surface non-core error objects.

---

## `parse()` return type

`parse()` returns `T` and throws on invalid input:

```ts
const user: User = UserContract.parse(input);
```

For transformed contracts, runtime behavior still validates the transformed output against the same contract shape, so the declaration keeps the same `T`.

---

## Prove helper types

`mock()` returns `T`:

```ts
const sample: User = UserContract.mock({ includeOptional: true });
```

`cases()` returns `{ valid, invalid }`, not a flat array:

```ts
const cases = UserContract.cases();

for (const entry of cases.valid) {
  const value: User = entry.value;
  void value;
}

for (const entry of cases.invalid) {
  const value: unknown = entry.value;
  void value;
}
```

`test()` returns a summary object:

```ts
const report = UserContract.test(cases);
const ok: boolean = report.success;
```

---

## Projection return types

Projection methods intentionally return broad types:

```ts
const description = UserContract.describe();
const schema: Record<string, unknown> = UserContract.toJSONSchema();
const openapi: Record<string, unknown> = UserContract.toOpenAPI();
const declaration: string = UserContract.toTypeScript('User');
```

Use `toTypeScript()` when you want generated declaration text for another consumer or artifact. Use `sigil<T>()` / `sigil.exact<T>()` when writing TypeScript application code against the runtime contract object.

---

## Conservative inference limitation

Without an explicit generic, contract output defaults to `unknown`:

```ts
const UntypedUser = sigil.exact({
  id: String,
  email: String,
});

const value = UntypedUser.parse(input); // unknown
```

This is intentional for now. Deep object-definition inference is deferred until real TypeScript usage identifies valuable low-risk improvements.

---

## What TypeScript declarations do not do yet

They do not currently provide:

- deep inference from arbitrary object definitions
- semantic validation types such as email/date/range constraints
- provider-specific AI schema typing
- framework adapter types

SigilJS remains JavaScript-first at runtime and TypeScript-friendly at package boundaries.
