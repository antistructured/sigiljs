/**
 * Type smoke test: TypeScript generic usage polish docs.
 *
 * Protects documented patterns from docs/typescript.md.
 */
import { oneOf, optional, sigil, type SigilCases } from '@weipertda/sigiljs';

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

const parsed: User = UserContract.parse({
  id: 'user_1',
  email: 'ada@example.com',
  role: 'admin',
});

const safe = UserContract.safeParse(parsed);
if (safe.success) {
  const user: User = safe.data;
  const role: 'admin' | 'user' = user.role;
  void role;
} else {
  const error: unknown = safe.error;
  void error;
}

const sample: User = UserContract.mock({ includeOptional: true });
const cases: SigilCases<User> = UserContract.cases();

for (const entry of cases.valid) {
  const value: User = entry.value;
  void value;
}

for (const entry of cases.invalid) {
  const value: unknown = entry.value;
  void value;
}

const report = UserContract.test(cases);
const ok: boolean = report.success;

const descriptionKind: string = UserContract.describe().kind;
const schema: Record<string, unknown> = UserContract.toJSONSchema();
const openapi: Record<string, unknown> = UserContract.toOpenAPI();
const declaration: string = UserContract.toTypeScript('User');

type EventEnvelope = {
  id: string;
  type: string;
};

const EventEnvelope = sigil<EventEnvelope>({
  id: String,
  type: String,
});

const event: EventEnvelope = EventEnvelope.parse({ id: 'evt_1', type: 'user.created' });

const UntypedUser = sigil.exact({
  id: String,
  email: String,
});
const untypedValue: unknown = UntypedUser.parse({ id: 'user_1', email: 'a@example.com' });

void sample;
void ok;
void descriptionKind;
void schema;
void openapi;
void declaration;
void event;
void untypedValue;

export {};
