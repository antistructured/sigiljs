# SigilJS vs Zod

SigilJS and Zod both validate JavaScript values at runtime. They make different trade-offs.

Zod is a mature schema library with a builder API, transformations, refinements, and a large ecosystem.

SigilJS is smaller. It focuses on readable type expressions that compile into reusable runtime validators.

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

| Topic            | Zod                                     | SigilJS                                  |
| ---------------- | --------------------------------------- | ---------------------------------------- |
| Style            | Builder API                             | Inline type expressions                  |
| Runtime shape    | Schema objects                          | Compiled validator functions             |
| Best known for   | Rich ecosystem and TypeScript inference | Small API and readable runtime contracts |
| Recursive shapes | `z.lazy()`                              | Named sigils                             |
| Dependencies     | Package dependency                      | Zero runtime dependencies                |

## Choose Zod when

- You need transformations, defaults, refinements, or rich parsing behavior.
- You want first-class static TypeScript inference from schemas.
- You already use Zod throughout your project.
- You want the largest ecosystem and community support.

## Choose SigilJS when

- You want a compact runtime contract close to type notation.
- You prefer `Sigil`{ name: string }`` over builder chains.
- You want validators compiled once and reused on hot paths.
- You want a tiny dependency-free package for runtime checks.

## Not a replacement claim

SigilJS does not claim to replace Zod. It is an alternative for teams that want small, readable runtime blueprints for data.
