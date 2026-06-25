/**
 * New user contract for diff examples.
 */
import { oneOf, optional, sigil } from '../../../src/index.js';

export default sigil.exact({
  id: String,
  name: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});
