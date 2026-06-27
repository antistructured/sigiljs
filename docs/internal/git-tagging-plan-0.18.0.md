# Git Tagging Plan — 0.18.0

**Block:** Publish Readiness Gate — Manual Virtual Sub-Agent Workflow  
**Pass:** 7 — Git State + Tagging Plan  
**Virtual sub-agent:** git-tagging-plan-agent  
**Package:** `@weipertda/sigiljs`  
**Version:** `0.18.0`

---

## Important Boundary

This document is a plan only.

```txt
git commit executed: no
git tag executed: no
git push executed: no
```

Do not commit, tag, or push until Daniel reviews the worktree and confirms release content.

---

## Current Observed Git Context

Observed branch:

```txt
main
```

Observed state:

```txt
working tree has many modified and untracked files from the accumulated release-prep workstream
```

This is not necessarily a blocker, but it means Daniel should review the exact staged content before committing or tagging.

---

## Recommended Status Check

Run:

```bash
git status
git diff --stat
git diff
```

Recommended review focus:

- `package.json` version and package metadata
- `CHANGELOG.md` `0.18.0` entry
- public docs changes
- internal release/publish readiness reports
- tests and TypeScript declaration files from prior hardening blocks
- ensure no secrets, tokens, temp files, or unintended tarballs are staged

---

## Recommended Commit

After reviewing and staging intentional release content:

```bash
git add .
git commit -m "Prepare SigilJS 0.18.0 public release"
```

If Daniel wants more granular history, split into separate commits before tagging, for example:

```txt
Add stable core release verification artifacts
Prepare public release docs for 0.18.0
Add publish readiness gate for 0.18.0
```

But for a release-prep checkpoint, a single release-prep commit is acceptable if the diff is reviewed.

---

## Recommended Tag

After the release commit exists and final gates pass:

```bash
git tag -a v0.18.0 -m "SigilJS 0.18.0"
```

Tag name:

```txt
v0.18.0
```

Tag message:

```txt
SigilJS 0.18.0
```

---

## Recommended Push Order

Conservative order:

```bash
git push
```

Then publish manually:

```bash
npm publish --access public
```

After npm publish succeeds and post-publish checks pass, push the tag:

```bash
git push origin v0.18.0
```

Alternative order:

```bash
git push
git push origin v0.18.0
npm publish --access public
```

Use the conservative order if Daniel wants the public git tag to represent a confirmed npm-published artifact.

---

## Post-Publish Tag Note

If npm publish succeeds, `v0.18.0` should point to the exact commit used to produce the package.

If publish fails before any package is created, do not push the tag until the blocker is resolved.

---

## Blockers

No package blocker.

Manual blocker: Daniel must review the broad worktree and choose the final commit/tag moment.
