/**
 * Settings Form — Preference form with boolean fields and optional overrides
 *
 * Shows a user preferences/settings form including boolean toggles,
 * optional fields, and literal union options.
 *
 * No framework required. No DOM required. No network calls.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

// Define
const SettingsForm = sigil.exact({
  displayName: String,
  emailNotifications: Boolean,
  pushNotifications: Boolean,
  theme: oneOf('light', 'dark', 'system'),
  language: oneOf('en', 'es', 'fr', 'de'),
  bio: optional(String),
  websiteUrl: optional(String),
});

// Enforce — valid settings update
const settings = {
  displayName: 'Jordan',
  emailNotifications: true,
  pushNotifications: false,
  theme: 'dark',
  language: 'en',
  bio: 'I write software and drink coffee.',
};

const result = SettingsForm.safeParse(settings);
if (result.success) {
  console.log('Settings saved for:', result.data.displayName);
  console.log('Theme:', result.data.theme);
  console.log('Notifications:', result.data.emailNotifications ? 'on' : 'off');
} else {
  console.error('Settings rejected:', result.error.message);
}

// Project — form constraint metadata for building a settings UI
const constraints = SettingsForm.toFormConstraints();
console.log('\nSettings form fields:');
for (const field of Object.values(constraints.fields)) {
  const opts = field.options ? ` [${field.options.join('|')}]` : '';
  console.log(` ${field.label}: type=${field.type}${opts}, required=${field.required}`);
}

// Prove — test the contract
const proof = SettingsForm.test({
  valid: [
    {
      label: 'minimal settings (no optionals)',
      value: {
        displayName: 'Alex',
        emailNotifications: false,
        pushNotifications: false,
        theme: 'system',
        language: 'es',
      },
    },
  ],
  invalid: [
    {
      label: 'invalid theme value',
      value: {
        displayName: 'Alex',
        emailNotifications: false,
        pushNotifications: false,
        theme: 'solarized', // not in oneOf
        language: 'en',
      },
      expectedPath: ['theme'],
    },
  ],
});
console.log('\nProof passed:', proof.success);
