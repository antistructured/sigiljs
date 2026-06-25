import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const SupportTicket = sigil.exact({
  title: String,
  priority: oneOf('low', 'medium', 'high'),
  assigneeEmail: optional(String),
  body: String,
});

const validToolArgs = {
  title: 'Customer cannot access dashboard',
  priority: 'high',
  assigneeEmail: 'support@example.com',
  body: 'Customer reports a 403 after logging in.',
};

const invalidToolArgs = {
  title: 123,
  priority: 'urgent',
  assigneeEmail: 'not-an-email',
  body: 'Customer reports a 403 after logging in.',
};

function assertBoundary(label, contract, value) {
  try {
    console.log(`${label} trusted data:\n${JSON.stringify(contract.assert(value), null, 2)}`);
  } catch (error) {
    console.log(`${label} error: ${error.message}`);
  }
}

assertBoundary('Support ticket valid tool args', SupportTicket, validToolArgs);
assertBoundary('Support ticket invalid tool args', SupportTicket, invalidToolArgs);
