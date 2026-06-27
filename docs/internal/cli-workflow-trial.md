# CLI Workflow Trial

**Block:** Real-World Usage Trial  
**Pass:** 5 — CLI Workflow Trial  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Trial Files

- `trials/cli-workflow/contracts/user.sigil.js`
- `trials/cli-workflow/contracts/old-user.sigil.js`
- `trials/cli-workflow/contracts/new-user.sigil.js`
- `trials/cli-workflow/contracts/user-text.sigil`
- `trials/cli-workflow/data/valid-user.json`
- `trials/cli-workflow/data/invalid-user.json`
- `trials/cli-workflow/README.md`

---

## Commands Exercised

Actual CLI syntax was exercised through:

```bash
bun run src/playground.js --help
bun run src/playground.js describe trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js describe trials/cli-workflow/contracts/user.sigil.js --export User
bun run src/playground.js json-schema trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js types trials/cli-workflow/contracts/user.sigil.js User
bun run src/playground.js openapi trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js form trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js check trials/cli-workflow/contracts/user.sigil.js trials/cli-workflow/data/valid-user.json
bun run src/playground.js parse trials/cli-workflow/contracts/user.sigil.js trials/cli-workflow/data/valid-user.json
bun run src/playground.js safe-parse trials/cli-workflow/contracts/user.sigil.js trials/cli-workflow/data/invalid-user.json
bun run src/playground.js mock trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js cases trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js test trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js diff trials/cli-workflow/contracts/old-user.sigil.js trials/cli-workflow/contracts/new-user.sigil.js
bun run src/playground.js json-schema trials/cli-workflow/contracts/user.sigil.js --out .tmp/cli-trial/user.schema.json
bun run src/playground.js describe trials/cli-workflow/contracts/user-text.sigil
```

Result: **pass**

---

## Findings

### What Felt Good

- The `sigil` bin name is short and memorable.
- `.sigil.js` module files feel like the safest workflow because they use normal JavaScript imports.
- `--export` is useful for multi-contract files.
- `--out` works for artifact generation.
- `safe-parse` is automation-friendly because validation failures remain structured.
- The CLI covers a useful lifecycle: inspect, project, validate, prove, diff.

### Friction

- The CLI does not use a `project <target>` subcommand. Actual commands are direct: `json-schema`, `types`, `openapi`, and `form`. This is okay, but docs and examples must consistently use actual command names.
- `.sigil` text loading works in the Bun trial, but remains Bun-specific and should stay experimental.
- Working-directory-relative JS module loading is convenient from package root, but this can surprise users running commands from another directory.
- `diff()` output is valid JSON, but the meaning of change entries needs more examples before CLI output can be treated as stable.

---

## Experimental Status

The CLI remains experimental. This trial provides usage evidence only; it does not freeze command names, output formats, exit-code guarantees, or `.sigil` syntax compatibility.

---

## Blocker Assessment

No blocker for continued 0.x CLI exposure.

Before 1.0, the CLI still needs an explicit compatibility policy for command names, output shapes, exit codes, CWD behavior, and `.sigil` text loading.
