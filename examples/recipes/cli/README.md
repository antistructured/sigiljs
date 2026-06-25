# CLI Workflow Recipe — Example Files

Run these commands from the repository root.

**The CLI is experimental.**

## Commands

```bash
# Describe contract structure
sigil describe examples/recipes/cli/user.sigil.js

# Validate data
sigil check examples/recipes/cli/user.sigil.js examples/recipes/cli/valid-user.json
sigil check examples/recipes/cli/user.sigil.js examples/recipes/cli/invalid-user.json

# Project
sigil json-schema examples/recipes/cli/user.sigil.js
sigil types examples/recipes/cli/user.sigil.js User
sigil openapi examples/recipes/cli/user.sigil.js
sigil form examples/recipes/cli/user.sigil.js

# Prove
sigil mock examples/recipes/cli/user.sigil.js
sigil cases examples/recipes/cli/user.sigil.js
sigil test examples/recipes/cli/user.sigil.js

# Diff
sigil diff examples/recipes/cli/old-user.sigil.js examples/recipes/cli/new-user.sigil.js
sigil diff examples/recipes/cli/old-user.sigil.js examples/recipes/cli/new-user.sigil.js --json
```
