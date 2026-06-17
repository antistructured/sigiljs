# Sigils

A **sigil** is a small expression that describes what data should look like.

Sigils are written using a tagged template:

```javascript

Sigil`string`

```

Sigils compile into fast runtime validators.

---

## Primitive Types

SigilJS supports common JavaScript primitives.

```javascript

Sigil`string`
Sigil`number`
Sigil`boolean`
Sigil`bigint`
Sigil`symbol`
Sigil`null`
Sigil`undefined`

```

Example:

```javascript

const Name = Sigil`string`

Name.check("Alex")

```

---

## The Sigil Mental Model

The easiest way to think about SigilJS is:

A **sigil is a blueprint for data**.

Example blueprint:

```javascript

const User = Sigil`
{
  name: string
  age?: number
}
`

```

You can then **cast the sigil** against real values.

```javascript

User.check(data)

```

---

## API Aliases: `Sigil`, `S`, and `T`

To accommodate different developer preferences, SigilJS exports three aliases for the template tag:

1. **`Sigil` (Recommended for clarity)**: The standard and most descriptive import. Perfect for public APIs, shared utilities, or when team readability is the priority.
   ```javascript
   import { Sigil } from "@antistructured/sigiljs";
   const User = Sigil`{ name: string }`;
   ```

2. **`S` (Recommended shorthand)**: A single-letter shorthand that feels like standard types or schemas. Great for reducing boilerplate in inline declarations.
   ```javascript
   import { S } from "@antistructured/sigiljs";
   const User = S`{ name: string }`;
   ```

3. **`T` (Legacy/Optional)**: Kept strictly for backwards compatibility with earlier versions. We recommend using `Sigil` or `S` in new codebases.
   ```javascript
   import { T } from "@antistructured/sigiljs";
   const User = T`{ name: string }`;
   ```
