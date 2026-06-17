# SigilJS

Write types. Validate reality.

SigilJS is a tiny, dependency-free JavaScript library for describing and validating data shapes using **sigils** (inline type expressions).

No TypeScript compiler, no heavy schemas, and zero runtime dependencies. Just write your types as strings, and SigilJS compiles them into blazingly fast validator functions.

---

## Installation

Install using **Bun**:
```bash
bun add @antistructured/sigiljs
```

Or using **npm**:
```bash
npm install @antistructured/sigiljs
```

---

## Quick Example

```javascript
import { Sigil } from "@antistructured/sigiljs";

// 1. Define your data schema using backticks
const User = Sigil`
{
  name: string
  age?: number
  tags: string[]
}
`;

// 2. Validate data shapes (returns boolean)
User.check({
  name: "Alice",
  tags: ["admin", "dev"]
}); // true

User.check({
  name: "Bob",
  age: "thirty", // Wrong type!
  tags: []
}); // false
```

---

## Why SigilJS?

JavaScript runtime type checking is notoriously fragile:
1. `typeof` is notoriously weak and inconsistent (e.g., `typeof []` is `"object"`).
2. TypeScript types completely disappear at runtime, leaving you vulnerable to invalid API responses, bad database loads, and malformed client payloads.
3. Existing schema libraries (like Zod) require verbose builder chains and carry significant bundle sizes.

SigilJS solves this by giving you a **clean, string-based type DSL** that looks like standard TypeScript/flow but remains fully active and optimized at runtime.

---

## Sigil vs Zod

If you have used validation libraries like Zod, you might wonder how SigilJS compares. Zod is a robust, highly expressive builder library with a powerful ecosystem. However, SigilJS approach is built on a different developer philosophy:

* **Zod** uses an **expressive builder API** to construct validation trees.
* **SigilJS** uses **readable type expressions** that look like standard JavaScript/TypeScript types, compiled once into optimized runtime validator functions.

### Side-by-Side Comparison

```javascript
// Zod: Constructing a schema using method-chaining builders
import { z } from "zod";

const UserZod = z.object({
  name: z.string(),
  age: z.number().optional()
});

// SigilJS: Writing natural, readable type expressions
import { Sigil } from "@antistructured/sigiljs";

const UserSigil = Sigil`
{
  name: string
  age?: number
}
`;
```

| Feature | Zod | SigilJS |
|---------|-----|---------|
| **Philosophy** | Expressive builder API | Readable type expressions compiled to JS closures |
| **Syntax** | Method chaining (`z.string().optional()`) | Standard inline type DSL (``Sigil`string?```) |
| **Performance** | Runtime AST traversal | Compiled once to fast, cacheable validator functions |
| **Recursive Schemas** | Verbose `z.lazy()` wrapper | Native, lazy resolution using Named Sigils |
| **Bundle Size** | ~15-20kB gzipped | Tiny footprint (< 4kB), zero runtime dependencies |

---

## Core API

SigilJS exports the core `Sigil` class, along with two convenient single-letter aliases: `S` (recommended shorthand) and `T` (legacy/optional alias).

```javascript
import { Sigil, S, T, SigilValidationError } from "@antistructured/sigiljs";

// All three are identical:
const schema1 = Sigil`string`;
const schema2 = S`string`;
const schema3 = T`string`;
```

### `.check(value)`
Returns a boolean indicating if the value matches the schema.
```javascript
S`string`.check("hello"); // true
S`string`.check(123);     // false
```

### `.assert(value)`
Validates the data, returning `true` on success. On failure, it throws a structured `SigilValidationError` containing detailed diagnostic information:

```javascript
try {
  S`{ age: number }`.assert({ age: "thirty" });
} catch (error) {
  if (error instanceof SigilValidationError) {
    console.log(error.code);     // "SIGIL_VALIDATION_FAILED"
    console.log(error.message);  // "Expected property \"age\" to be number, got string"
    console.log(error.path);     // ["age"]
    console.log(error.expected); // "number"
    console.log(error.actual);   // "string"
  }
}
```

### Compiled Validators (`.validator` & `.compile()`)
Sigils are parsed and compiled once. If you want to bypass the Sigil instance overhead entirely on ultra-hot paths, you can retrieve the stable pre-compiled validator closure:

```javascript
const User = S`{ name: string }`;

// Retrieve the pre-compiled function
const validateUser = User.validator; // or User.compile()

validateUser({ name: "Dana" }); // true
```

---

## Exact Mode

By default, SigilJS runs in **Normal Mode**, allowing objects to have extra undeclared keys. To enforce strict shape matches where extra properties are disallowed, use **Exact Mode** via `Sigil.exact` (or `S.exact` / `T.exact`).

```javascript
// Normal Mode: allows extra keys
const NormalUser = S`{ name: string }`;
NormalUser.check({ name: "Dana", admin: true }); // true

// Exact Mode: rejects extra keys
const ExactUser = S.exact`{ name: string }`;
ExactUser.check({ name: "Dana", admin: true }); // false
```

Exact mode rules apply recursively down nested objects defined inside the exact block.

---

## Named Sigils & Composition

To build large, maintainable schemas or support self-referential/circular schemas, you can define globally-reusable named sigils using `Sigil.define` (or its alias `Sigil.named`).

```javascript
// 1. Register a named sigil in the registry
Sigil.define("Email")`string`;

Sigil.define("Address")`
{
  street: string
  city: string
}
`;

// 2. Compose them into larger schemas by referring to them by name
const User = S`
{
  name: string
  email: Email
  address: Address
}
`;
```

### Self-Referential / Recursive Schemas
Since names are resolved lazily at validation/compilation time, schemas can reference themselves or each other circularly:

```javascript
// Node references Node[]
Sigil.define("Node")`
{
  name: string
  children?: Node[]
}
`;
```

---

## `realType()`

SigilJS includes `realType()`, an advanced runtime type-detector that resolves the shortcomings of JavaScript's `typeof`.

```javascript
import { realType } from "@antistructured/sigiljs";

realType("hello");             // "string"
realType(42);                  // "number"
realType(NaN);                 // "nan"
realType(null);                // "null"
realType([]);                  // "array"
realType(new Map());           // "map"
realType(async () => {});      // "asyncfunction"
realType(function* () {});     // "generatorfunction"
```

### Custom Hooks
You can supply custom override hooks to map instances of custom classes back to nominal type strings:

```javascript
class DatabaseConnection {}
const conn = new DatabaseConnection();

realType(conn, {
  hooks: [
    val => val instanceof DatabaseConnection ? 'db_connection' : null
  ]
}); // "db_connection"
```

---

## Examples

To see runnable patterns, CLI setups, and advanced test suites, check the [examples/](examples/) directory.

---

## Roadmap

Upcoming additions to the SigilJS roadmap:
- [ ] **Sigil.partial**: Construct partial sub-schemas dynamically.
- [ ] **Format validation rules**: Regex support and common formats (e.g. uuid, ipv4).
- [ ] **Schema migrations / transformers**: Parse and transform input types into mapped runtime types.

---

## License

MIT
