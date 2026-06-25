/**
 * Form Errors — Path-aware error extraction example
 *
 * Shows how SigilValidationError carries field-level path information
 * that a form UI can use to highlight specific fields.
 *
 * No framework required. No DOM required. No network calls.
 */
import { optional, oneOf, sigil, SigilValidationError } from '../../src/index.js';

const AddressForm = sigil.exact({
  street: String,
  city: String,
  country: oneOf('US', 'CA', 'GB'),
  postalCode: optional(String),
});

function validateForm(values) {
  const result = AddressForm.safeParse(values);
  if (result.success) {
    return { ok: true, data: result.data };
  }

  const error = result.error;
  return {
    ok: false,
    message: error.message,
    field: error.path?.at(-1) ?? null,
    path: error.path ?? [],
  };
}

// Missing city
const r1 = validateForm({ street: '123 Main St', country: 'US' });
console.log('Missing city result:', JSON.stringify(r1));

// Invalid country
const r2 = validateForm({ street: '123 Main St', city: 'Portland', country: 'AU' });
console.log('Bad country result:', JSON.stringify(r2));

// Valid
const r3 = validateForm({ street: '123 Main St', city: 'Portland', country: 'US' });
console.log('Valid result:', JSON.stringify(r3));

// Direct parse throws SigilValidationError — catchable
try {
  AddressForm.parse({ street: '123 Main', city: 'Portland', country: 'ZZ' });
} catch (err) {
  if (err instanceof SigilValidationError) {
    console.log('Caught SigilValidationError:');
    console.log('  message:', err.message);
    console.log('  path:', err.path);
    console.log('  code:', err.code);
  }
}
