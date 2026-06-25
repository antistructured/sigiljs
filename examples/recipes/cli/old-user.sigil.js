/**
 * Old user contract for diff examples.
 */
import { oneOf, sigil } from '../../../src/index.js';

export default sigil.exact({
  id: String,
  name: String,
  role: oneOf('admin', 'user'),
});
