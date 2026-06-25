import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  budget: optional(Number),
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

const validOutput = {
  name: 'Alex',
  email: 'alex@example.com',
  urgency: 'high',
  summary: 'Interested in a same-week consultation.',
};

const invalidOutput = {
  name: 'Alex',
  email: 'alex@example.com',
  urgency: 'critical',
  summary: 'Interested in a same-week consultation.',
};

function parseBoundary(label, contract, value) {
  const result = contract.safeParse(value);
  if (result.success) {
    console.log(`${label} trusted data:\n${JSON.stringify(result.data, null, 2)}`);
  } else {
    console.log(`${label} error: ${result.error.message}`);
  }
}

parseBoundary('LeadIntent valid output', LeadIntent, validOutput);
parseBoundary('LeadIntent invalid output', LeadIntent, invalidOutput);
