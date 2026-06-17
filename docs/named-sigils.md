# Named Sigils & Composition

As your application grows, you will want to reuse sigil definitions, compose larger schemas from smaller pieces, and support self-referential or circular schemas. SigilJS supports this via **Named Sigils** created with `Sigil.define` (or its alias `Sigil.named`).

## Defining a Reusable Sigil

You register a named sigil globally by passing a unique name to `Sigil.define`:

```javascript
import { Sigil } from "@antistructured/sigiljs";

// Register the "Email" sigil
const Email = Sigil.define("Email")`string`;
```

Once defined, you can reference `Email` directly by name inside any other Sigil's template string:

```javascript
const User = Sigil`
{
  name: string
  email: Email
}
`;

User.check({
  name: "Charlie",
  email: "charlie@example.com"
}); // true
```

## Schema Composition

Composition allows you to modularize your schema architecture:

```javascript
Sigil.define("Address")`
{
  street: string
  city: string
}
`;

const UserProfile = Sigil`
{
  name: string
  billingAddress: Address
  shippingAddress: Address
}
`;
```

## Self-Referential & Circular Schemas

Named sigils allow you to define recursive models (like trees, folder hierarchies, or linked lists).

Because references are resolved lazily at validation/compilation time, you can refer to a named sigil that has not yet been registered or refers to itself.

```javascript
// A Node has a name, and an optional list of child Nodes
const Node = Sigil.define("Node")`
{
  name: string
  children?: Node[]
}
`;

Node.check({
  name: "root",
  children: [
    { name: "src" },
    {
      name: "tests",
      children: [
        { name: "validate.test.js" }
      ]
    }
  ]
}); // true
```

## Registry Lifecycle

Named sigils are stored in a global registry. When testing, you may want to reset the registry to prevent cross-test contamination:

```javascript
import { registry } from "@antistructured/sigiljs";

// Clear all registered named sigils
registry.clear();
```

Duplicate registrations follow a **last-write-wins** approach, meaning redefining a name will overwrite the previous definition.
