# Plugin boundaries

Plugin systems receive a host-defined input object and are expected
to return output according to a contract.
Both sides benefit from a shared contract: the host validates plugin input,
and the plugin can validate host-provided options or shared state.

Use `parse()` or `assert()` when registering or invoking a plugin.
Use `serialize()` when passing plugin-provided data back into another trust boundary.

## Recommended style

```js
const PluginManifest = sigil.exact({
  name: String,
  version: String,
  settings: Object,
  strict: optional(Boolean),
});
```

## Host side

```js
const input = PluginManifest.assert(optionsFromHost);
```

## Plugin side

Plugin code can export its own contract for data passed back to the host.

Plugin boundaries are useful for:

- editor or IDE plugins
- CMS transform plugins
- build step extensions
- hosted extensibility modules
- multi-tenant plugin marketplaces
