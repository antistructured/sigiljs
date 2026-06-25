# Known Limitations

**Package:** `@weipertda/sigiljs` v0.10.0

This page documents current known limitations honestly. These are not bugs unless noted — they are constraints of the current design that are worth understanding before adopting SigilJS.

---

## CLI limitations

### `.sigil` template-literal loading is Bun-specific

The CLI's text-format contract parser (`compileSigil()`) uses the Bun template-literal path via `T(strings)`. Running `.sigil` file commands under plain Node.js may not work.

**Workaround:** Use `.sigil.js` JS module files — these use standard `import()` and work under both Bun and Node.js.

### JS module CLI loading relies on CWD-relative URL resolution

When loading `.sigil.js` files, the CLI resolves paths relative to `process.cwd()`. If you run `sigil` from a directory that isn't the project root, relative imports inside `.sigil.js` files may fail.

**Workaround:** Run CLI commands from the project root, or use absolute paths in `.sigil.js` module imports.

### No confirmed real-world CLI usage data

The CLI is experimental and has not been validated in large production workflows. Commands and flags may change before 1.0.0.

---

## API limitations

### No "at least one optional field" constraint

Update contracts like `{ name: optional(String), updatedAt: String }` will accept `{ updatedAt: '...' }` with no other fields. SigilJS cannot enforce "at least one optional field must be present." This constraint must be implemented in application logic.

### `serialize()` does not apply transforms

`contract.serialize(value)` validates but does not apply transforms. Use `contract.parse(value)` when you need transforms to run.

---

## Experimental surface limitations

### HTTP helpers are experimental

`httpContract()` is experimental. The input shape (`{ body, params, query, headers }`), response routing, and OpenAPI projection may change before 1.0.0.

### Form constraints are experimental

`toFormConstraints()` is experimental. The `{ fields }` wrapper shape, `path`, `label`, and nested/array behavior may change before 1.0.0.

### CLI workflows are experimental

The `sigil` bin is experimental. Commands, flags, and output formats may change before 1.0.0.

---

## Missing adapters

SigilJS intentionally provides no framework adapters. The following do not exist and are not planned for the current package:

- Framework-specific HTTP middleware (Express, Fastify, Hono)
- UI form component adapters (React, Vue, Svelte, Solid)
- ORM adapters (Prisma, Drizzle, Mongoose)
- AI provider SDK adapters (OpenAI, Anthropic, Mistral)
- Database drivers (pg, sqlite3, mysql2)

These are application-layer or future adapter-package concerns.

---

## Package split

No `@sigil/*` sub-packages exist yet. `@sigil/cli`, `@sigil/http`, `@sigil/forms`, `@sigil/db`, and `@sigil/ai` are planned but intentionally deferred until the core API stabilizes at 1.0.0.

---

## TypeScript

SigilJS is pure JavaScript with no TypeScript source. There are no `.d.ts` type declaration files currently published. TypeScript users can use `toTypeScript()` to generate types from contracts, but there is no automatic TypeScript inference.

---

## Mock data semantics

`mock()` generates type-correct values, not semantically meaningful ones. String fields get `'string'`, number fields get `0`, etc. The output is useful for contract-level tests but not for data that needs realistic values (email addresses, dates, names).
