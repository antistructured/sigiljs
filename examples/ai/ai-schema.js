import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  budget: optional(Number),
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

const responseFormat = {
  name: 'lead_intent',
  schema: LeadIntent.toJSONSchema(),
};

const lead = LeadIntent.parse({
  name: 'Dana',
  email: 'dana@example.com',
  urgency: 'high',
  summary: 'Interested in using SigilJS at API and AI boundaries.',
});

console.log('AI schema:', JSON.stringify(responseFormat, null, 2));
console.log('AI output trusted:', lead);
