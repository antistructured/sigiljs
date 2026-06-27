# sigil vs Sigil Policy

**Block:** Stable Core Hardening  
**Package:** `@weipertda/sigiljs` v0.14.0  
**Pass:** 4 — Sigil vs sigil Policy

---

## Decision

Use **Option A**:

```txt
sigil() is the primary stable API.
Sigil template API remains a stable advanced API.
```

---

## Policy

### Primary stable API

Use `sigil()` and `sigil.exact()` in new docs, README examples, recipes, and TypeScript examples.

```js
const User = sigil({ name: String });
const ExactUser = sigil.exact({ name: String });
```

Rationale:

- It is plain JavaScript object syntax.
- It works naturally with TypeScript declaration ergonomics via `sigil<T>(...)`.
- It is the clearest public API for new users.
- It is already the dominant README and recipe style.

### Advanced stable API

`Sigil` template-literal syntax remains stable and supported.

```js
const User = Sigil`{ name: string }`;
const ExactUser = Sigil.exact`{ name: string }`;
```

Rationale:

- It is existing runtime behavior.
- It is tested.
- It powers `.sigil` text parsing and template-oriented workflows.
- It supports named/collection helpers for advanced composition.

### Documentation posture

- README and quickstart should prefer `sigil()` / `sigil.exact()`.
- API docs may document `Sigil` as an advanced stable template API.
- `Sigil` should not be described as deprecated.
- Legacy aliases `S` and `T` are handled separately in the legacy alias policy.

---

## Type Declaration Policy

`index.d.ts` should declare `Sigil` without `@deprecated`.

`S` and `T` remain deprecated aliases of `Sigil`.

---

## Tests

Existing tests verify:

- `sigil` is exported.
- `sigil.exact` works.
- `Sigil` is exported and constructs contracts.
- `sigil()` creates the same kind of contract object as `Sigil`.

No new runtime behavior is required.

---

## 1.0 Recommendation

Freeze both APIs for 1.0 with clear hierarchy:

1. `sigil()` / `sigil.exact()` — primary stable API.
2. `Sigil` / `Sigil.exact` / `Sigil.named` / `Sigil.define` / `Sigil.collection` — advanced stable template API.
3. `S` / `T` — legacy aliases, not primary API.

