# Plugin Contracts

Define structure once. Project it everywhere.

## 1. Boundary problem

Plugin inputs cross a system boundary between host code and extension code. Enforce the contract object before invoking plugin behavior.

## 2. Sigil contract

```js
import { optional, sigil } from '@weipertda/sigiljs';

const PluginOptions = sigil.exact({
  name: String,
  version: String,
  settings: Object,
  strict: optional(Boolean),
});
```

## 3. Unknown input

```js
const unknownOptions = await plugin.loadOptions();
```

## 4. Enforcement using parse/safeParse/assert

```js
const options = PluginOptions.parse(unknownOptions);
```

## 5. Trusted output

```js
await plugin.activate(options);
```

## 6. Optional projection

```js
const pluginOptionsProjection = PluginOptions.toJSONSchema();
```
