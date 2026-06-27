# SigilJS TypeScript Type Model

**Status:** Internal design document — authoritative reference for `index.d.ts`  
**Package:** `@weipertda/sigiljs` v0.10.x  
**Source language:** Pure JavaScript ESM (no TypeScript source)  
**Goal:** Handwritten ambient declarations (`index.d.ts`), not a TypeScript conversion

---

## Overview

SigilJS is a runtime-first library. Types here are *structural descriptions* of
observable runtime shapes, not inferred from the definition object. The type
parameter `T` on `SigilContract<T>` is always **caller-asserted** — the library
does not derive `T` from the schema string or from `sigil()` definition objects.

---

## 1. `SigilContract<T>`

The central interface. Every tagged-template or `sigil()` call returns a frozen
object satisfying this interface.

```ts
interface SigilContract<T = unknown> {
  // ── Identity ────────────────────────────────────────────────────────────
  /** Discriminant: always `"sigil.contract"`. */
  readonly kind: 'sigil.contract';

  /** The name given via `Sigil.named(name)` or `Sigil.define(name)`, if any. */
  readonly name: string | undefined;

  /** The raw schema string the contract was compiled from. */
  readonly source: string;

  /** Alias for `source`; kept for legacy access patterns. */
  readonly raw: string;

  // ── Validation ───────────────────────────────────────────────────────────
  /**
   * Returns `true` when `value` satisfies the contract; `false` otherwise.
   * Never throws.
   */
  check(value: unknown, opts?: SigilParseOptions): boolean;

  /**
   * Asserts that `value` satisfies the contract.
   * Throws `SigilValidationError` on failure; returns `T` on success.
   */
  assert(value: unknown, opts?: SigilParseOptions): T;

  /**
   * Identical to `assert`: validates and returns `T`, applying any registered
   * transforms. Throws `SigilValidationError` on failure.
   */
  parse(value: unknown, opts?: SigilParseOptions): T;

  /**
   * Non-throwing variant of `parse`.
   * Returns a discriminated union result.
   */
  safeParse(value: unknown, opts?: SigilParseOptions): SigilParseResult<T>;

  /**
   * Alias for `assert`; intended for serialization boundaries where the value
   * is known-valid and you want the round-trip guarantee.
   */
  serialize(value: unknown, opts?: SigilParseOptions): T;

  // ── Projection ──────────────────────────────────────────────────────────
  /**
   * Returns a structural description of the contract AST.
   * Useful for introspection and custom projections.
   */
  describe(): SigilDescription;

  /** Projects the contract to a JSON Schema object. */
  toJSONSchema(options?: SigilJSONSchemaOptions): Record<string, unknown>;

  /**
   * Projects the contract to an OpenAPI-compatible schema object.
   * Structurally identical to `toJSONSchema` output for most contracts.
   */
  toOpenAPI(options?: SigilOpenAPIOptions): Record<string, unknown>;

  /**
   * Projects the contract to HTML form field metadata.
   * Only produces meaningful output for object contracts;
   * non-object contracts return `{ fields: {} }`.
   *
   * @experimental May change before 1.0.0.
   */
  toFormConstraints(options?: SigilFormConstraintsOptions): FormConstraints;

  /**
   * Projects the contract to a TypeScript type declaration string.
   *
   * @param name - Optional override for the generated type name.
   *               Falls back to `metadata.name` then `"Contract"`.
   * @returns A `type Name = ...` declaration string.
   */
  toTypeScript(name?: string, options?: SigilTypeScriptOptions): string;

  // ── Data generation ─────────────────────────────────────────────────────
  /**
   * Generates a structurally-valid mock value for this contract.
   * Optional properties are omitted by default; pass `includeOptional: true`
   * to include them.
   */
  mock(opts?: SigilMockOptions): T;

  /**
   * Generates a set of labeled valid and invalid test cases derived from
   * the contract structure.
   *
   * @experimental May change before 1.0.0.
   */
  cases(opts?: SigilCasesOptions): SigilCases<T>;

  // ── Testing ──────────────────────────────────────────────────────────────
  /**
   * Runs a `SigilCases<T>` object through the contract's `check` method and
   * returns a structured pass/fail report.
   *
   * When called with no argument (or `undefined`), `cases()` is called
   * internally to generate the test input.
   */
  test(cases?: SigilCases<T>): SigilTestReport;

  // ── Evolution ────────────────────────────────────────────────────────────
  /**
   * Returns a new contract with the transform applied after validation.
   * The transformed value is validated against the same contract shape, so the
   * declaration keeps the same `T` rather than promising a different output type.
   */
  transform(fn: (value: T) => unknown): SigilContract<T>;

  /**
   * Returns a new contract with the provided metadata merged in.
   * If the contract has a name, the updated contract is also registered
   * in the global registry.
   */
  withMetadata(meta: SigilMetadataOptions): SigilContract<T>;

  /**
   * Shorthand for `withMetadata({ version })`.
   */
  version(version: string): SigilContract<T>;

  /**
   * Diffs this contract (as "after") against `other` (as "before").
   * Returns an array of structural change entries.
   *
   * Currently supports object contracts only; throws for non-object shapes.
   */
  diff(other: SigilContract<unknown>): SigilDiffEntry[];

  // ── Internal / advanced ──────────────────────────────────────────────────
  /**
   * Returns the compiled validator function for this contract.
   * Intended for advanced consumers who need direct validator access.
   */
  compile(): (value: unknown) => boolean;
}
```

---

## 2. `SigilParseResult<T>`

Discriminated union returned by `safeParse`.

```ts
type SigilParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: unknown };
```

**Design notes:**
- The `success` discriminant is a boolean literal, enabling exhaustive
  narrowing with `if (result.success)`.
- `error` is typed as `SigilValidationError` (not generic `Error`) because
  `safeParse` is specifically a validation boundary — only validation failures
  are caught; internal bugs propagate as uncaught exceptions.

---

## 3. `SigilValidationError`

Class thrown by `assert`, `parse`, and `serialize` on validation failure.

```ts
class SigilValidationError extends Error {
  /** Always `"SigilValidationError"`. */
  readonly name: 'SigilValidationError';

  /**
   * Machine-readable error code.
   * Currently always `"SIGIL_VALIDATION_FAILED"`.
   */
  readonly code: string;

  /**
   * Key path to the field that failed validation.
   * Empty array `[]` means the root value failed.
   * Example: `["user", "age"]`
   */
  readonly path: string[];

  /**
   * Human-readable description of the expected type/shape.
   * Example: `"number"`
   */
  readonly expected: string | undefined;

  /**
   * Human-readable description of the actual type/shape received.
   * Example: `"string"`
   */
  readonly actual: string | undefined;

  /** Human-readable error message. */
  readonly message: string;

  constructor(
    details:
      | string
      | {
          message: string;
          path?: string[];
          expected?: string;
          actual?: string;
        },
    path?: string[],
    expected?: string,
    actual?: string,
  );

  /**
   * Returns a plain-object JSON shape suitable for structured logging or
   * API error responses.
   */
  toJSON(): {
    code: string;
    message: string;
    path: string[];
    expected: string | undefined;
    actual: string | undefined;
  };
}
```

**Design notes:**
- `path` is always an array (never `undefined`) at runtime — the constructor
  normalises missing paths to `[]`.
- `expected` and `actual` may be `undefined` for errors raised without type
  context (e.g. custom assertions).
- The class extends `Error`, so `instanceof SigilValidationError` works
  correctly.

---

## 4. `SigilDescription`

Return type of `contract.describe()`. Represents the structural AST of the
contract as a plain serialisable object.

```ts
interface SigilDescription {
  /** Discriminant string identifying the node kind. */
  kind: string;

  /** Any additional structural keys produced by the specific node kind. */
  [key: string]: unknown;
}
```

**Design notes:**
- The interface is intentionally open (`[key: string]: unknown`) because the
  actual shape varies by `kind` (`"object"`, `"array"`, `"union"`, `"literal"`,
  `"reference"`, `"string"`, `"number"`, etc.) and may include optional fields
  such as `properties`, `element`, `variants`, `value`, `exact`, and `metadata`.
- A narrow mapping of each `kind` value to its specific sub-shape is possible
  but creates maintenance overhead for minimal gain in a JS library. Callers
  who need precise shapes can narrow on `kind` themselves.
- The `metadata` key, when present, is of the shape described by
  `SigilMetadataOptions`.

---

## 5. `SigilCaseEntry<T>`

A single labeled test case within a `SigilCases<T>` collection.

```ts
/** A single test case expected to satisfy the contract. */
interface SigilValidCaseEntry<T> {
  /** Human-readable label for the test case. */
  label: string;

  /** A value that should pass validation. */
  value: T;
}

/** A single test case expected to fail the contract. */
interface SigilInvalidCaseEntry {
  /** Human-readable label for the test case. */
  label: string;

  /** A value that should fail validation. */
  value: unknown;

  /**
   * The key path within the value where the failure is expected to occur.
   * Absent for top-level failures where no specific path applies.
   */
  expectedPath?: string[];
}
```

**Design notes:**
- Valid and invalid case entries are typed separately because `value` has
  different semantics: `T` for valid cases, `unknown` for invalid ones.
- `expectedPath` on invalid entries mirrors the `path` field in
  `SigilValidationError`, but is advisory — the test runner does not assert
  on path, only on whether validation passes or fails.

---

## 6. `SigilCases<T>`

Return type of `contract.cases()`.

```ts
interface SigilCases<T> {
  /** Test cases expected to pass validation. */
  valid: SigilValidCaseEntry<T>[];

  /** Test cases expected to fail validation. */
  invalid: SigilInvalidCaseEntry[];
}
```

---

## 7. `SigilTestReport`

Return type of `contract.test(cases?)`.

```ts
interface SigilTestReport {
  /**
   * `true` if every valid case passed and every invalid case failed;
   * `false` if any case produced an unexpected result.
   */
  success: boolean;

  /** Aggregate counts for valid test cases. */
  valid: SigilTestGroup;

  /** Aggregate counts for invalid test cases. */
  invalid: SigilTestGroup;

  /**
   * Array of test cases that produced an unexpected result.
   * Each entry is a plain object with at minimum `kind`, `label`, and `value`.
   * The exact shape is implementation-defined; treat as `unknown[]` until
   * a stable structure is documented.
   */
  failures: unknown[];
}
```

---

## 8. `SigilTestGroup`

Sub-report within `SigilTestReport` for valid or invalid case buckets.

```ts
interface SigilTestGroup {
  /** Number of cases that produced the expected result. */
  passed: number;

  /** Number of cases that produced an unexpected result. */
  failed: number;
}
```

---

## 9. `SigilDiffEntry`

A single entry in the array returned by `contract.diff(other)`.

```ts
interface SigilDiffEntry {
  /**
   * The kind of structural change.
   *
   * Known values (non-exhaustive — treat remaining values as `string`):
   *   - `"property.added"`
   *   - `"property.removed"`
   *   - `"property.changed"`
   *   - `"property.required_changed"`
   *   - `"object.exact_changed"`
   *   - `"metadata.name_changed"`
   *   - `"metadata.version_changed"`
   *   - `"metadata.description_changed"`
   *   - `"metadata.tags_changed"`
   */
  kind: string;

  /**
   * Key path to the changed field within the contract object.
   * Example: `["user", "age"]`, or `["metadata", "version"]`
   */
  path: string[];

  /**
   * Characterises the breaking nature of the change from the perspective
   * of a consumer of the previous contract.
   *
   * - `"breaking"`:     consumers of the old contract will likely need updates.
   * - `"non-breaking"`: consumers of the old contract are unaffected.
   * - `"unknown"`:      impact cannot be determined statically (e.g. metadata,
   *                     literal-union value changes).
   */
  impact: 'breaking' | 'non-breaking' | 'unknown';

  /**
   * Present on `"property.added"` and `"property.removed"` entries.
   * The description of the contract that was added or removed.
   */
  contract?: SigilDescription;

  /**
   * Present on `"property.changed"`, `"property.required_changed"`,
   * `"object.exact_changed"`, and metadata diff entries.
   * The previous value of the changed field.
   */
  from?: unknown;

  /**
   * Present on `"property.changed"`, `"property.required_changed"`,
   * `"object.exact_changed"`, and metadata diff entries.
   * The new value of the changed field.
   */
  to?: unknown;
}
```

---

## 10. `FormConstraints` and `FormFieldConstraint`

Return type of `contract.toFormConstraints()`.

```ts
interface FormConstraints {
  /**
   * A map from field name to its constraint description.
   * For non-object contracts this will be an empty object `{}`.
   */
  fields: Record<string, FormFieldConstraint>;
}

/**
 * Describes the form-relevant constraints for a single field.
 * The `type` discriminant determines which additional keys are present.
 */
interface FormFieldConstraint {
  /** The field key in the source object. */
  name: string;

  /** The full key path from the root object to this field. */
  path: string[];

  /** Whether the field is required (not optional) in the contract. */
  required: boolean;

  /**
   * Human-readable label derived from the field key.
   * camelCase and snake_case are converted to Title Case.
   * Example: `"firstName"` → `"First Name"`
   */
  label: string;

  /**
   * The HTML-input-inspired type hint for this field.
   *
   * Known values:
   *   - `"text"`       — string fields and fallback
   *   - `"number"`     — number or bigint fields
   *   - `"checkbox"`   — boolean fields
   *   - `"select"`     — literal or all-literal union fields
   *   - `"array"`      — array fields
   *   - `"object"`     — nested object fields
   */
  type: 'text' | 'number' | 'checkbox' | 'select' | 'array' | 'object';

  /**
   * Present when `type` is `"select"`.
   * The list of valid literal option values.
   */
  options?: Array<string | number | boolean | null>;

  /**
   * Present when `type` is `"select"` and the field is a mixed union.
   * The full set of accepted input types.
   */
  accepts?: string[];

  /**
   * Present when `type` is `"array"`.
   * Constraint description for each array item.
   */
  items?: Omit<FormFieldConstraint, 'name' | 'path' | 'required' | 'label'>;

  /**
   * Present when `type` is `"object"`.
   * Nested field map for nested object properties.
   */
  fields?: Record<string, FormFieldConstraint>;
}
```

**Design notes:**
- `toFormConstraints` is marked `@experimental` in the source and may change
  before 1.0.0.
- The `type` values are HTML-input-inspired but carry no DOM dependency.
- `items` on array entries omits identity fields (`name`, `path`, `required`,
  `label`) because those are only meaningful at the named-field level.

---

## 11. `SigilMockOptions`

Options accepted by `contract.mock(opts?)`.

```ts
interface SigilMockOptions {
  /**
   * When `true`, optional fields (those not marked required in the contract)
   * are included in the generated mock value.
   * Default: `false`
   */
  includeOptional?: boolean;

  /**
   * Number of items to generate for array contracts.
   * Default: `1`
   */
  arrayLength?: number;
}
```

**Design notes:**
- The mock generator is deterministic — it always produces the same
  structurally-minimal value for a given contract and options. It is not a
  fuzzer.
- Array items are all identical (same generated value repeated `arrayLength`
  times).

---

## 12. `SigilMetadataOptions`

Shape accepted by `contract.withMetadata(meta)` and `Sigil.meta(metadata)`.

```ts
interface SigilMetadataOptions {
  /**
   * Human-readable display name for the contract.
   * Used as `title` in JSON Schema / OpenAPI output and as the default
   * TypeScript type name in `toTypeScript()`.
   */
  name?: string;

  /**
   * SemVer or freeform version string.
   * Surfaced as `x-version` in JSON Schema / OpenAPI output and as
   * `@version` in `toTypeScript()` JSDoc comments.
   */
  version?: string;

  /**
   * Freeform description of the contract's purpose.
   * Surfaced as `description` in JSON Schema / OpenAPI and in TypeScript
   * JSDoc comments.
   */
  description?: string;

  /**
   * Categorisation tags for grouping or filtering.
   * Surfaced as `x-tags` in JSON Schema / OpenAPI and as `@tags` in
   * TypeScript JSDoc comments.
   * Only string elements are retained; non-string elements are silently
   * dropped.
   */
  tags?: string[];
}
```

---

## 13. Auxiliary option types

These are thin option bags used by projection methods. They are all optional
arguments; the library currently ignores unknown keys.

```ts
/** Options for `toJSONSchema()`. Currently no stable keys defined. */
interface SigilJSONSchemaOptions {
  [key: string]: unknown;
}

/** Options for `toOpenAPI()`. Currently no stable keys defined. */
interface SigilOpenAPIOptions {
  [key: string]: unknown;
}

/** Options for `toFormConstraints()`. Currently no stable keys defined. */
interface SigilFormConstraintsOptions {
  [key: string]: unknown;
}

/** Options for `toTypeScript()`. Currently no stable keys defined. */
interface SigilTypeScriptOptions {
  [key: string]: unknown;
}

/** Options for `contract.cases()`. Currently no stable keys defined. */
interface SigilCasesOptions {
  /**
   * When `true`, optional fields are included in generated valid cases.
   * Default: `false`
   */
  includeOptional?: boolean;

  /**
   * Number of array items to generate per array field.
   * Default: `1`
   */
  arrayLength?: number;
}

/** Options forwarded to `parse`, `assert`, and `serialize`. */
interface SigilParseOptions {
  [key: string]: unknown;
}
```

---

## 14. Top-level exports

```ts
/**
 * Tagged template literal factory. Non-exact mode: extra object properties
 * are allowed.
 *
 * Usage:
 *   const contract = Sigil<User>`{ name: string, age: number }`;
 *
 * The generic `T` is caller-asserted. No inference from the schema string.
 * Defaults to `unknown`.
 */
declare function Sigil<T = unknown>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): SigilContract<T>;

declare namespace Sigil {
  /**
   * Exact mode: extra object properties that are not declared in the schema
   * cause validation to fail.
   */
  function exact<T = unknown>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): SigilContract<T>;

  /**
   * Returns a tagged template factory with `metadata` pre-applied.
   *
   * Usage:
   *   const contract = Sigil.meta({ name: 'User', version: '1.0.0' })`{ ... }`;
   */
  function meta<T = unknown>(
    metadata: SigilMetadataOptions,
  ): (strings: TemplateStringsArray, ...values: unknown[]) => SigilContract<T>;

  /**
   * Returns a tagged template factory that registers the contract in the
   * global registry under `name`.
   *
   * Usage:
   *   const User = Sigil.named('User')`{ name: string, age: number }`;
   */
  function named<T = unknown>(
    name: string,
  ): (strings: TemplateStringsArray, ...values: unknown[]) => SigilContract<T>;

  /** Alias for `Sigil.named`. */
  const define: typeof Sigil.named;

  /**
   * Creates a collection of mutually-referencing named contracts.
   * Members may reference each other by name within their schema strings.
   *
   * @param definitions - A map of name → tagged-template sigil contract.
   * @returns A frozen object with the same keys, each value a `SigilContract`.
   */
  function collection<T extends Record<string, SigilContract<unknown>>>(
    definitions: T,
  ): Readonly<T>;
}

/** Aliases for `Sigil`. */
declare const S: typeof Sigil;
declare const T: typeof Sigil;

// ── Definition-object API ────────────────────────────────────────────────────

/**
 * Object-definition style contract factory. Accepts plain JS objects, native
 * constructors (`String`, `Number`, etc.), `optional()`, `union()`, `oneOf()`,
 * `pipe()`, or another `SigilContract` as the definition.
 *
 * The generic `T` is caller-asserted. No inference from the definition object.
 * Defaults to `unknown`.
 */
declare function sigil<T = unknown>(
  definition: SigilDefinition,
  metadata?: SigilMetadataOptions,
): SigilContract<T>;

declare namespace sigil {
  /**
   * Exact-mode variant of `sigil()`.
   * Extra properties in object definitions cause validation to fail.
   */
  function exact<T = unknown>(
    definition: SigilDefinition,
    metadata?: SigilMetadataOptions,
  ): SigilContract<T>;
}

/**
 * The accepted definition argument for `sigil()`.
 * Intentionally broad — the library resolves the structure at runtime.
 */
type SigilDefinition =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | BigIntConstructor
  | SymbolConstructor
  | ArrayConstructor
  | ObjectConstructor
  | SigilContract<unknown>
  | SigilOptionalHelper
  | SigilUnionHelper
  | SigilOneOfHelper
  | SigilPipeHelper
  | { [key: string]: SigilDefinition | SigilOptionalHelper };

// ── Definition helpers ────────────────────────────────────────────────────────

/** Opaque helper returned by `optional()`. */
interface SigilOptionalHelper {
  readonly type: 'optional';
}

/** Opaque helper returned by `union()`. */
interface SigilUnionHelper {
  readonly type: 'union';
}

/** Opaque helper returned by `oneOf()`. */
interface SigilOneOfHelper {
  readonly type: 'oneOf';
}

/** Opaque helper returned by `pipe()`. */
interface SigilPipeHelper {
  readonly type: 'pipe';
}

/**
 * Marks a field as optional in a `sigil()` object definition.
 *
 * @param definition - The underlying field definition.
 */
declare function optional(definition: SigilDefinition): SigilOptionalHelper;

/**
 * Creates a union type in a `sigil()` object definition.
 * At least one definition is required.
 */
declare function union(...definitions: SigilDefinition[]): SigilUnionHelper;

/**
 * Creates a literal union (enum) from a set of primitive values.
 * Accepted value types: `string`, `number`, `boolean`, `null`.
 * At least one value is required.
 */
declare function oneOf(
  ...values: Array<string | number | boolean | null>
): SigilOneOfHelper;

/**
 * Attaches a transform pipeline to a specific field in a `sigil()` definition.
 * At least one transform function is required.
 */
declare function pipe(
  definition: SigilDefinition,
  ...transforms: Array<(value: unknown) => unknown>
): SigilPipeHelper;

/**
 * Returns a transform function that calls `String.prototype.trim()` on the
 * input. Intended for use with `pipe()`.
 *
 * @example
 *   const contract = sigil({ name: pipe(String, trim()) });
 */
declare function trim(): (value: string) => string;

// ── Utility exports ──────────────────────────────────────────────────────────

/**
 * Returns a precise, lowercase type string for any JavaScript value.
 * Fixes `typeof` gaps: `null → "null"`, `[] → "array"`, `NaN → "nan"`.
 *
 * @param value - Any JS value.
 * @param options - Optional hook list for custom type detection.
 */
declare function realType(
  value: unknown,
  options?: { hooks?: Array<(v: unknown) => string | null> },
): string;

/** Alias for `realType`. */
declare const real: typeof realType;
/** Alias for `realType`. */
declare const Real: typeof realType;

// ── HTTP contract ─────────────────────────────────────────────────────────────

/**
 * Creates a framework-neutral HTTP boundary contract.
 *
 * @experimental May change before 1.0.0.
 */
declare function httpContract<
  TRequest = unknown,
  TResponse = unknown,
>(options: HttpContractOptions<TRequest, TResponse>): HttpContract<TRequest, TResponse>;

interface HttpContractOptions<TRequest = unknown, TResponse = unknown> {
  /** Contract for the request body. Required. */
  request: SigilContract<TRequest>;
  /** Contract for the primary (e.g. 200) response body. Required. */
  response: SigilContract<TResponse>;
  /**
   * Multi-status response contracts keyed by HTTP status code.
   * When provided, `parseResponse` selects the matching contract by status.
   */
  responses?: Record<number | string, SigilContract<unknown>>;
  /** Contract for route path parameters. */
  params?: SigilContract<unknown>;
  /** Contract for query string parameters. */
  query?: SigilContract<unknown>;
  /** Contract for request headers. */
  headers?: SigilContract<unknown>;
  /** HTTP method metadata (e.g. `"POST"`). */
  method?: string;
  /** Route path metadata (e.g. `"/users/:id"`). */
  path?: string;
  /** OpenAPI summary string. */
  summary?: string;
  /** OpenAPI operationId string. */
  operationId?: string;
}

interface HttpContract<TRequest = unknown, TResponse = unknown> {
  readonly kind: 'sigil.httpContract';
  readonly method?: string;
  readonly path?: string;
  readonly summary?: string;
  readonly operationId?: string;
  readonly request: SigilContract<TRequest>;
  readonly response: SigilContract<TResponse>;
  readonly responses?: Record<number | string, SigilContract<unknown>>;

  /** Validates and parses all request parts (body, params, query, headers). */
  parseRequest(input?: Record<string, unknown>): Record<string, unknown>;

  /** Non-throwing variant of `parseRequest`. */
  safeParseRequest(input?: Record<string, unknown>): SigilParseResult<Record<string, unknown>>;

  /** Validates and parses the response body, selecting the matching status contract. */
  parseResponse(input: unknown): { status: number; body: TResponse };

  /** Non-throwing variant of `parseResponse`. */
  safeParseResponse(input: unknown): SigilParseResult<{ status: number; body: TResponse }>;

  /** Validates and returns the serialised response body. */
  serializeResponse(body: unknown): TResponse;

  /** Non-throwing variant of `serializeResponse`. */
  safeSerializeResponse(body: unknown): SigilParseResult<TResponse>;

  /** Projects the contract to an OpenAPI operation object. */
  toOpenAPI(): Record<string, unknown>;

  /**
   * Projects the contract to an OpenAPI path item object (keyed by route
   * path and method, if those are defined).
   */
  toPathItem(): Record<string, unknown>;

  /**
   * Wraps an async handler function. Validates the incoming request parts
   * before calling `fn`, and serializes the response body before returning.
   */
  handler<TInput = Record<string, unknown>>(
    fn: (parsedRequest: TInput) => Promise<unknown> | unknown,
  ): (input: TInput) => Promise<TResponse>;
}
```

---

## 15. Limitations

### T defaults to `unknown`
All generic positions (`SigilContract<T>`, `sigil<T>()`, `Sigil<T>`…) default
to `T = unknown`. This is intentional and conservative: the library validates
at runtime, not at compile time. Callers must explicitly assert the type:

```ts
const UserContract = sigil<User>({ name: String, age: Number });
```

There is no mechanism inside the library to *derive* `User` from the definition
object — JavaScript objects have no structural type-to-runtime shape bridging.

### No deep inference from definition objects
The `sigil()` function accepts a `SigilDefinition` which is a broad union type.
TypeScript cannot map `{ name: StringConstructor, age: NumberConstructor }` to
`{ name: string, age: number }` without a conditional-type mapping layer.

The type model deliberately does **not** include such mapping because:
1. It would require conditional types that explode in complexity for nested
   or recursive schemas.
2. `sigil()` supports runtime-constructed definitions that have no compile-time
   representation.
3. The inference could give a false sense of type safety at boundaries where
   runtime validation is the real guarantee.

If compile-time inference from definition objects is desired in the future, it
should be introduced as a separate, opt-in overload, clearly documented as
best-effort.

### `sigil()` generic is caller-asserted
The generic `T` on `sigil<T>()` is a *cast*, not a proof. TypeScript will
accept:

```ts
const contract = sigil<number>({ name: String }); // compiles, wrong at runtime
```

This is the same trade-off Zod, Valibot, and other schema libraries make when
they cannot infer from the definition. Sigil's runtime validation is the
authoritative correctness guarantee.

### `describe()` return type is open
`SigilDescription` uses `[key: string]: unknown` because the internal AST node
shapes are implementation details and may evolve before 1.0.0. Consumers who
need precise node shapes should treat them as `unknown` and narrow on `kind`.

### `failures` array in `SigilTestReport` is `unknown[]`
The exact shape of failure entries is an implementation detail of the test
runner. They are currently `{ kind: string, label: string, value: unknown }`
but this is not yet part of the stable public contract. Callers should not
destructure failure entries without a type guard.

### `diff()` is object-only
`contract.diff(other)` currently throws for non-object contracts. The method
signature does not encode this restriction; callers must be aware that only
object contracts support diffing.

### `httpContract` is experimental
The `httpContract` helper and `HttpContract` interface are marked
`@experimental` and may change before 1.0.0. The type declarations above
describe the current runtime shape but should be considered unstable.

---

## 16. Relationship to `index.d.ts`

This document is the **design source of truth** for the handwritten
`index.d.ts` ambient declaration file. When implementing `index.d.ts`:

1. Copy each interface/type/class declaration from this document directly
   into the `.d.ts` file under `declare module '@weipertda/sigiljs'` or as
   top-level ambient declarations, depending on the chosen module strategy.
2. Mark experimental APIs with `/** @experimental */` JSDoc in the `.d.ts`.
3. Do **not** add `declare module '*.js'` re-exports — the package uses
   `"exports": { ".": "./src/index.js" }` and consumers import the package
   name, not individual file paths.
4. The `SigilCasesOptions` interface should be validated against the
   `generateValid` / `generateCases` option destructuring (`includeOptional`,
   `arrayLength`) in `src/testing/generate.js` before publishing.
5. When `SigilParseOptions` gains stable documented keys, replace the open
   `[key: string]: unknown` index signature with explicit optional properties.
