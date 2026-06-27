# Fresh Consumer Install Smoke

**Block:** Release Candidate Dry Run  
**Pass:** 4 — Fresh Consumer Install Smoke Test  
**Package:** `@weipertda/sigiljs` v0.16.0

---

## Goal

Install SigilJS from a locally packed npm artifact into a fresh temporary consumer project and run basic public API usage outside the source tree.

---

## Environment

Temporary consumer directory:

```txt
.tmp/consumer-smoke/
```

Package artifact:

```txt
weipertda-sigiljs-0.16.0.tgz
```

Runtime used for consumer execution:

```txt
node consumer.mjs
```

---

## Commands Run

```bash
npm pack --json
mkdir -p .tmp/consumer-smoke
cd .tmp/consumer-smoke
npm init -y
npm install ../../weipertda-sigiljs-0.16.0.tgz
node consumer.mjs
```

---

## Consumer Smoke Coverage

The consumer file imported from the package name:

```txt
@weipertda/sigiljs
```

APIs exercised:

- `sigil.exact()`
- `oneOf()`
- `optional()`
- `safeParse()`
- `toJSONSchema()`
- `mock()`
- `check()`

---

## Result

The fresh consumer install succeeded.

Observed output summary:

```json
{
  "installed": true,
  "data": {
    "id": "u_1",
    "role": "admin"
  },
  "schemaType": "object",
  "mockPasses": true
}
```

---

## Cleanup

Cleanup completed:

```txt
consumer directory removed
tarball removed
```

---

## Blockers

No fresh-consumer install blocker found.
