# CLI Workflow Trial

Experimental CLI workflow evidence.

## Run

From the package root:

```bash
bun run src/playground.js describe trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js json-schema trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js types trials/cli-workflow/contracts/user.sigil.js User
bun run src/playground.js openapi trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js form trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js check trials/cli-workflow/contracts/user.sigil.js trials/cli-workflow/data/valid-user.json
bun run src/playground.js safe-parse trials/cli-workflow/contracts/user.sigil.js trials/cli-workflow/data/invalid-user.json
bun run src/playground.js mock trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js cases trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js test trials/cli-workflow/contracts/user.sigil.js
bun run src/playground.js diff trials/cli-workflow/contracts/old-user.sigil.js trials/cli-workflow/contracts/new-user.sigil.js
```

The CLI remains experimental. The actual projection commands are `json-schema`, `types`, `openapi`, and `form`; there is no `project` subcommand.
