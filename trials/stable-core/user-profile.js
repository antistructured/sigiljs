import { oneOf, optional, realType, sigil, union } from '../../src/index.js';

const UserProfile = sigil.exact(
  {
    id: String,
    email: String,
    displayName: optional(String),
    role: oneOf('admin', 'member', 'viewer'),
    reputation: union(Number, String),
  },
  { name: 'UserProfile', version: 'trial' },
);

const input = {
  id: 'usr_123',
  email: 'dana@example.com',
  role: 'member',
  reputation: 42,
};

const parsed = UserProfile.parse(input);
const safe = UserProfile.safeParse(input);
const invalid = UserProfile.safeParse({ ...input, role: 'owner' });
const asserted = UserProfile.assert(input);
const mock = UserProfile.mock({ seed: 7 });
const cases = UserProfile.cases();
const report = UserProfile.test(cases);

if (!safe.success) throw new Error('expected safeParse success');
if (invalid.success) throw new Error('expected invalid role to fail');
if (!UserProfile.check(mock)) throw new Error('mock should satisfy contract');
if (!report.success) throw new Error('generated cases should pass contract test');

console.log(
  JSON.stringify(
    {
      parsed,
      asserted,
      invalidPath: invalid.error.path,
      runtimeType: realType(parsed.reputation),
      descriptionKind: UserProfile.describe().kind,
      jsonSchemaType: UserProfile.toJSONSchema().type,
      typescriptIncludesName: UserProfile.toTypeScript('UserProfile').includes('UserProfile'),
      openapiType: UserProfile.toOpenAPI().type,
      cases: { valid: cases.valid.length, invalid: cases.invalid.length },
      report: report.success,
    },
    null,
    2,
  ),
);
