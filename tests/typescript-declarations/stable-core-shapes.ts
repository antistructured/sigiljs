import {
  sigil,
  SigilValidationError,
  type SigilParseResult,
} from '../../index.js';

const User = sigil<{ name: string }>({ name: String });

const result: SigilParseResult<{ name: string }> = User.safeParse({ name: 'Ada' });

if (result.success) {
  const _name: string = result.data.name;
} else {
  const _error: unknown = result.error;
}

try {
  User.parse({ name: 123 });
} catch (error) {
  if (error instanceof SigilValidationError) {
    const _name: 'SigilValidationError' = error.name;
    const _code: 'SIGIL_VALIDATION_FAILED' = error.code;
    const _path: Array<string | number> = error.path;
    const _expected: string = error.expected;
    const _actual: unknown = error.actual;
    const json = error.toJSON();
    const _jsonCode: 'SIGIL_VALIDATION_FAILED' = json.code;
    const _jsonPath: Array<string | number> = json.path;
  }
}

export {};
