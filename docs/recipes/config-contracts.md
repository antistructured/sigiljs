# Config Contracts

Define structure once. Project it everywhere.

## 1. Boundary problem

Config files and environment-derived objects are unknown data at startup. Enforce a contract object once so the rest of the process receives trusted runtime data.

## 2. Sigil contract

```js
import { oneOf, sigil } from 'sigil';

const AppConfig = sigil.exact({
  env: oneOf('development', 'staging', 'production'),
  port: Number,
  databaseUrl: String,
});
```

## 3. Unknown input

```js
const unknownConfig = {
  env: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL,
};
```

## 4. Enforcement using parse/safeParse/assert

```js
const config = AppConfig.parse(unknownConfig);
```

## 5. Trusted output

```js
startServer(config);
```

## 6. Optional projection

```js
const configContractDescription = AppConfig.describe();
```
