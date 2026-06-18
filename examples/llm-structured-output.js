import { oneOf, optional, sigil } from '../src/index.js';

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  budget: optional(Number),
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

// This is the shape you can hand to structured-output-capable LLM APIs.
const structuredOutputSchema = {
  name: 'lead_intent',
  schema: LeadIntent.toJSONSchema(),
};

// Simulated uncertain AI output returned by an LLM.
const llmOutput = {
  name: 'Dana',
  email: 'dana@example.com',
  urgency: 'high',
  summary: 'Interested in a production SigilJS rollout.',
};

// Boundary: uncertain AI output → Sigil contract → trusted runtime object.
const lead = LeadIntent.parse(llmOutput);

console.log(
  'LLM structured output schema:',
  JSON.stringify(structuredOutputSchema, null, 2),
);
console.log('LLM output trusted:', lead.urgency);
