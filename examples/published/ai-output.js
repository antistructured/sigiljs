import { sigil, oneOf } from '@weipertda/sigiljs';

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

const llmOutput = {
  name: 'Dana',
  email: 'dana@example.com',
  urgency: 'high',
  summary: 'Interested in using SigilJS at API and AI boundaries.',
};

const result = LeadIntent.safeParse(llmOutput);

console.log(result);
