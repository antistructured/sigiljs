/**
 * Checkout Form — Multi-section form with nested object and optional fields
 *
 * Shows a checkout form with shipping address (nested), optional gift note,
 * and plan selection — all without a payment provider.
 *
 * No framework required. No DOM required. No network calls. No payment provider.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

// Define — shipping address as a nested object
const ShippingAddress = sigil.exact({
  name: String,
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: oneOf('US', 'CA', 'GB'),
});

const CheckoutForm = sigil.exact({
  email: String,
  shippingAddress: ShippingAddress,
  giftNote: optional(String),
  shippingSpeed: oneOf('standard', 'express', 'overnight'),
});

// Enforce — validate a checkout submission
const submission = {
  email: 'alex@example.com',
  shippingAddress: {
    name: 'Alex Kim',
    street: '123 Maple Ave',
    city: 'Portland',
    state: 'OR',
    postalCode: '97201',
    country: 'US',
  },
  shippingSpeed: 'express',
  // giftNote is optional — not provided
};

const result = CheckoutForm.safeParse(submission);
if (result.success) {
  console.log('Checkout accepted for:', result.data.shippingAddress.name);
  console.log('Shipping to:', result.data.shippingAddress.city, result.data.shippingAddress.country);
  console.log('Shipping speed:', result.data.shippingSpeed);
  console.log('Gift note:', result.data.giftNote ?? '(none)');
} else {
  console.error('Checkout rejected:', result.error.message);
}

// Project — form constraint metadata
const constraints = CheckoutForm.toFormConstraints();
console.log('\nCheckout form fields:');
for (const field of Object.values(constraints.fields)) {
  if (field.type === 'object') {
    console.log(` ${field.label} (${field.type}): ${Object.keys(field.fields).join(', ')}`);
  } else {
    const opts = field.options ? ` [${field.options.join('|')}]` : '';
    console.log(` ${field.label}: type=${field.type}${opts}, required=${field.required}`);
  }
}

// Nested address path
const cityField = constraints.fields.shippingAddress.fields.city;
console.log('\nNested city field path:', cityField.path.join('.'));

// Invalid — wrong country
const badCountry = {
  ...submission,
  shippingAddress: { ...submission.shippingAddress, country: 'AU' },
};
const r2 = CheckoutForm.safeParse(badCountry);
console.log('\nBad country success:', r2.success);
if (!r2.success) console.log('Error:', r2.error.message);
