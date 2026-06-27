import { oneOf, optional, sigil } from '../../src/index.js';

const SettingsForm = sigil.exact({
  profile: sigil.exact({
    displayName: optional(String),
    timezone: oneOf('UTC', 'America/New_York', 'Europe/Berlin'),
  }),
  notifications: sigil.exact({
    marketing: optional(Boolean),
    product: optional(Boolean),
  }),
});

const submitted = {
  profile: { displayName: 'Dana', timezone: 'UTC' },
  notifications: { product: true },
};
const result = SettingsForm.safeParse(submitted);
const invalid = SettingsForm.safeParse({ profile: { timezone: 'Mars/Base' }, notifications: { product: true } });
const constraints = SettingsForm.toFormConstraints();
const cases = SettingsForm.cases();
const report = SettingsForm.test(cases);

if (!result.success) throw result.error;
if (invalid.success) throw new Error('expected invalid timezone');
if (!report.success) throw new Error('settings generated cases should pass');

console.log(JSON.stringify({
  parsedTimezone: result.data.profile.timezone,
  invalidPath: invalid.error.path,
  topLevelFields: Object.keys(constraints.fields),
  nestedProfileFields: Object.keys(constraints.fields.profile.fields),
  timezonePath: constraints.fields.profile.fields.timezone.path,
  report: report.success,
}, null, 2));
