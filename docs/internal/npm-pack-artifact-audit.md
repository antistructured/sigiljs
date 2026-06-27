# npm Pack Artifact Audit

**Block:** Release Candidate Dry Run  
**Pass:** 3 — npm Pack Artifact Audit  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Command

```bash
npm pack --dry-run --json
```

Result: passed.

---

## Pack Summary

```txt
name: @weipertda/sigiljs
version: 0.16.0
filename: weipertda-sigiljs-0.16.0.tgz
files: 311
package size: 240,211 bytes
unpacked size: 860,460 bytes
```

---

## Critical Files Included

| File | Status |
|------|--------|
| `package.json` | included |
| `README.md` | included |
| `LICENSE` | included |
| `index.d.ts` | included |
| `src/index.js` | included |
| `src/playground.js` | included; CLI bin target |
| `docs/api.md` | included |
| `docs/stability.md` | included |
| `docs/known-limitations.md` | included |
| `examples/README.md` | included |

---

## Included Top-Level Content

The packed artifact includes:

```txt
LICENSE
README.md
docs/
examples/
index.d.ts
package.json
src/
```

This matches the current package `files` allowlist.

---

## Docs / Examples

Docs and examples are included intentionally through the `files` allowlist:

- `docs/`
- `examples/`

Internal audit/release docs under `docs/internal/` are also included because the package currently ships all docs. Count observed in dry run:

```txt
docs/internal files: 70
```

This is acceptable for this dry run. If package polish or size becomes a concern, a future packaging cleanup can exclude internal docs or move release artifacts outside shipped docs.

---

## Unexpected Files

No obvious unexpected package artifacts were found:

```txt
unexpected .tgz files: none
temporary files: none
```

---

## Missing Files

No critical release files were missing:

```txt
missing: none
```

---

## Recommendation

Pack artifact is coherent for a serious 0.x release candidate dry run.

Proceed to fresh consumer installation using a real tarball created from this package state.
