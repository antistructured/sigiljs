# npm Package Final Release Audit

**Block:** 0.18.x Public Release Prep  
**Pass:** 7 — npm Package Contents Final Audit  
**Package:** `@weipertda/sigiljs`  
**Release target:** `0.18.0`

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
version: 0.18.0
filename: weipertda-sigiljs-0.18.0.tgz
files: 243
package size: 140,196 bytes
unpacked size: 501,939 bytes
```

---

## Critical Files Included

| File | Status |
|------|--------|
| `README.md` | included |
| `LICENSE` | included |
| `package.json` | included |
| `index.d.ts` | included |
| `src/index.js` | included |
| `src/playground.js` | included; CLI bin target |
| `docs/README.md` | included |
| `docs/api.md` | included |
| `docs/quickstart.md` | included |
| `examples/README.md` | included |

---

## Intended Content Counts

```txt
docs/: 86 files
examples/: 125 files
docs/internal/: 0 files
trials/: 0 files
```

This respects the Pass 6 packaging decision:

- public docs ship
- public examples ship
- internal reports do not ship
- trials do not ship

---

## Unwanted File Check

No unwanted package contents found:

```txt
missing critical files: none
unexpected tarballs: none
temporary files: none
docs/internal files: none
trials files: none
```

---

## CLI Bin Check

`package.json` keeps:

```json
"bin": {
  "sigil": "./src/playground.js"
}
```

The bin target is included in the packed artifact.

---

## Runtime Dependency Status

Runtime dependencies remain zero.

---

## Blocker Assessment

No npm package contents blocker remains for public `0.18.0` release prep.
