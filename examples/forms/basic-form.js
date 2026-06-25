/**
 * Basic Form — Form Value Enforcement Example
 *
 * Shows how a Sigil contract turns unknown form values into
 * trusted runtime data using parse() and safeParse().
 *
 * No framework required. No DOM required. No network calls.
 */
import { optional, sigil } from '../../src/index.js';

// Define the form contract once
const ContactForm = sigil.exact({
  name: String,
  email: String,
  message: String,
  phone: optional(String),
});

// Valid submission
const validValues = {
  name: 'Alex',
  email: 'alex@example.com',
  message: 'Hello, I would like to get in touch.',
};

const trusted = ContactForm.parse(validValues);
console.log('Trusted name:', trusted.name);
console.log('Trusted email:', trusted.email);
console.log('Phone (optional):', trusted.phone); // undefined

// Invalid submission — missing required field
const invalidValues = {
  name: 'Alex',
  message: 'Hello',
  // email is missing
};

const result = ContactForm.safeParse(invalidValues);
if (!result.success) {
  console.log('Validation failed:', result.error.message);
} else {
  console.log('Trusted:', result.data);
}

// Form constraint projection
const constraints = ContactForm.toFormConstraints();
console.log('Field types:');
for (const [name, field] of Object.entries(constraints.fields)) {
  console.log(` ${name}: type=${field.type}, required=${field.required}`);
}
