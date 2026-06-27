/**
 * Type smoke test: stable core regression matrix
 *
 * Covers public declaration behavior for Define, Enforce, Transform,
 * Project, Prove, aliases, and experimental boundary exports.
 */
import {
  Real,
  S,
  Sigil,
  T,
  httpContract,
  oneOf,
  optional,
  pipe,
  real,
  realType,
  sigil,
  trim,
  union,
  type FormConstraints,
  type HttpContract,
  type SigilCases,
  type SigilContract,
  type SigilDescription,
  type SigilParseResult,
  type SigilTestReport,
} from '@weipertda/sigiljs';

type User = {
  id: number;
  name: string;
  email?: string;
  role: 'admin' | 'user';
};

const UserContract: SigilContract<User> = sigil.exact<User>({
  id: Number,
  name: pipe(String, trim()),
  email: optional(String),
  role: oneOf('admin', 'user'),
});

const TemplateContract: SigilContract<unknown> = Sigil`{ id: number, name: string }`;
const TemplateExact: SigilContract<unknown> = Sigil.exact`{ id: number }`;
const FromS: SigilContract<unknown> = S`{ name: string }`;
const FromT: SigilContract<unknown> = T`{ active: boolean }`;

const ParsedUser: User = UserContract.parse({
  id: 1,
  name: 'Ada',
  role: 'admin',
});

const Checked: boolean = UserContract.check(ParsedUser);
const SerializedUser: User = UserContract.serialize(ParsedUser);

let unknownValue: unknown = {
  id: 1,
  name: 'Ada',
  role: 'admin',
};
UserContract.assert(unknownValue);
const AssertedName: string = unknownValue.name;

const SafeResult: SigilParseResult<User> = UserContract.safeParse(unknownValue);
if (SafeResult.success) {
  const data: User = SafeResult.data;
  const role: 'admin' | 'user' = data.role;
  void role;
} else {
  const error: unknown = SafeResult.error;
  void error;
}

const Normalized: SigilContract<User> = UserContract.transform((value) => ({
  ...value,
  name: value.name.trim(),
}));

const Description: SigilDescription = UserContract.describe();
const JsonSchema: Record<string, unknown> = UserContract.toJSONSchema();
const TypeScriptOutput: string = UserContract.toTypeScript('User');
const OpenApiSchema: Record<string, unknown> = UserContract.toOpenAPI();
const FormOutput: FormConstraints = UserContract.toFormConstraints();

const MockUser: User = UserContract.mock({ includeOptional: true });
const Cases: SigilCases<User> = UserContract.cases({ includeOptional: true });
const Report: SigilTestReport = UserContract.test(Cases);
const ReportSuccess: boolean = Report.success;

const PrimitiveUnion = union(String, Number);
const LiteralUnion = oneOf('admin', 'user');
const OptionalString = optional(String);

const RuntimeType: string = realType([]);
const RuntimeTypeFromReal: string = real(null);
const RuntimeTypeFromRealAlias: string = Real({});

const Request = sigil<{ email: string }>({ email: String });
const Response = sigil<{ token: string }>({ token: String });
const LoginRoute: HttpContract = httpContract({
  method: 'POST',
  path: '/login',
  request: Request,
  response: Response,
});
const RequestResult: SigilParseResult<Record<string, unknown>> =
  LoginRoute.safeParseRequest({ body: { email: 'ada@example.com' } });
const ResponseResult: SigilParseResult<{ status: number; body: unknown }> =
  LoginRoute.safeParseResponse({ status: 200, body: { token: 't' } });

void TemplateContract;
void TemplateExact;
void FromS;
void FromT;
void Checked;
void SerializedUser;
void AssertedName;
void Normalized;
void Description;
void JsonSchema;
void TypeScriptOutput;
void OpenApiSchema;
void FormOutput;
void MockUser;
void Cases;
void ReportSuccess;
void PrimitiveUnion;
void LiteralUnion;
void OptionalString;
void RuntimeType;
void RuntimeTypeFromReal;
void RuntimeTypeFromRealAlias;
void RequestResult;
void ResponseResult;

export {};
