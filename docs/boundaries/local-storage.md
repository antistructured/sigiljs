# Local storage boundaries

The browser or runtime storage layer returns plain data.
The data may be missing, changed between app versions, or tampered with.
Always describe the stored shape and assert loaded values before using them.

Use `safeParse()` when missing or corrupted data should fall back to
defaults instead of blocking a render or page load.

## Recommended style

```js
const ThemeSettings = sigil.exact({
  theme: oneOf('light', 'dark', 'system'),
  fontSize: optional(Number),
  reducedMotion: optional(Boolean),
});
```

## Load from storage

```js
const stored = localStorage.getItem('theme-settings');
const parsed = stored ? JSON.parse(stored) : {};

const settings = ThemeSettings.safeParse(parsed);
if (!settings.success) {
  localStorage.removeItem('theme-settings');
  return ThemeSettings.mock();
}
```

Local storage boundaries are useful for:

- user preference payloads
- feature toggle state
- offline action queues
- draft form data
- persisted search state
