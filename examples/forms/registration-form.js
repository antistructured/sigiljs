/**
 * Registration Form — Form Value Enforcement Example
 *
 * Shows a multi-field registration form with optional fields,
 * literal union (select), and both valid and invalid submissions.
 *
 * No framework required. No DOM required. No network calls.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

// Define the registration contract
const RegistrationForm = sigil.exact({
  name: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});

// Valid submission
const formValues = {
  name: 'Alex',
  email: 'alex@example.com',
  role: 'user',
};

const result = RegistrationForm.safeParse(formValues);

if (!result.success) {
  console.error('Registration failed:', result.error.message);
} else {
  console.log('Registration accepted:', result.data);
}

// Invalid: bad role value
const badRole = {
  name: 'Sam',
  email: 'sam@example.com',
  role: 'superuser', // not in oneOf
};

const badResult = RegistrationForm.safeParse(badRole);
console.log('Bad role success:', badResult.success); // false
if (!badResult.success) {
  console.log('Error path:', badResult.error.path);
}

// Projection — what form fields does this contract need?
const constraints = RegistrationForm.toFormConstraints();
console.log('Form fields:');
for (const field of Object.values(constraints.fields)) {
  const extras = field.options ? ` options=${JSON.stringify(field.options)}` : '';
  console.log(` ${field.name}: type=${field.type}, required=${field.required}${extras}`);
}
