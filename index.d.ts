/**
 * @weipertda/sigiljs — TypeScript declarations
 *
 * SigilJS is written in JavaScript and ships conservative TypeScript
 * declarations for public API consumption. Declarations describe the
 * runtime API accurately. Deep generic inference from contract definition
 * objects is intentionally deferred — T defaults to `unknown` unless the
 * caller provides it explicitly.
 *
 * @see https://github.com/antistructured/sigiljs
 */

// ─── Core result types ─────────────────────────────────────────────────────

export type SigilParseResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: unknown };

// ─── Error type ────────────────────────────────────────────────────────────

export declare class SigilValidationError extends Error {
  readonly message: string;
  readonly name: 'SigilValidationError';
  readonly path: Array<string | number>;
  readonly code: 'SIGIL_VALIDATION_FAILED';
  readonly expected: string;
  readonly actual: unknown;
  toJSON(): {
    code: 'SIGIL_VALIDATION_FAILED';
    message: string;
    path: Array<string | number>;
    expected: string;
    actual: unknown;
  };
}

// ─── Description types ─────────────────────────────────────────────────────

export interface SigilDescription {
  kind: string;
  [key: string]: unknown;
}

export interface SigilDiffEntry {
  kind: string;
  path: string[];
  impact: 'breaking' | 'non-breaking' | 'unknown';
  contract?: SigilDescription;
  from?: unknown;
  to?: unknown;
}

// ─── Prove types ───────────────────────────────────────────────────────────

export interface SigilCaseEntry<T = unknown> {
  label: string;
  value: T;
  expectedPath?: string[];
  [key: string]: unknown;
}

export interface SigilCases<T = unknown> {
  valid: Array<SigilCaseEntry<T>>;
  invalid: Array<SigilCaseEntry<unknown>>;
}

export interface SigilTestGroup {
  passed: number;
  failed: number;
}

export interface SigilTestReport {
  success: boolean;
  valid: SigilTestGroup;
  invalid: SigilTestGroup;
  failures: unknown[];
}

export interface SigilMockOptions {
  seed?: number;
  includeOptional?: boolean;
  arrayLength?: number;
  [key: string]: unknown;
}

export interface SigilCasesOptions {
  includeOptional?: boolean;
  [key: string]: unknown;
}

// ─── Metadata ─────────────────────────────────────────────────────────────

export interface SigilMetadata {
  name?: string;
  version?: string;
  description?: string;
  tags?: string[];
  [key: string]: unknown;
}

// ─── Projection types ─────────────────────────────────────────────────────

export interface FormFieldConstraint {
  name: string;
  path: string[];
  type: string;
  required: boolean;
  label: string;
  options?: Array<string | number>;
  accepts?: string[];
  fields?: Record<string, FormFieldConstraint>;
  items?: FormFieldConstraint;
  [key: string]: unknown;
}

export interface FormConstraints {
  fields: Record<string, FormFieldConstraint>;
}

// ─── Contract instance ─────────────────────────────────────────────────────

export interface SigilContract<T = unknown> {
  /** Internal kind identifier. */
  readonly kind: string;

  // Enforce
  /** Returns true if value matches the contract, false otherwise. */
  check(value: unknown): boolean;
  /** Throws SigilValidationError if value does not match. Returns void. */
  assert(value: unknown): asserts value is T;
  /** Parses and returns the validated value. Throws SigilValidationError on failure. */
  parse(value: unknown): T;
  /** Parses without throwing. Returns { success, data } or { success, error }. */
  safeParse(value: unknown): SigilParseResult<T>;

  // Transform
  /** Returns a new contract with the given transform applied after validation. */
  transform(fn: (value: T) => unknown): SigilContract<T>;
  /** Validates and serializes value. Does not apply registered transforms. */
  serialize(value: unknown): T;

  // Metadata
  /** Returns a new contract with attached metadata. */
  withMetadata(metadata: SigilMetadata): SigilContract<T>;

  // Describe
  /** Returns the stable structural description of this contract. */
  describe(): SigilDescription;

  // Project
  /** Returns a JSON Schema representation of this contract. */
  toJSONSchema(options?: unknown): Record<string, unknown>;
  /** Returns a TypeScript type declaration string. */
  toTypeScript(name?: string, options?: unknown): string;
  /** Returns an OpenAPI schema object for this contract. */
  toOpenAPI(options?: unknown): Record<string, unknown>;
  /**
   * @experimental Returns form field metadata for object contracts.
   * May change before 1.0.0.
   */
  toFormConstraints(options?: unknown): FormConstraints;

  // Prove
  /** Generates a deterministic valid sample value. */
  mock(options?: SigilMockOptions): T;
  /** Generates structured valid and invalid test cases. */
  cases(options?: SigilCasesOptions): SigilCases<T>;
  /** Runs a contract proof against provided or generated cases. */
  test(cases?: SigilCases<unknown> | unknown): SigilTestReport;
  /** Returns a structural diff between this contract and another. */
  diff(other: SigilContract<unknown>): SigilDiffEntry[];

  // Compile
  /** Returns a compiled validator function for performance-critical paths. */
  compile(): (value: unknown) => boolean;

  // Version
  /** Returns a new contract pinned to the given version string. */
  version(v: string): SigilContract<T>;
}

// ─── Constructor namespace ────────────────────────────────────────────────

/**
 * Create a Sigil contract from a plain JavaScript definition object.
 *
 * The generic parameter T describes the validated output type.
 * It defaults to `unknown` — provide it explicitly for typed usage.
 *
 * @example
 * const User = sigil<{ name: string; age?: number }>({ name: String, age: optional(Number) });
 */
export declare function sigil<T = unknown>(
  definition: unknown,
  options?: SigilMetadata,
): SigilContract<T>;

export declare namespace sigil {
  /**
   * Create a strict contract that rejects unknown keys.
   *
   * @example
   * const User = sigil.exact<{ name: string }>({ name: String });
   */
  function exact<T = unknown>(
    definition: unknown,
    options?: SigilMetadata,
  ): SigilContract<T>;

}

/**
 * Advanced stable template-literal constructor.
 * Supports the Sigil`{ name: string }` template syntax.
 * Prefer sigil() or sigil.exact() in new object-definition docs and examples.
 */
export interface SigilTemplateFactory {
  (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): SigilContract<unknown>;
  exact(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): SigilContract<unknown>;
  meta(metadata: SigilMetadata): (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ) => SigilContract<unknown>;
  named(name: string): (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ) => SigilContract<unknown>;
  define(name: string): (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ) => SigilContract<unknown>;
  collection(
    definitions: Record<string, SigilContract<unknown>>,
  ): Readonly<Record<string, SigilContract<unknown>>>;
}

export declare const Sigil: SigilTemplateFactory;

/** @deprecated Use Sigil instead. Legacy alias. */
export declare const S: typeof Sigil;

/** @deprecated Use Sigil instead. Legacy alias. */
export declare const T: typeof Sigil;

// ─── Helper constructors ───────────────────────────────────────────────────

/**
 * Mark a field as optional in a contract definition.
 * Optional fields may be absent or undefined.
 */
export declare function optional(definition: unknown): unknown;

/**
 * Create a union type from multiple definitions.
 */
export declare function union(...definitions: unknown[]): unknown;

/**
 * Create a literal union (enum-style) type.
 * All values must be literal strings or numbers.
 *
 * @example
 * const Role = oneOf('admin', 'user');
 */
export declare function oneOf<T extends Array<string | number | boolean>>(
  ...values: T
): unknown;

/**
 * Compose a field-level transform pipeline.
 */
export declare function pipe(definition: unknown, ...transforms: unknown[]): unknown;

/**
 * String trimming transform for use with pipe().
 */
export declare function trim(): unknown;

// ─── Utilities ─────────────────────────────────────────────────────────────

/**
 * Detect the runtime type of a value as a descriptive string.
 * Returns strings like 'string', 'number', 'null', 'array', 'object', etc.
 */
export declare function realType(value: unknown): string;

/** @deprecated Use realType instead. */
export declare const real: typeof realType;

/** @deprecated Use realType instead. */
export declare const Real: typeof realType;

// ─── Experimental: HTTP boundary helpers ───────────────────────────────────

/**
 * @experimental May change before 1.0.0.
 *
 * Options for creating an HTTP boundary contract.
 */
export interface HttpContractOptions {
  /** Sigil contract for the request body. Required. */
  request: SigilContract<unknown>;
  /** Sigil contract for the primary response body. Required. */
  response: SigilContract<unknown>;
  /** Multi-status response map: status code → Sigil contract. */
  responses?: Record<string | number, SigilContract<unknown>>;
  /** Sigil contract for route params. */
  params?: SigilContract<unknown>;
  /** Sigil contract for query string values. */
  query?: SigilContract<unknown>;
  /** Sigil contract for request headers. */
  headers?: SigilContract<unknown>;
  /** HTTP method metadata (e.g. 'POST'). */
  method?: string;
  /** Route path metadata (e.g. '/users/:id'). */
  path?: string;
  /** OpenAPI summary string. */
  summary?: string;
  /** OpenAPI operationId string. */
  operationId?: string;
  [key: string]: unknown;
}

/**
 * @experimental May change before 1.0.0.
 *
 * Return object from httpContract().
 */
export interface HttpContract {
  readonly kind: 'sigil.httpContract';
  readonly method?: string;
  readonly path?: string;
  readonly summary?: string;
  readonly operationId?: string;
  readonly request: SigilContract<unknown>;
  readonly response: SigilContract<unknown>;
  readonly responses?: Record<string | number, SigilContract<unknown>>;
  readonly requestParts: Readonly<Record<string, SigilContract<unknown>>>;

  /** Validates structured request input { body?, params?, query?, headers? }. Throws on error. */
  parseRequest(input?: unknown): Record<string, unknown>;
  /** Non-throwing variant of parseRequest. */
  safeParseRequest(input?: unknown): SigilParseResult<Record<string, unknown>>;
  /** Validates response body or { status, body } structured input. Returns { status, body }. */
  parseResponse(input?: unknown): { status: number; body: unknown };
  /** Non-throwing variant of parseResponse. */
  safeParseResponse(input?: unknown): SigilParseResult<{ status: number; body: unknown }>;
  /** Validates and returns the response body. */
  serializeResponse(body: unknown): unknown;
  /** Non-throwing variant of serializeResponse. */
  safeSerializeResponse(body: unknown): SigilParseResult<unknown>;
  /** Returns operation-level OpenAPI shape (requestBody + responses). */
  toOpenAPI(): Record<string, unknown>;
  /** Returns path item shape { [path]: { [method]: operation } }. */
  toPathItem(): Record<string, unknown>;
  /** Wraps a function with request validation and response serialization. */
  handler<TReq = unknown, TRes = unknown>(
    fn: (request: TReq) => Promise<TRes> | TRes,
  ): (input: unknown) => Promise<TRes>;
}

/**
 * @experimental May change before 1.0.0.
 *
 * Creates a framework-neutral HTTP boundary contract.
 *
 * @example
 * const CreateUser = httpContract({
 *   method: 'POST',
 *   path: '/users',
 *   request: CreateUserRequest,
 *   response: UserResponse,
 * });
 */
export declare function httpContract(options: HttpContractOptions): HttpContract;
