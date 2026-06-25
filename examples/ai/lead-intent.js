import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const LeadIntent = sigil.exact({
  name: String,
  email: String,
  budget: optional(Number),
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

const llmOutput = {
  name: 'Alex',
  email: 'alex@example.com',
  urgency: 'high',
  summary: 'Interested in a same-week consultation.',
};

const result = LeadIntent.safeParse(llmOutput);

if (!result.success) {
  console.error(result.error);
} else {
  console.log(result.data);
}
