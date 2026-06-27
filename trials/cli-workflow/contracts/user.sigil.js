import { oneOf, optional, sigil } from '../../../src/index.js';

export const User = sigil.exact({
  id: String,
  email: String,
  role: oneOf('admin', 'member', 'viewer'),
  displayName: optional(String),
});

export default User;
