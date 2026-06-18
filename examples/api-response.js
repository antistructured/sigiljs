import { Sigil } from '../src/index.js';

const ApiResponse = Sigil.exact`
{
  user: {
    id: string
    email: string
  }
  ok: boolean
}
`;

const upstreamData = {
  user: {
    id: 'user_123',
    email: 'dana@example.com',
  },
  ok: true,
};

const response = ApiResponse.parse(upstreamData);

console.log('API response trusted:', response.user.id);
