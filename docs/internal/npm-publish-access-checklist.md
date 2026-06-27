# npm Publish Identity + Access Checklist

**Block:** Publish Readiness Gate — Manual Virtual Sub-Agent Workflow  
**Pass:** 2 — npm Identity + Access Checklist  
**Virtual sub-agent:** npm-identity-access-agent  
**Package:** `@weipertda/sigiljs`  
**Version:** `0.18.0`

---

## Purpose

This checklist is for Daniel to complete manually before publishing `@weipertda/sigiljs@0.18.0`.

This document does not contain credentials and does not execute publish.

---

## Required Manual Checklist

Before running `npm publish`, confirm:

- [ ] npm account is correct.
- [ ] npm login is active.
- [ ] npm 2FA status is known.
- [ ] npm account can publish packages under the `@weipertda` scope.
- [ ] `@weipertda/sigiljs` is available or already owned by the publishing account.
- [ ] npm package access level is public.
- [ ] publish command includes `--access public` for scoped public publishing.
- [ ] npm token is not committed.
- [ ] no secrets are present in package files.
- [ ] local git state is intentional before publish.
- [ ] final release gate has passed immediately before publish.

---

## Suggested Identity / Access Commands

Run these manually in a trusted shell:

```bash
npm whoami
npm view @weipertda/sigiljs
npm access ls-packages
npm pack --dry-run
```

Interpretation:

- `npm whoami` should print Daniel's intended npm account.
- `npm view @weipertda/sigiljs` should show the existing package if already published, or return a not-found error if this is the first publish.
- `npm access ls-packages` should show packages/scopes available to the account.
- `npm pack --dry-run` should match the expected package contents.

---

## Publish Command

For a scoped public npm package, the manual publish command should be:

```bash
npm publish --access public
```

Do not run this until identity, access, git state, and final release gates are confirmed.

---

## Secret Handling

Do not commit:

- npm tokens
- `.npmrc` files containing credentials
- shell history snippets containing tokens
- CI secrets
- one-time passwords / 2FA codes

If a token is needed, keep it in npm/CI secret storage, not in this repository.

---

## Package Metadata Context

Current `package.json` already declares:

```txt
name: @weipertda/sigiljs
version: 0.18.0
publishConfig.access: public
```

The explicit `npm publish --access public` command is still recommended for clarity.

---

## Publish Execution Status

```txt
npm publish executed: no
```

---

## Blockers

Manual blocker until Daniel confirms npm identity/access in his publishing shell.

This is expected and does not indicate a package problem.
