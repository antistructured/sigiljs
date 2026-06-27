# Final Pack Artifact Inspection

**Block:** Publish Readiness Gate — Manual Virtual Sub-Agent Workflow  
**Pass:** 5 — Final Pack Artifact Inspection  
**Virtual sub-agent:** final-pack-artifact-agent  
**Package:** `@weipertda/sigiljs`  
**Version:** `0.18.0`

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
files: 244
package size: 141584 bytes
unpacked size: 505830 bytes
```

Public docs/examples included:

```txt
docs files: 86
examples files: 125
```

---

## Artifact Checks

| Check | Status |
|-------|--------|
| package is `@weipertda/sigiljs` | pass |
| version is `0.18.0` | pass |
| `README.md` included | pass |
| `CHANGELOG.md` included | pass |
| `LICENSE` included | pass |
| `package.json` included | pass |
| `index.d.ts` included | pass |
| `src/index.js` included | pass |
| `src/playground.js` included | pass |
| public docs included | pass |
| public examples included | pass |
| `docs/internal/` excluded | pass |
| `trials/` excluded | pass |
| unexpected tarballs excluded | pass |
| `.tmp` artifacts excluded | pass |

---

## Package Size Assessment

The package size is reasonable for a docs-and-examples-included public `0.x` package:

```txt
package size: 141584 bytes
unpacked size: 505830 bytes
```

The artifact intentionally includes public docs and examples while excluding internal reports and trials.

---

## Patch Decision

No package-content patch was required in this pass.

---

## Blockers

None.
