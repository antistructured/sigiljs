import { sigil, oneOf } from '@weipertda/sigiljs';

const ApiResponse = sigil.exact({
  id: String,
  name: String,
  role: oneOf('admin', 'user'),
});

const unknownApiResponse = {
  id: 'user_123',
  name: 'Dana',
  role: 'admin',
};

const trustedResponse = ApiResponse.parse(unknownApiResponse);

console.log('trusted API response:', trustedResponse);
