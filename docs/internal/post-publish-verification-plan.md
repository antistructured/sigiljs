# Post-Publish Verification Plan

**Block:** Publish Readiness Gate — Manual Virtual Sub-Agent Workflow  
**Pass:** 8 — Post-Publish Verification Plan  
**Virtual sub-agent:** post-publish-verification-agent  
**Package:** `@weipertda/sigiljs`  
**Version:** `0.18.0`

---

## Purpose

After Daniel manually publishes, verify the live npm package behaves like the local release artifact.

This plan assumes publish has already happened manually.

```txt
npm publish executed by this block: no
```

---

## npm Registry Checks

Run:

```bash
npm view @weipertda/sigiljs version
npm view @weipertda/sigiljs name
npm view @weipertda/sigiljs license
npm view @weipertda/sigiljs dist.tarball
npm view @weipertda/sigiljs files
```

Expected:

```txt
version: 0.18.0
name: @weipertda/sigiljs
license: MIT
```

Confirm `files` / package contents reflect:

- `README.md`
- `CHANGELOG.md`
- `LICENSE`
- `package.json`
- `index.d.ts`
- `src/`
- public `docs/`
- public `examples/`
- no `docs/internal/`
- no `trials/`

---

## Fresh Install Smoke

Run in a clean temporary directory:

```bash
rm -rf /tmp/sigiljs-publish-check
mkdir -p /tmp/sigiljs-publish-check
cd /tmp/sigiljs-publish-check
npm init -y
npm install @weipertda/sigiljs
```

---

## Public Import Check

Run:

```bash
node -e "import('@weipertda/sigiljs').then(m => console.log(Object.keys(m).sort()))"
```

Expected exports include:

- `Sigil`
- `S`
- `T`
- `sigil`
- `optional`
- `union`
- `oneOf`
- `pipe`
- `trim`
- `httpContract`
- `realType`
- `real`
- `Real`
- `SigilValidationError`

No internal compiler/parser/projection helper exports should appear.

---

## Runtime Smoke Check

Run:

```bash
node --input-type=module -e "
import { oneOf, sigil } from '@weipertda/sigiljs';
const User = sigil.exact({ id: String, role: oneOf('admin', 'user') });
console.log(User.safeParse({ id: '1', role: 'user' }).success);
console.log(User.safeParse({ id: '1', role: 'owner' }).success);
"
```

Expected:

```txt
true
false
```

---

## TypeScript Consumer Check

Run:

```bash
cat > smoke.ts <<'TS'
import { oneOf, sigil, type SigilContract } from '@weipertda/sigiljs';

type User = { id: string; role: 'admin' | 'user' };
const UserContract: SigilContract<User> = sigil.exact<User>({
  id: String,
  role: oneOf('admin', 'user'),
});
const parsed: User = UserContract.parse({ id: '1', role: 'user' });
console.log(parsed.role);
TS
npm install -D typescript
npx tsc --strict --module NodeNext --moduleResolution NodeNext --target ES2022 --noEmit smoke.ts
```

Expected: TypeScript exits 0.

---

## CLI Bin Check

Because the CLI is Bun-first and experimental, verify it with Bun:

```bash
cat > user.sigil.js <<'JS'
import { oneOf, sigil } from '@weipertda/sigiljs';

export default sigil.exact({
  id: String,
  role: oneOf('admin', 'user'),
});
JS

cat > valid.json <<'JSON'
{ "id": "1", "role": "user" }
JSON

npx sigil check user.sigil.js valid.json
```

If `npx` does not use Bun correctly for the shebang in the local environment, run the installed bin directly with Bun-aware tooling and record the environment limitation. The CLI remains experimental.

---

## README Rendering Check

On the npm package page, verify:

- README renders
- install command is visible
- 30-second example is readable
- status says `0.18.0`
- status says not `1.0.0`
- experimental surfaces remain labeled
- docs links are useful for package consumers

---

## Known Limitations Page Check

From the installed package or npm tarball, confirm:

```txt
node_modules/@weipertda/sigiljs/docs/known-limitations.md
```

Contains:

- CLI is Bun-first and experimental
- `.sigil` loading is Bun-specific
- `httpContract()` is experimental
- `toFormConstraints()` is experimental
- no package split
- TypeScript declarations are conservative

---

## Failure Handling

If post-publish verification fails:

1. determine whether the package is unusable or docs-only flawed
2. avoid unpublish unless clearly warranted and npm policy permits it
3. prefer a patch release if consumers can safely move forward
4. document the issue and fix path before publishing a follow-up

---

## Blockers

None for this plan.

Execution waits until Daniel manually publishes.
