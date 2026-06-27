/**
 * Type smoke test: basic contract usage
 * Tests that the core API types are usable and correct.
 */
import {
  sigil,
  optional,
  oneOf,
  union,
  pipe,
  trim,
  realType,
  SigilValidationError,
  type SigilContract,
  type SigilParseResult,
  type SigilDescription,
  type SigilDiffEntry,
} from '@weipertda/sigiljs';

// sigil() returns SigilContract<unknown> by default
const UserUntyped = sigil({ name: String, age: optional(Number) });
const _u1: SigilContract<unknown> = UserUntyped;

// Caller can assert T explicitly
const User: SigilContract<{ name: string; age?: number }> = sigil<{
  name: string;
  age?: number;
}>({ name: String, age: optional(Number) });
const _u2: SigilContract<{ name: string; age?: number }> = User;

// sigil.exact
const StrictUser = sigil.exact<{ email: string }>({ email: String });
const _u3: SigilContract<{ email: string }> = StrictUser;

// Enforce
const parsed: { name: string; age?: number } = User.parse({ name: 'Alex' });
const _p: string = parsed.name;

const safeResult: SigilParseResult<{ name: string; age?: number }> = User.safeParse({ name: 'Alex' });
if (safeResult.success) {
  const _data: { name: string; age?: number } = safeResult.data;
} else {
  if (safeResult.error instanceof SigilValidationError) {
    const _err: SigilValidationError = safeResult.error;
    const _msg: string = safeResult.error.message;
  }
}

const _checked: boolean = User.check({ name: 'Alex' });
User.assert({ name: 'Alex' }); // asserts value is T

// Transform
const Normalized = User.transform((d) => ({ ...d, name: d.name.toUpperCase() }));
const _norm: SigilContract<{ name: string; age?: number }> = Normalized;

// Describe
const desc: SigilDescription = User.describe();
const _kind: string = desc.kind;

// Diff
const User2 = sigil<{ name: string; email: string }>({ name: String, email: String });
const diff: SigilDiffEntry[] = User.diff(User2);
if (diff.length > 0) {
  const entry: SigilDiffEntry = diff[0];
  const _impact: 'breaking' | 'non-breaking' | 'unknown' = entry.impact;
  const _path: string[] = entry.path;
}

// Projections
const _jsonSchema: Record<string, unknown> = User.toJSONSchema();
const _tsType: string = User.toTypeScript('User');
const _openapi: Record<string, unknown> = User.toOpenAPI();
const _form = User.toFormConstraints();
const _fields = _form.fields;

// Utilities
const _type: string = realType('hello');
const _type2: string = realType(null);
const _type3: string = realType([]);

// optional, oneOf, union, pipe, trim
const _opt = optional(String);
const _oneOf = oneOf('admin', 'user');
const _union = union(String, Number);
const _piped = pipe(String, trim());

// withMetadata
const Versioned = User.withMetadata({ name: 'User', version: '1.0.0' });
const _v: SigilContract<{ name: string; age?: number }> = Versioned;

// compile
const _compiled: (value: unknown) => boolean = User.compile();
const _result: boolean = _compiled({ name: 'Alex' });

// serialize
const _serialized: { name: string; age?: number } = User.serialize({ name: 'Alex' });

export {};
