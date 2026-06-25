/**
 * LLM Output Recipe — examples/recipes/llm-output.js
 *
 * Shows how to validate uncertain LLM structured output with a Sigil contract.
 * SigilJS does not call the model. It validates the output your app receives.
 * No provider SDK. No network calls. Deterministic simulated output only.
 */
import { oneOf, sigil } from '../../src/index.js';

// ── Contract ──────────────────────────────────────────────────────────────

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

// ── JSON Schema bridge ────────────────────────────────────────────────────

// Pass this schema to your LLM provider's structured-output API
const outputSchema = LeadIntent.toJSONSchema();
console.log('JSON Schema (pass to provider):');
console.log('  type:', outputSchema.type);
console.log('  required:', outputSchema.required);

// ── Validate simulated model output ───────────────────────────────────────

// Simulate what a well-formed model response looks like
const wellFormedOutput = {
  name: 'Alex Kim',
  email: 'alex@example.com',
  urgency: 'high',
  summary: 'Needs enterprise pricing for a 200-seat rollout.',
};

const result = LeadIntent.safeParse(wellFormedOutput);
console.log('\nWell-formed output valid:', result.success);
if (result.success) {
  console.log('Trusted lead:', result.data.name, '| urgency:', result.data.urgency);
}

// Simulate a model hallucinating an invalid urgency value
const badUrgency = {
  name: 'Sam',
  email: 'sam@example.com',
  urgency: 'critical', // not in oneOf
  summary: 'Urgent request.',
};

const r2 = LeadIntent.safeParse(badUrgency);
console.log('\nBad urgency valid:', r2.success); // false
if (!r2.success) {
  console.log('Failed field:', r2.error.path);
  console.log('Error:', r2.error.message);
}

// Simulate missing required field
const incomplete = {
  name: 'Dana',
  urgency: 'low',
  summary: 'Inquiry.',
  // email missing
};

const r3 = LeadIntent.safeParse(incomplete);
console.log('\nIncomplete output valid:', r3.success); // false
if (!r3.success) {
  console.log('Failed field:', r3.error.path);
}

// ── Prove ─────────────────────────────────────────────────────────────────

const fixture = LeadIntent.mock({ seed: 1 });
console.log('\nMock fixture:', fixture);

const report = LeadIntent.test(LeadIntent.cases());
console.log('Contract proof:', report.success ? 'passed' : 'failed');
console.log('  valid passed:', report.valid.passed);
console.log('  invalid passed:', report.invalid.passed);
