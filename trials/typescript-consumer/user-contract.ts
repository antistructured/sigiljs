import { oneOf, optional, sigil, type SigilContract } from '@weipertda/sigiljs';

type UserProfile = {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'member' | 'viewer';
};

const UserProfileContract: SigilContract<UserProfile> = sigil.exact<UserProfile>({
  id: String,
  email: String,
  displayName: optional(String),
  role: oneOf('admin', 'member', 'viewer'),
});

const parsed: UserProfile = UserProfileContract.parse({
  id: 'usr_1',
  email: 'dana@example.com',
  role: 'member',
});

const result = UserProfileContract.safeParse({
  id: 'usr_2',
  email: 'alex@example.com',
  role: 'admin',
});

if (result.success) {
  const role: UserProfile['role'] = result.data.role;
  void role;
} else {
  const error: unknown = result.error;
  void error;
}

const schema: Record<string, unknown> = UserProfileContract.toJSONSchema();
const declaration: string = UserProfileContract.toTypeScript('UserProfile');
const openapi: Record<string, unknown> = UserProfileContract.toOpenAPI();
const mock: UserProfile = UserProfileContract.mock();
const cases = UserProfileContract.cases();
const proof = UserProfileContract.test(cases);
const proofSuccess: boolean = proof.success;

void parsed;
void schema;
void declaration;
void openapi;
void mock;
void proofSuccess;

// Conservative inference limitation: without a generic, output is unknown.
const Untyped = sigil.exact({ id: String });
const untypedParsed: unknown = Untyped.parse({ id: 'usr_3' });
void untypedParsed;
