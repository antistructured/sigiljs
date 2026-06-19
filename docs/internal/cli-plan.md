# CLI Foundation Plan

Task 1 audit for the Contract Workflows build block.

## Current CLI entry point

The current CLI entry point is:

```txt
src/playground.js
```

It has a Bun shebang:

```js
#!/usr/bin/env bun
```

`package.json` exposes it as the package command:

```json
{
  "bin": {
    "sigil": "./src/playground.js"
  }
}
```

There is no separate `src/cli.js` file and no `bin/` directory at the time of this audit. The existing nested legacy playground path is still covered by tests through `src/playground/playground.js`.

## Current supported commands

`src/playground.js` dispatches known subcommands before falling back to legacy inline playground mode.

Supported file-based commands:

```bash
sigil check schema.sigil data.json
sigil parse schema.sigil data.json
sigil safe-parse schema.sigil data.json
sigil describe schema.sigil
sigil json-schema schema.sigil
sigil types schema.sigil [Name]
sigil openapi schema.sigil
sigil mock schema.sigil
sigil diff before.sigil after.sigil
```

Repository form:

```bash
bun run src/playground.js check schema.sigil data.json
```

Legacy inline playground mode:

```bash
bun run src/playground.js '{"name":"D"}' '{ name: string }'
```

## Audit questions

### Is there already a CLI entry point?

Yes. `src/playground.js` is the Bun executable CLI entry point. It currently serves both the newer file-based command workflow and legacy inline playground mode.

### Is there a package bin field?

Yes. `package.json` maps `sigil` to `./src/playground.js`.

### Can the CLI read files?

Yes. File-based commands read `.sigil` files with Bun's `file(path).text()` and `check` reads JSON data files with `JSON.parse(await file(path).text())`.

### Can the CLI parse inline sigils?

Yes. Legacy playground mode accepts an inline JSON string and an inline sigil expression:

```bash
bun run src/playground.js '{"name":"D"}' '{ name: string }'
```

Known limitation: inline sigils are available only through legacy positional mode, not through a named `--sigil` or `--inline` flag.

### Can the CLI output JSON?

Yes. These commands print JSON to stdout:

- `describe`
- `json-schema`
- `openapi`
- `mock`
- `diff`

`check` prints human-readable diagnostics instead of machine JSON. `types` prints TypeScript text.

### Can the CLI call describe(), toJSONSchema(), toTypeScript(), toOpenAPI(), and diff()?

Yes.

Current mappings:

| Command       | Contract method                                 |
| ------------- | ----------------------------------------------- |
| `describe`    | `contract.describe()`                           |
| `json-schema` | `contract.toJSONSchema()`                       |
| `types`       | `contract.toTypeScript(typeNameFromPath(file))` |
| `openapi`     | `contract.toOpenAPI()`                          |
| `diff`        | `after.diff(before)`                            |

`mock` also calls `contract.mock()`.

## Current implementation source of truth

The CLI compiles `.sigil` files through the public tagged-template entry (`T`) and then calls public contract-object methods.

Projection and workflow commands use public contract methods rather than reading parser internals directly. This matches the architecture rule for workflow features.

## Missing commands for contract workflows

Current CLI support is enough for a basic foundation, but the next workflow block needs clearer developer workflows.

Missing or not yet hardened:

- Dedicated `help` / command usage output.
- Machine-readable `check --json` output. `safe-parse` now returns structured result objects, but `check` remains human-readable.
- Output formatting flags such as `--pretty`, `--compact`, or `--out`.
- Inline command flags such as `--sigil '{ id: number }'` and `--json '{"id":1}'`.
- File-based loading for JavaScript object-definition contracts. Current `.sigil` loading is template-expression text only.
- Contract metadata loading from files. Current `.sigil` text cannot express object-definition metadata.
- Release quality gate commands, for example a diff gate that exits non-zero on breaking changes.
- Workflow examples that shell out through the CLI for API, queue, config, AI, and lifecycle use cases.

## Proposed command format

Keep the current command names stable and add options incrementally:

```bash
sigil check <contract.sigil> <data.json>
sigil check <contract.sigil> <data.json> --json

sigil describe <contract.sigil>
sigil json-schema <contract.sigil>
sigil types <contract.sigil> --name User
sigil openapi <contract.sigil>
sigil mock <contract.sigil>

sigil diff <before.sigil> <after.sigil>
sigil diff <before.sigil> <after.sigil> --fail-on breaking
```

Recommended near-term principles:

- Preserve existing commands and output by default.
- Add JSON/machine-readable output behind flags instead of changing `check` output immediately.
- Keep `src/playground.js` as the package bin until command behavior is stable enough to justify a dedicated file rename.
- Do not split `@sigil/cli` yet.
- Continue routing projections through public contract-object methods backed by `describe()`.

## Known limitations

- The CLI name is still implemented in `src/playground.js`, which reads like a demo rather than a workflow command entry point.
- `.sigil` files support template syntax only; object-definition contracts and metadata-rich contracts currently require JavaScript code examples.
- There is no CLI flag parser yet; arguments are positional and intentionally minimal.
- `check` prints human-readable text and has no JSON diagnostic mode.
- TypeScript output name can be passed explicitly or inferred from the filename.
- Error output is basic and not yet structured for CI systems.
- There is no release gate command yet, even though `diff()` now includes deterministic `impact` classifications.
- There is no standalone package split for CLI distribution; this is intentional until public APIs stabilize.

## Existing verification coverage

CLI behavior is currently covered by:

- `tests/cli.test.js`
- `tests/playground.test.js`

Docs coverage exists in:

- `docs/cli.md`
- README CLI section

## Recommendation for next tasks

Proceed additively:

1. Keep `src/playground.js` and package `bin.sigil` stable for now.
2. Add workflow-focused commands/options in place.
3. Add tests before each command/output behavior change.
4. Add examples and release gates only after command output format is deterministic.
