# [examples/config-validation.js](https://github.dev/weipertda/sigiljs/blob/main/examples/scripts/config-validation.js)

```javascript

import { Sigil } from "../src/index.js"
import fs from "fs"

const Config = Sigil`
{
  port: number
  host: string
  debug?: boolean
}
`

const config = JSON.parse(
  fs.readFileSync("./config.json", "utf8")
)

Config.assert(config)

console.log("Config valid")

```
