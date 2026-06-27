/**
 * Type smoke test: Prove pillar APIs
 */
import {
  sigil,
  optional,
  type SigilCaseEntry,
  type SigilCases,
  type SigilCasesOptions,
  type SigilMockOptions,
  type SigilTestReport,
} from '@weipertda/sigiljs';

type User = {
  name: string;
  age?: number;
};

const UserContract = sigil<User>({ name: String, age: optional(Number) });

const mockOptions: SigilMockOptions = {
  seed: 1,
  includeOptional: true,
  arrayLength: 2,
};

const casesOptions: SigilCasesOptions = {
  includeOptional: true,
};

const mockUser: User = UserContract.mock(mockOptions);
const generatedCases: SigilCases<User> = UserContract.cases(casesOptions);

const validCase: SigilCaseEntry<User> = generatedCases.valid[0];
const invalidCase: SigilCaseEntry<unknown> = generatedCases.invalid[0];

const validLabel: string = validCase.label;
const validValue: User = validCase.value;
const invalidLabel: string = invalidCase.label;
const invalidValue: unknown = invalidCase.value;

const report: SigilTestReport = UserContract.test(generatedCases);
const success: boolean = report.success;
const validPassed: number = report.valid.passed;
const invalidFailed: number = report.invalid.failed;
const failures: unknown[] = report.failures;

void mockUser;
void validLabel;
void validValue;
void invalidLabel;
void invalidValue;
void success;
void validPassed;
void invalidFailed;
void failures;

export {};
