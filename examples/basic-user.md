# [examples/basic-user.js](https://github.dev/weipertda/sigiljs/blob/main/examples/basic-user.js)

```javascript

import { Sigil } from "../src/index.js"

const User = Sigil`
{
  name: string
  age?: number
  tags: string[]
}
`

const data = {
  name: "Alex",
  tags: ["js", "bun"]
}

console.log(User.check(data))

```
