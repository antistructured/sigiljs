import { oneOf, optional, sigil } from '../../src/index.js';

const LeadIntent = sigil.exact({
  intent: oneOf('book_demo', 'ask_pricing', 'support_request', 'not_relevant'),
  confidence: Number,
  summary: String,
  nextStep: optional(String),
});

const providerSchema = LeadIntent.toJSONSchema();
const simulatedModelOutput = {
  intent: 'book_demo',
  confidence: 0.86,
  summary: 'Prospect wants a product walkthrough.',
  nextStep: 'Send scheduling link',
};
const result = LeadIntent.safeParse(simulatedModelOutput);
const invalid = LeadIntent.safeParse({ intent: 'buy_now', confidence: 'high', summary: 'Bad enum and confidence' });
const mock = LeadIntent.mock({ includeOptional: true });
const cases = LeadIntent.cases({ includeOptional: true });
const report = LeadIntent.test(cases);

function repairPrompt(error) {
  return `Return JSON matching the schema. Fix field at path: ${error.path.join('.')}. Expected: ${error.expected}.`;
}

if (!result.success) throw result.error;
if (invalid.success) throw new Error('expected invalid model output');
if (!report.success) throw new Error('lead intent proof should pass');

console.log(JSON.stringify({
  schemaType: providerSchema.type,
  required: providerSchema.required,
  parsedIntent: result.data.intent,
  invalidPath: invalid.error.path,
  repairLoopPseudocode: repairPrompt(invalid.error),
  mock,
  report: report.success,
}, null, 2));
