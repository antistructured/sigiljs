import { optional, sigil } from '../src/index.js';

const UserV1 = sigil(
  {
    id: Number,
    username: String,
    email: optional(String),
    role: String,
  },
  { name: 'User', version: '1.0.0' },
);

const UserV2 = sigil.exact(
  {
    id: Number,
    displayName: String,
    email: String,
    role: String,
    lastLoginAt: optional(Number),
  },
  { name: 'User', version: '1.1.0' },
);

const changes = UserV2.diff(UserV1);

console.log('Contract diff:');
console.log(JSON.stringify(changes, null, 2));

const breaking = changes.filter((change) => change.impact === 'breaking');
if (breaking.length > 0) {
  console.log('Migration note: breaking contract changes need review.');
  for (const change of breaking) {
    console.log(`- ${change.kind} at ${change.path.join('.') || '(root)'}`);
  }
}

const metadataChanges = changes.filter((change) =>
  change.kind.startsWith('metadata.'),
);
if (metadataChanges.length > 0) {
  console.log('Lifecycle note: contract metadata changed.');
}
