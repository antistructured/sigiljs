# Public Release Notes — 0.18.x

**Package:** `@weipertda/sigiljs`  
**Release version:** `0.18.0`  
**Release theme:** Public 0.x release prep

---

## Core Message

SigilJS is ready for broader public 0.x usage, but not yet a 1.0.0 release.

This release prepares the public package line for serious use and feedback without stabilizing experimental edges prematurely.

---

## Highlights

- Prepared package metadata for the `0.18.0` public release target.
- Polished README status and public quick-map guidance.
- Improved docs navigation for new users.
- Verified the quickstart and recipe first-run path.
- Made npm package contents intentional:
  - public docs ship
  - public examples ship
  - internal release/audit reports do not ship
  - trials remain repo-only validation evidence
- Added public release notes and changelog entry.
- Reviewed known limitations and experimental surfaces.
- Preserved zero runtime dependencies.
- Preserved single-package architecture.

---

## Stable Core Status

The stable core is ready for broader public `0.x` feedback.

The five public pillars remain:

1. Define
2. Enforce
3. Transform
4. Project
5. Prove

Representative stable-core APIs:

- `sigil()` / `sigil.exact()`
- `Sigil` advanced template API
- `optional()`, `union()`, `oneOf()`
- `pipe()`, `trim()`
- `parse()`, `safeParse()`, `assert()`, `check()`
- `transform()`, `serialize()`
- `describe()`, `toJSONSchema()`, `toTypeScript()`, `toOpenAPI()`
- `mock()`, `cases()`, `test()`, `diff()`
- `realType()`
- `SigilValidationError`

---

## TypeScript Support

SigilJS remains plain JavaScript at runtime and ships TypeScript declarations through:

```json
"types": "./index.d.ts"
```

TypeScript support is consumer-oriented and conservative:

- explicit generics such as `sigil.exact<User>(...)` are supported
- `safeParse()` narrows success/failure results
- projection and prove helpers are declared
- deep object-definition inference remains deferred

See `docs/typescript.md`.

---

## CLI Status

The `sigil` CLI remains experimental.

It is useful for public `0.x` workflows, but these are not frozen before 1.0:

- command names
- flags
- output shapes
- exit-code guarantees
- CWD/module-loading behavior
- `.sigil` text-file compatibility

For real projects, prefer `.sigil.js` JavaScript module contract files while the CLI remains experimental.

---

## HTTP / Form Experimental Status

The following remain experimental:

- `httpContract()`
- `contract.toFormConstraints()`

They are intentionally available for real feedback, but their exact adapter expectations, response/request semantics, metadata shapes, and projection details may change before 1.0.

---

## Known Limitations

Known limitations remain public and intentional:

- no `1.0.0` stability claim yet
- CLI is Bun-first and experimental
- TypeScript declarations do not yet infer every object-definition shape
- `mock()` output is structural, not semantically realistic
- `serialize()` validates but does not apply transforms
- no framework-specific HTTP adapters
- no UI form component adapters
- no database/ORM helper
- no AI provider SDK helper
- no `@sigil/*` package split

---

## Migration Notes

No runtime migration is required for stable-core users moving from the prior verified package line.

Notable release-prep changes:

- package version target is `0.18.0`
- active public docs now reference `0.18.0`
- npm package excludes `docs/internal/`
- npm package continues to include public docs and examples

---

## Verification Summary

Release-prep verification completed in this block includes:

- package metadata audit
- README public release polish
- docs navigation link check
- quickstart runnable smoke
- recipe smoke test
- package contents dry run
- limitations/experimental surface review
- release gate decision

Final full verification is recorded in `docs/internal/public-release-prep-report.md` and the final verification summary for this block.

---

## Recommendation

Ready to publish a public `0.18.0` release after human review of package metadata, README, changelog, and npm package contents.

Do not cut `1.0.0` yet.

Keep CLI, `httpContract()`, and `toFormConstraints()` experimental.
