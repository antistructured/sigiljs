import { oneOf, sigil } from '../../src/index.js';

const SupportTicketClassification = sigil.exact({
  category: oneOf('billing', 'bug', 'account', 'feature_request'),
  priority: oneOf('low', 'medium', 'high'),
  shouldEscalate: Boolean,
  rationale: String,
});

const jsonSchema = SupportTicketClassification.toJSONSchema();

function validateModelOutput(output) {
  const result = SupportTicketClassification.safeParse(output);
  if (result.success) return { ok: true, data: result.data };
  return {
    ok: false,
    repairInstruction: {
      message: 'Regenerate only the invalid JSON fields.',
      path: result.error.path,
      expected: result.error.expected,
      actual: result.error.actual,
    },
  };
}

const valid = validateModelOutput({
  category: 'bug',
  priority: 'high',
  shouldEscalate: true,
  rationale: 'User reports data loss after export.',
});
const invalid = validateModelOutput({
  category: 'outage',
  priority: 'urgent',
  shouldEscalate: 'yes',
  rationale: 'Bad literal values.',
});
const proof = SupportTicketClassification.test(SupportTicketClassification.cases());

if (!valid.ok) throw new Error('expected valid model output');
if (invalid.ok) throw new Error('expected invalid model output');
if (!proof.success) throw new Error('classification proof should pass');

console.log(JSON.stringify({
  jsonSchemaProperties: Object.keys(jsonSchema.properties),
  validCategory: valid.data.category,
  invalidRepairPath: invalid.repairInstruction.path,
  proof: proof.success,
}, null, 2));
