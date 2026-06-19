# Config boundaries

Config files are visible, versioned, and trusted by developers,
but they still cross a boundary: parsing, environment overrides,
and CLIs can supply values that do not match the application object shape.

Use a contract for the expected config shape and `assert()` or `safeParse()`
after loading and merging configuration. This keeps invalid startup
configs from becoming boolean truthy objects with missing fields.

## Recommended style

```js
const AppConfig = sigil.exact({
  env: oneOf('development', 'staging', 'production'),
  port: Number,
  databaseUrl: String,
  features: Array,
});
```

## Startup assertion

```js
const raw = await loadConfig(path);
const config = AppConfig.assert(raw);
```

Config boundaries are useful for:

- `.env`-derived merged configs
- YAML or JSON config files
- per-service feature flags
- command-line flag fallback objects
- environment mode requirements
