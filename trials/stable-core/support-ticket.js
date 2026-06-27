import { oneOf, optional, sigil } from '../../src/index.js';

const SupportTicketV1 = sigil.exact(
  {
    id: String,
    title: String,
    priority: oneOf('low', 'medium', 'high'),
    status: oneOf('open', 'closed'),
    assigneeEmail: optional(String),
  },
  { name: 'SupportTicket', version: 'v1' },
);

const SupportTicketV2 = sigil.exact(
  {
    id: String,
    title: String,
    priority: oneOf('low', 'medium', 'high', 'urgent'),
    status: oneOf('open', 'triaged', 'closed'),
    assigneeEmail: optional(String),
    customerTier: optional(oneOf('free', 'pro', 'enterprise')),
  },
  { name: 'SupportTicket', version: 'v2' },
);

const incoming = {
  id: 'tkt_001',
  title: 'Cannot invite teammate',
  priority: 'high',
  status: 'open',
};

const result = SupportTicketV1.safeParse(incoming);
if (!result.success) throw result.error;

const changes = SupportTicketV1.diff(SupportTicketV2);
const proof = SupportTicketV2.test(SupportTicketV2.cases());

if (!proof.success) throw new Error('v2 proof should pass');

console.log(
  JSON.stringify(
    {
      trustedTitle: result.data.title,
      v1SchemaRequired: SupportTicketV1.toJSONSchema().required,
      v2TypeScriptHasTier: SupportTicketV2.toTypeScript('SupportTicketV2').includes('customerTier'),
      diffCount: changes.length,
      diffTypes: changes.map((change) => change.type),
      proof: proof.success,
    },
    null,
    2,
  ),
);
