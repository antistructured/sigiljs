import { httpContract, oneOf, optional, sigil, type HttpContract, type SigilContract } from '@weipertda/sigiljs';

type SupportTicket = {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  assigneeEmail?: string;
};

type TicketResponse = {
  ok: boolean;
  ticketId: string;
};

const TicketContract: SigilContract<SupportTicket> = sigil.exact<SupportTicket>({
  id: String,
  title: String,
  priority: oneOf('low', 'medium', 'high'),
  assigneeEmail: optional(String),
});

const ResponseContract: SigilContract<TicketResponse> = sigil.exact<TicketResponse>({
  ok: Boolean,
  ticketId: String,
});

const ticket: SupportTicket = TicketContract.parse({
  id: 'tkt_1',
  title: 'Cannot export report',
  priority: 'high',
});

const route: HttpContract = httpContract({
  method: 'POST',
  path: '/tickets',
  request: TicketContract,
  response: ResponseContract,
});

const requestResult = route.safeParseRequest({ body: ticket });
const responseResult = route.safeParseResponse({
  status: 200,
  body: { ok: true, ticketId: ticket.id },
});

const routeSchema: Record<string, unknown> = route.toOpenAPI();
const pathItem: Record<string, unknown> = route.toPathItem();

void requestResult;
void responseResult;
void routeSchema;
void pathItem;
