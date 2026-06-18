import { oneOf, optional, sigil } from '../src/index.js';

const CreateTicketToolCall = sigil.exact({
  title: String,
  priority: oneOf('low', 'medium', 'high'),
  assigneeEmail: optional(String),
  body: String,
});

// Tool-call schema bridge for AI APIs that accept JSON Schema-like parameters.
const toolDefinition = {
  type: 'function',
  function: {
    name: 'create_ticket',
    description: 'Create a support ticket from a validated AI tool call.',
    parameters: CreateTicketToolCall.toJSONSchema(),
  },
};

// Simulated model-produced tool-call arguments. Treat as untrusted until parsed.
const modelToolCallArguments = {
  title: 'Customer cannot access dashboard',
  priority: 'high',
  assigneeEmail: 'support@example.com',
  body: 'Customer reports a 403 after logging in.',
};

// Boundary: uncertain AI tool args → Sigil contract → trusted runtime object.
const ticket = CreateTicketToolCall.parse(modelToolCallArguments);

console.log('AI tool definition:', JSON.stringify(toolDefinition, null, 2));
console.log('AI tool call trusted:', ticket.priority);
