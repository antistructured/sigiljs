# Examples + Trials Packaging Decision

**Block:** 0.18.x Public Release Prep  
**Pass:** 6 — Examples + Trials Packaging Decision  
**Package:** `@weipertda/sigiljs`  
**Release target:** `0.18.0`

---

## Files / Areas Inspected

- `package.json`
- `examples/`
- `trials/`
- `docs/internal/npm-pack-artifact-audit.md`
- `docs/internal/real-world-usage-trial-report.md`
- `docs/internal/release-candidate-dry-run-report.md`

---

## Packaging Decisions

| Category | Decision | Rationale |
|----------|----------|-----------|
| `examples/` | ship in package | Public, offline, runnable, copy-paste-friendly examples are useful for package consumers. |
| `trials/` | exclude from package | Trials are repo evidence and pre-1.0 validation workspaces, not normal package-consumer material. |
| `docs/internal/` | exclude from package | Internal audit/release reports are valuable in-repo but too noisy for public npm package contents. |

---

## Package Metadata Change

Updated `package.json` `files` allowlist:

```txt
"docs",
"!docs/internal",
"examples",
```

This keeps public docs and examples in the package while excluding internal release/audit reports.

`trials/` remains excluded because it is not listed in `files`.

---

## Verification

Ran:

```bash
npm pack --dry-run --json
```

Observed summary:

```txt
name: @weipertda/sigiljs
version: 0.18.0
filename: weipertda-sigiljs-0.18.0.tgz
package size: 140,196 bytes
unpacked size: 501,939 bytes
```

The package still includes:

- `README.md`
- `LICENSE`
- `package.json`
- `index.d.ts`
- `src/`
- public `docs/`
- public `examples/`

The package excludes:

- `docs/internal/`
- `trials/`

---

## Runtime Behavior

No runtime behavior changed.

No dependency was added.

No package split occurred.

---

## Blocker Assessment

No packaging blocker remains for public `0.18.0` release prep.
