/**
 * Quickstart example — examples/quickstart/user.js
 *
 * Demonstrates the five pillars of SigilJS:
 * Define → Enforce → Transform → Project → Prove
 *
 * Import from the published package:
 *   npm install @weipertda/sigiljs
 *   bun add @weipertda/sigiljs
 *
 * Or run from the repo:
 *   bun run examples/quickstart/user.js
 */
import { oneOf, optional, sigil } from '../../src/index.js';

// ── Define ────────────────────────────────────────────────────────────────

const User = sigil.exact({
  id: String,
  email: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});

// ── Enforce ───────────────────────────────────────────────────────────────

const validInput = { id: 'user_1', email: 'alex@example.com', role: 'user' };
const result = User.safeParse(validInput);

console.log('safeParse valid:', result.success); // true
console.log('Trusted data:', result.data);

const invalidInput = { id: 'user_2', email: 'x@x.com', role: 'superuser' };
const badResult = User.safeParse(invalidInput);

console.log('safeParse invalid:', badResult.success); // false
console.log('Error path:', badResult.error.path);
console.log('Error message:', badResult.error.message);

// ── Transform ─────────────────────────────────────────────────────────────

const NormalizedUser = User.transform((data) => ({
  ...data,
  email: data.email.toLowerCase().trim(),
}));

const normalized = NormalizedUser.parse({
  id: 'user_3',
  email: '  Alex@Example.COM  ',
  role: 'admin',
});
console.log('Normalized email:', normalized.email); // alex@example.com

// ── Project ───────────────────────────────────────────────────────────────

const jsonSchema = User.toJSONSchema();
console.log('JSON Schema type:', jsonSchema.type); // object
console.log('JSON Schema required:', jsonSchema.required);

// ── Prove ─────────────────────────────────────────────────────────────────

const fixture = User.mock({ seed: 1 });
console.log('Mock fixture:', fixture);
console.log('Fixture valid:', User.safeParse(fixture).success); // true

const { valid, invalid } = User.cases();
console.log('Valid cases:', valid.length);
console.log('Invalid cases:', invalid.length);
