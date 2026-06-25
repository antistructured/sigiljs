/**
 * User contract for CLI workflow recipe examples.
 */
import { oneOf, optional, sigil } from '../../../src/index.js';

export default sigil.exact({
  id: String,
  name: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});
