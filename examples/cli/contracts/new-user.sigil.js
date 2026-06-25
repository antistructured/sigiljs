/**
 * New user contract — examples/cli/contracts/new-user.sigil.js
 *
 * Updated version of the user contract, for diff examples.
 * Adds email (required) and age (optional) fields.
 */
import { oneOf, optional, sigil } from '../../../src/index.js';

export default sigil.exact({
  id: String,
  name: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});
