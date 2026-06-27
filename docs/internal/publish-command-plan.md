# Publish Command Plan

**Block:** Publish Readiness Gate — Manual Virtual Sub-Agent Workflow  
**Pass:** 6 — Publish Command Dry Run Plan  
**Virtual sub-agent:** publish-command-plan-agent  
**Package:** `@weipertda/sigiljs`  
**Version:** `0.18.0`

---

## Important Boundary

This plan documents the manual publish sequence.

```txt
npm publish executed: no
```

Do not publish until Daniel has confirmed npm identity, access, 2FA, git state, and final verification.

---

## Final Manual Pre-Publish Sequence

Recommended command sequence:

```bash
git status
bun run check:release
npm whoami
npm view @weipertda/sigiljs
npm access ls-packages
npm pack --dry-run --json
npm publish --access public
npm view @weipertda/sigiljs version
```

---

## Command Notes

### `git status`

Confirm the working tree matches the intended release commit content. Do not publish from an accidental dirty state.

### `bun run check:release`

Runs the full release gate:

```bash
bun run lint && bun test && bun run check:types && npm pack --dry-run
```

Expected result:

```txt
lint: pass
tests: 605 pass / 0 fail
types: pass
pack: pass
```

### `npm whoami`

Confirm the active npm account is Daniel's intended publishing account.

### `npm view @weipertda/sigiljs`

Check current npm package state. For first publish, not-found may be expected. For an existing package, confirm ownership/version state is expected.

### `npm access ls-packages`

Confirm the account has publish access under the `@weipertda` scope.

### `npm pack --dry-run --json`

Confirm the package artifact still matches the final gate expectations before publishing.

### `npm publish --access public`

Manual publish command for a scoped public package.

Do not run this command from automation in this block.

### `npm view @weipertda/sigiljs version`

After publish, confirm npm reports:

```txt
0.18.0
```

---

## Rollback / Unpublish Caution

npm unpublish behavior is time-limited and can disrupt consumers. Treat publish as effectively permanent once public.

If a post-publish issue is discovered, prefer:

1. deprecate the bad version with an explanatory message if appropriate
2. publish a fixed patch/minor version
3. reserve unpublish for urgent cases that satisfy npm policy and Daniel's judgment

---

## Required Human Confirmations

Before publish, Daniel should confirm:

- [ ] npm account is correct
- [ ] npm 2FA flow is ready
- [ ] scope/package ownership is correct
- [ ] git state is intentional
- [ ] release gate has passed immediately before publish
- [ ] package dry run has expected contents
- [ ] this is `0.18.0`, not `1.0.0`
- [ ] experimental APIs remain experimental

---

## Blockers

No package blocker.

Manual identity/access confirmation remains required before the publish command is run.
