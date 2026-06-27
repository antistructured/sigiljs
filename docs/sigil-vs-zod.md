# SigilJS vs Zod

SigilJS and Zod both help JavaScript programs handle runtime data safely. They make different trade-offs.

Zod is a mature schema library with a builder API, TypeScript inference, transformations, refinements, and a large ecosystem.

SigilJS is smaller. It focuses on executable data contracts: readable contract objects that can validate, transform, describe, and project runtime data across system boundaries.

## Side by side

```js
import { z } from 'zod';

const User = z.object({
  name: z.string(),
  age: z.number().optional(),
});
```

```js
import { Sigil } from '@weipertda/sigiljs';

const User = Sigil`
{
  name: string
  age?: number
}
`;
```

## Quick comparison

| Topic            | Zod                                     | SigilJS                                                      |
| ---------------- | --------------------------------------- | ------------------------------------------------------------ |
| Style            | Builder API                             | Inline expressions and plain JavaScript object definitions   |
| Runtime artifact | Schema objects                          | Executable contract objects                                  |
| Best known for   | Rich ecosystem and TypeScript inference | Boundary contracts and projection-oriented runtime workflows |
| Recursive shapes | `z.lazy()`                              | Named sigils                                                 |
| Dependencies     | Package dependency                      | Zero runtime dependencies                                    |

## Choose Zod when

- You need mature transformations, defaults, refinements, or rich parsing behavior.
- You want first-class static TypeScript inference from schemas.
- You already use Zod throughout your project.
- You want the largest ecosystem and community support.

## Choose SigilJS when

- You want a compact executable contract object close to type notation.
- You prefer tagged-template contracts or `sigil({ name: String })` over builder chains.
- You want one contract to enforce unknown data and project into docs/tooling.
- You want a tiny dependency-free package for system boundaries.

## Not a replacement claim

SigilJS does not claim to replace Zod. It is a focused alternative for teams that want small, readable executable data contracts for runtime boundaries.
