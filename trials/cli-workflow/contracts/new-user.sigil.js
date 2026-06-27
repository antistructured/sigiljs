import { oneOf, optional, sigil } from '../../../src/index.js';

export default sigil.exact({
  id: String,
  email: String,
  role: oneOf('admin', 'member', 'viewer'),
  displayName: optional(String),
  lastLoginAt: optional(String),
});
