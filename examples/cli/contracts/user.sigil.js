/**
 * User contract — examples/cli/contracts/user.sigil.js
 *
 * A simple user record contract for CLI workflow examples.
 * Load with: sigil describe examples/cli/contracts/user.sigil.js
 */
import { oneOf, optional, sigil } from '../../../src/index.js';

export default sigil.exact({
  id: String,
  name: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});
