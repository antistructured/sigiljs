# Transform / Serialize Semantics

**Block:** Stable Core Hardening  
**Package:** `@weipertda/sigiljs` v0.14.0  
**Pass:** 6 — Transform / Serialize Semantics

---

## Decision

Freeze current semantics:

- `parse()` applies transforms.
- `safeParse()` returns transformed data on success because it delegates to `parse()`.
- `serialize()` validates only and does **not** apply transforms.
- `transform(fn)` returns a derived contract with an appended contract-level transform.
- `pipe(definition, ...transforms)` defines field-level transforms.

---

## `transform(fn)` Semantics

`transform(fn)` returns a new contract derived from the same source shape.

During `parse(value)`:

1. Validate input against the contract.
2. Apply field-level transforms from `pipe(...)`.
3. Apply contract-level transforms in registration order.
4. Revalidate transformed output against the same contract shape.
5. Return the transformed output.

If transformed output violates the contract shape, `parse()` throws `SigilValidationError`.

---

## `serialize(value)` Semantics

`serialize(value)` validates trusted outbound data and returns the original validated value.

It does not apply field-level or contract-level transforms.

This is intentional:

- Use `parse()` when data should be normalized/transformed.
- Use `serialize()` when already-prepared data should be checked before crossing an outbound boundary.

---

## Validation Behavior

| Method | Validates input | Applies transforms | Revalidates transformed output | Throws on invalid |
|--------|-----------------|--------------------|--------------------------------|-------------------|
| `parse(value)` | yes | yes | yes | yes |
| `safeParse(value)` | yes | yes | yes | no; returns failure branch |
| `serialize(value)` | yes | no | n/a | yes |

---

## Mutation Behavior

SigilJS does not clone values as a stable guarantee.

Observed current behavior:

- `serialize(value)` returns the same valid value reference.
- Transform callbacks receive validated input and may return a new value.
- If user-supplied transform functions mutate their input, that mutation is user code behavior, not a SigilJS mutation guarantee.

Recommended style: transforms should return new values instead of mutating input.

---

## Trusted Data Relationship

`parse()` is the ingress/normalization path.

`serialize()` is the outbound/trusted-data validation path.

For transformed contracts, these intentionally differ:

```txt
parse(raw)      -> transformed + validated output
serialize(data) -> original data if already valid; no transform pass
```

---

## Known Limitations

- `serialize()` is not a JSON serializer and does not perform wire-format conversion.
- `serialize()` does not normalize data.
- Transform callbacks are user code and may throw arbitrary errors.
- Transform callbacks are not introspected by projections; descriptions expose transform metadata without serializing function bodies.

---

## Tests

Focused tests live in:

```txt
tests/stable-core-transform-serialize.test.js
```

They cover:

- field-level transforms through `parse()`
- contract-level transforms through `parse()`
- output revalidation
- `safeParse()` transformed success data
- `serialize()` validation-only behavior
- `serialize()` invalid-data errors
- intentional `parse()` / `serialize()` difference on transformed contracts

Current focused test status:

```txt
7 pass, 0 fail
```

---

## 1.0 Recommendation

Keep these semantics for 1.0.

Do not change `serialize()` to apply transforms without a deliberate pre-1.0 breaking change and broad docs/test migration.

