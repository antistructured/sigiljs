import { oneOf, optional, sigil } from '@weipertda/sigiljs';

const CreateTicketArgs = sigil.exact({
  title: String,
  customerEmail: String,
  priority: oneOf('low', 'medium', 'high'),
  tags: optional(Array),
});

const toolCall = {
  name: 'create_ticket',
  arguments: {
    title: 'Login issue',
    customerEmail: 'customer@example.com',
    priority: 'high',
  },
};

const badToolCall = {
  name: 'create_ticket',
  arguments: {
    title: 'Login issue',
    customerEmail: 'customer@example.com',
    priority: 'urgent',
  },
};

function parseBoundary(label, contract, value) {
  try {
    console.log(`${label}: ${JSON.stringify(contract.parse(value))}`);
  } catch (error) {
    console.log(`${label} error: ${error.message}`);
  }
}

parseBoundary('Valid create_ticket args', CreateTicketArgs, toolCall.arguments);
parseBoundary('Invalid create_ticket args', CreateTicketArgs, badToolCall.arguments);
