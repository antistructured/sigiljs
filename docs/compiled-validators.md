# Compiled Validators

Every Sigil is parsed and compiled once, then reused for all subsequent validations. This design ensures maximum performance and minimal runtime overhead.

## How It Works

When you create a Sigil using the template tag, SigilJS parses the type expression into an Abstract Syntax Tree (AST), normalizes it, and compiles it into an optimized validator function.

This compiled validator is cached, meaning that repeated validations do not perform any string parsing, AST traversal, or tokenizing.

```javascript
import { Sigil } from 'sigil';

const User = Sigil`
{
  name: string
  age: number
}
`;

// Under the hood, this uses the cached, pre-compiled validator function
User.check({ name: 'Alice', age: 30 });
```

## Direct Validator Access

If you need direct access to the compiled validator function, you can access the `.validator` property on any Sigil instance, or call `.compile()`. Both return the exact same function reference:

```javascript
const User = Sigil`{ name: string }`;

// Retrieve the stable, compiled validator function
const validateUser = User.validator;

// Validate directly using the function
const isValid = validateUser({ name: 'Bob' }); // true

// User.compile() returns the same cached reference
console.log(User.validator === User.compile()); // true
```

By reusing the compiled validator reference, you bypass any intermediate Sigil object logic, achieving optimal execution speed.
