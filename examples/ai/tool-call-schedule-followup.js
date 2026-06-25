import { oneOf, sigil } from '@weipertda/sigiljs';

const ScheduleFollowupArgs = sigil.exact({
  ticketId: String,
  followUpAt: String,
  channel: oneOf('email', 'sms', 'in_app'),
});

const toolCall = {
  name: 'schedule_followup',
  arguments: {
    ticketId: 'TICKET-42',
    followUpAt: '2026-06-22T09:00:00Z',
    channel: 'email',
  },
};

const badToolCall = {
  name: 'schedule_followup',
  arguments: {
    ticketId: 'TICKET-42',
    followUpAt: '2026-06-22T09:00:00Z',
    channel: 'push',
  },
};

function safeParseBoundary(label, contract, value) {
  const result = contract.safeParse(value);
  if (result.success) {
    console.log(`${label} trusted data:\n${JSON.stringify(result.data, null, 2)}`);
  } else {
    console.log(`${label} error: ${result.error.message}`);
  }
}

safeParseBoundary('Valid schedule_followup args', ScheduleFollowupArgs, toolCall.arguments);
safeParseBoundary('Invalid schedule_followup args', ScheduleFollowupArgs, badToolCall.arguments);
