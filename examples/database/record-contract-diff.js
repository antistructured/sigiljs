/**
 * Record Contract Diff — detect persistence shape changes
 *
 * Shows how diff() highlights changes between two versions of
 * a record contract, helping catch breaking schema changes
 * before they cause runtime failures.
 *
 * Contract diffs can highlight persistence shape changes, but
 * they do not generate or execute migrations.
 *
 * No database connection. Plain objects only.
 */
import { oneOf, optional, sigil } from '../../src/index.js';

// Original record contract
const OldUserRecord = sigil.exact({
  id: String,
  email: String,
  name: String,
});

// New record contract — adds role field
const NewUserRecord = sigil.exact({
  id: String,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});

// diff() from old → new: what changed?
const changes = OldUserRecord.diff(NewUserRecord);
console.log('Changes from old to new:', JSON.stringify(changes, null, 2));

// Check for breaking changes
const breaking = changes.filter((c) => c.impact === 'breaking');
const nonBreaking = changes.filter((c) => c.impact !== 'breaking');

console.log('Breaking changes:', breaking.length);
console.log('Non-breaking changes:', nonBreaking.length);

if (breaking.length > 0) {
  console.log('WARNING: Breaking changes detected — review before deploying.');
  for (const c of breaking) {
    console.log(' -', c.kind, 'at', c.path.join('.'));
  }
}

// A field removal is breaking (new contract removes a field old code expects)
const WithoutEmail = sigil.exact({ id: String, name: String });
const removedChanges = NewUserRecord.diff(WithoutEmail);
console.log('\nRemoving email field:');
for (const c of removedChanges) {
  console.log(' -', c.kind, 'at path:', c.path.join('.'), '| impact:', c.impact);
}
