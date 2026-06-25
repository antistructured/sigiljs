import { oneOf, sigil } from '@weipertda/sigiljs';

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

const validSample = LeadIntent.mock();
console.log('Valid LLM output sample:', JSON.stringify(validSample, null, 2));

const report = LeadIntent.test();
console.log('\nLLM output contract report:', JSON.stringify(report, null, 2));
