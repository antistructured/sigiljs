# Type Surface Audit — @weipertda/sigiljs v0.10.0

> **Generated:** 2026-06-26
> **Status:** Pre-declaration — no `.d.ts` files exist yet. Package `types` field is **not set**.

---

## 1. Package Entry Point State

| Field | Current value |
|-------|---------------|
| `"exports"` | `{ ".": "./src/index.js" }` |
| `"main"` | `"./src/index.js"` |
| `"types"` | *(not set)* |
| Existing `.d.ts` files | **None** |

TypeScript consumers currently receive no type information. The package has no declaration files and does not point to any via the `types` / `typings` field.

---

## 2. Public Named Exports

Sourced from `src/index.js`. Aliases (`S`, `T`, `real`, `Real`) are re-exported from the same binding and do not need separate declaration entries — they alias the canonical export in the declaration file.

| Export | Kind | Canonical? | Notes |
|--------|------|-----------|-------|
| `Sigil` | class | ✅ Yes | Primary contract class |
| `S` | alias | — | Alias for `Sigil` |
| `T` | alias | — | Alias for `Sigil` |
| `sigil` | function | ✅ Yes | Factory — creates a `Sigil` from an object definition |
| `optional` | function | ✅ Yes | Wraps a contract to make its value optional |
| `union` | function | ✅ Yes | Creates a union contract over two or more contracts |
| `oneOf` | function | ✅ Yes | Creates a discriminated-union contract |
| `pipe` | function | ✅ Yes | Chains transform contracts in sequence |
| `trim` | function | ✅ Yes | String-trimming transform helper |
| `httpContract` | function | ✅ Yes | Builds an HTTP boundary contract |
| `realType` | function | ✅ Yes | Infers a Sigil contract from a plain JS runtime value |
| `real` | alias | — | Alias for `realType` |
| `Real` | alias | — | Alias for `realType` |
| `SigilValidationError` | class | ✅ Yes | Error thrown on validation failure |

**Canonical public exports (8 unique):** `Sigil`, `sigil`, `optional`, `union`, `oneOf`, `pipe`, `trim`, `httpContract`, `realType`, `SigilValidationError`

---

## 3. Contract Instance — Public Methods

Instances of `Sigil` (created via `new Sigil(...)` or the `sigil()` factory) expose the following public API surface. Internal accessors (`ast`, `raw`, `source`, `validator`, `normalized`, `options`) are deliberately excluded from the declaration surface.

| Method | Return shape | Stability | Notes |
|--------|-------------|-----------|-------|
| `parse(value)` | `T` | Stable | Validates and returns typed value; throws `SigilValidationError` on failure |
| `safeParse(value)` | `{ success: true; data: T } \| { success: false; error: unknown }` | Stable | Non-throwing parse |
| `assert(value)` | `void` | Stable | Throws `SigilValidationError` if invalid |
| `check(value)` | `boolean` | Stable | Returns `true` if value is valid |
| `serialize(value)` | `unknown` | Stable | Serializes a typed value to a wire-safe form |
| `transform(fn)` | `Sigil` | Stable | Returns new contract with a transform step appended |
| `compile()` | `string` | Stable | Returns compiled validation source string |
| `name` | `string` | Stable | Contract display name (property, not method) |
| `kind` | `string` | Stable | Contract kind identifier (property, not method) |
| `version` | `string` | Stable | SigilJS version string (property, not method) |
| `describe()` | `{ kind: string; [key: string]: unknown }` | Stable | Returns structured description of the contract |
| `diff(other)` | `DiffEntry[]` | Stable | Compares two contracts; returns array of change descriptors |
| `mock()` | `T` | Stable | Generates a mock value satisfying the contract |
| `toJSONSchema()` | `object` | Stable | Returns a JSON Schema (draft-07) object |
| `toOpenAPI()` | `object` | Stable | Returns an OpenAPI 3.x schema object |
| `toTypeScript()` | `string` | Stable | Returns a TypeScript type string |
| `toFormConstraints()` | `object` | Stable | Returns HTML form constraint attributes |
| `withMetadata(meta)` | `Sigil` | Stable | Returns new contract with merged metadata |
| `cases()` | `{ valid: ValidCase[]; invalid: InvalidCase[] }` | Experimental | Returns labelled test cases for the contract |
| `test(value?)` | `TestResult` | Experimental | Runs built-in test cases; returns pass/fail summary |

### Internal accessors (excluded from public declaration)

These are present on instances but are considered implementation details:

`ast`, `raw`, `source`, `validator`, `normalized`, `options`

---

## 4. Return Type Shapes

### `safeParse`
```ts
type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: unknown };
```

### `describe`
```ts
interface DescribeResult {
  kind: string;
  [key: string]: unknown;
}
```

### `diff`
```ts
type DiffImpact = 'breaking' | 'non-breaking' | 'unknown';

interface DiffEntry {
  kind: string;
  path: string[];
  contract?: unknown;
  impact: DiffImpact;
  [key: string]: unknown;
}
```

### `cases`
```ts
interface ValidCase {
  label: string;
  value: unknown;
  [key: string]: unknown;
}

interface InvalidCase {
  label: string;
  value: unknown;
  expectedPath?: string[];
  [key: string]: unknown;
}

interface CasesResult {
  valid: ValidCase[];
  invalid: InvalidCase[];
}
```

### `test`
```ts
interface TestCounts {
  passed: number;
  failed: number;
}

interface TestResult {
  success: boolean;
  valid: TestCounts;
  invalid: TestCounts;
  failures: unknown[];
}
```

---

## 5. `SigilValidationError` Properties

Extends `Error`. All properties are set in the constructor.

| Property | Type | Notes |
|----------|------|-------|
| `name` | `'SigilValidationError'` | Literal string; overrides `Error.name` |
| `code` | `'SIGIL_VALIDATION_FAILED'` | Always this literal; machine-readable discriminant |
| `message` | `string` | Human-readable description (inherited from `Error`) |
| `path` | `string[]` | Key path to the failing field (e.g. `['user', 'age']`) |
| `expected` | `string` | Type that was required |
| `actual` | `string` | Type that was received |
| `toJSON()` | `() => { code, message, path, expected, actual }` | Structured JSON for logging / API responses |

---

## 6. `httpContract` Return Object Shape

```ts
interface HttpContract {
  kind: 'http';
  method?: string;
  path?: string;
  request: Sigil;
  response: Sigil;
  requestParts: {
    params?: Sigil;
    query?: Sigil;
    body?: Sigil;
    headers?: Sigil;
  };
  responses?: Record<string, Sigil>;

  // Parsing
  parseRequest(req: unknown): unknown;
  safeParseRequest(req: unknown): SafeParseResult<unknown>;
  parseResponse(res: unknown): unknown;
  safeParseResponse(res: unknown): SafeParseResult<unknown>;

  // Serialization
  serializeResponse(res: unknown): unknown;
  safeSerializeResponse(res: unknown): SafeParseResult<unknown>;

  // OpenAPI / routing
  toOpenAPI(): object;
  toPathItem(): object;

  // Framework integration
  handler(impl: (parsed: unknown) => unknown): unknown;
}
```

---

## 7. Stability Classification

| Symbol / Group | Classification | Rationale |
|----------------|---------------|-----------|
| `Sigil` class | **Stable** | Core type; public since inception |
| `sigil()` factory | **Stable** | Primary user-facing constructor |
| `optional`, `union`, `oneOf` | **Stable** | Core combinators |
| `pipe`, `trim` | **Stable** | Transform helpers |
| `SigilValidationError` | **Stable** | Thrown by all public validation paths |
| `realType` | **Stable** | Documented public API |
| `httpContract` | **Stable** | Documented public API |
| `.parse()`, `.safeParse()`, `.assert()`, `.check()` | **Stable** | Core validation methods |
| `.serialize()`, `.transform()`, `.compile()` | **Stable** | Core transform/compile methods |
| `.describe()`, `.diff()`, `.withMetadata()` | **Stable** | Introspection / schema evolution |
| `.toJSONSchema()`, `.toOpenAPI()`, `.toTypeScript()` | **Stable** | Projection methods |
| `.toFormConstraints()` | **Stable** | Projection method |
| `.mock()` | **Stable** | Test-data helper |
| `.name`, `.kind`, `.version` | **Stable** | Read-only metadata properties |
| `.cases()` | **Experimental** | Test-case generation; shape may evolve |
| `.test()` | **Experimental** | Built-in test runner; shape may evolve |
| CLI bin (`sigil`) | **Experimental** | Terminal tool; no programmatic API |

---

## 8. Recommended Declaration Scope

Based on the audit above, the initial `index.d.ts` should cover:

1. **All canonical public exports** — `Sigil`, `sigil`, `optional`, `union`, `oneOf`, `pipe`, `trim`, `httpContract`, `realType`, `SigilValidationError` plus aliases
2. **All stable `Sigil` instance methods** — as listed in §3
3. **Experimental methods** (`cases`, `test`) — included but annotated with `@experimental` JSDoc tag
4. **All supporting return-type interfaces** — `SafeParseResult`, `DiffEntry`, `CasesResult`, `TestResult`, `HttpContract`, etc.
5. **`SigilValidationError`** — full class declaration including `toJSON()`

**Out of scope for initial declaration:**
- Internal accessors (`ast`, `raw`, `source`, `validator`, `normalized`, `options`)
- Deep generic inference from `sigil()` object definitions (requires conditional types; deferred to a future revision)
- CLI bin (`sigil`) — see `type-cli-decision.md`
