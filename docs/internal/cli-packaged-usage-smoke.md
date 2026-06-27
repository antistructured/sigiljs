# CLI Packaged Usage Smoke

**Block:** Release Candidate Dry Run  
**Pass:** 6 — CLI Packaged Usage Smoke Test  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Goal

Verify the experimental `sigil` CLI bin works when SigilJS is installed from a packed npm artifact.

---

## Inspected

- `package.json` bin metadata
- `src/playground.js`
- `docs/cli.md`
- `tests/cli-workflows.test.js`

---

## Smoke Environment

Temporary consumer directory:

```txt
.tmp/cli-packaged-smoke/
```

Install source:

```txt
weipertda-sigiljs-0.16.0.tgz
```

CLI invoked through installed package bin:

```txt
./node_modules/.bin/sigil
```

The CLI target has a Bun shebang:

```txt
#!/usr/bin/env bun
```

This is consistent with current experimental CLI documentation.

---

## Contract Fixture

The smoke used `.sigil.js` module loading and imported the package by name:

```txt
@weipertda/sigiljs
```

This validates packaged-module CLI usage rather than repo-relative source imports.

---

## Commands Tested

```bash
./node_modules/.bin/sigil --help
./node_modules/.bin/sigil describe ./contract.sigil.js
./node_modules/.bin/sigil json-schema ./contract.sigil.js
./node_modules/.bin/sigil mock ./contract.sigil.js
```

---

## Result

All commands exited successfully.

Observed parsed output summary:

```json
{
  "helpHasTitle": true,
  "describeKind": "object",
  "describeExact": true,
  "schemaType": "object",
  "mock": {
    "id": "string",
    "role": "admin"
  }
}
```

---

## Cleanup

Cleanup completed:

```txt
cli consumer directory removed
tarball removed
```

---

## Experimental Status

The CLI remains experimental.

This smoke confirms packaged bin availability and representative commands. It does not prove production CLI workflow stability, output compatibility, or `.sigil` syntax compatibility for 1.0.

---

## Blockers

No packaged CLI blocker found for a 0.x release-candidate dry run.

Known limitation remains: the CLI requires Bun because the published bin is `#!/usr/bin/env bun`.
