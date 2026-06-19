import { Sigil, sigil, oneOf, optional, union } from '../src/index.js';

// Contracts for the boundary examples pack.

const Method = oneOf('get', 'post', 'put', 'delete');
const ApiRequest = sigil.exact({
  path: String,
  method: Method,
  body: optional(Object),
});

const ApiResponse = sigil.exact({
  status: Number,
  headers: optional(Object),
  body: optional(Object),
});

const DbRow = sigil.exact({
  id: Number,
  title: String,
  createdBy: String,
  archived: optional(Boolean),
});

const DbWrite = sigil.exact({
  table: String,
  row: Object,
  returning: optional(Array),
});

const Form = sigil.exact({
  name: String,
  email: String,
  age: optional(Number),
  role: oneOf('user', 'admin'),
});

const Event = sigil.exact({
  type: String,
  occurredAt: Number,
  payload: union(Object, Array),
});

const QueueJob = sigil.exact({
  jobId: String,
  action: oneOf('send_email', 'process_report'),
  payload: Object,
});

const Webhook = sigil.exact({
  provider: String,
  topic: String,
  payload: Object,
});

const StorageEntry = sigil.exact({
  userId: String,
  token: String,
  meta: optional(Object),
});

const Config = sigil.exact({
  env: oneOf('development', 'staging', 'production'),
  port: Number,
  features: Array,
});

const PluginInput = sigil.exact({
  name: String,
  version: String,
  settings: Object,
  strict: optional(Boolean),
});

const AiToolCall = sigil.exact({
  title: String,
  priority: oneOf('low', 'medium', 'high'),
  assigneeEmail: optional(String),
  body: String,
});

const LlmIntent = sigil.exact({
  name: String,
  email: String,
  budget: optional(Number),
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

function demo(title, fn) {
  console.log(`\n=== ${title} ===`);
  fn();
}

function assertBoundary(label, contract, value) {
  try {
    const trusted = contract.assert(value);
    console.log(`${label} asserted:\n` + JSON.stringify(trusted, null, 2));
  } catch (error) {
    const expected = error?.expected ?? error?.message ?? error;
    console.log(`${label} assert error: ${expected}`);
  }
}

function parseBoundary(label, contract, value) {
  try {
    const trusted = contract.parse(value);
    console.log(`${label} parsed:\n` + JSON.stringify(trusted, null, 2));
  } catch (error) {
    const expected = error?.expected ?? error?.message ?? error;
    console.log(`${label} parse error: ${expected}`);
  }
}

function safeParseBoundary(label, contract, value) {
  const result = contract.safeParse(value);
  if (result.success) {
    console.log(`${label} safeParse success:\n` + JSON.stringify(result.data, null, 2));
  } else {
    console.log(`${label} safeParse error: ${result.error?.expected ?? result.error?.message ?? result.error}`);
  }
}

demo('API request boundary', () => {
  const unknownBody = {
    path: '/login',
    method: 'post',
    body: { email: 'a@b.com' },
  };

  parseBoundary('API request valid', ApiRequest, unknownBody);
  safeParseBoundary('API request invalid body type', ApiRequest, { path: '/login', method: 'post', body: null });
});

demo('API response boundary', () => {
  const raw = '{"status": 200, "body": {"ok": true}}';
  const response = JSON.parse(raw);
  parseBoundary('API response valid', ApiResponse, response);
  assertBoundary('API response trust', ApiResponse, response);
});

demo('Database read boundary', () => {
  const dbRow = { id: 1, title: 'Ship boundary tests', createdBy: 'kieran' };
  safeParseBoundary('DB row valid', DbRow, dbRow);
  safeParseBoundary('DB row missing id', DbRow, { title: 'Missing id', createdBy: 'system' });
});

demo('Database write boundary', () => {
  const insertPayload = { table: 'tickets', row: { title: 'Fix readme', status: 'draft' } };
  const invalidPayload = { table: 123, row: null };
  parseBoundary('DB write valid', DbWrite, insertPayload);
  safeParseBoundary('DB write invalid', DbWrite, invalidPayload);
});

demo('Form submit boundary', () => {
  const submission = { name: 'Dana', email: 'dana@example.com', role: 'admin' };
  const badSubmission = { name: '', email: 'x', role: 'superadmin' };
  parseBoundary('Form submit valid', Form, submission);
  safeParseBoundary('Form submit invalid', Form, badSubmission);
});

demo('Event message boundary', () => {
  const event = {
    type: 'user.updated',
    occurredAt: Date.now(),
    payload: { userId: 'u_123', changes: ['name'] },
  };
  parseBoundary('Event valid', Event, event);
  safeParseBoundary('Event missing occurredAt', Event, { type: 'user.updated', payload: {} });
});

demo('Queue message boundary', () => {
  const message = {
    jobId: 'job_42',
    action: 'send_email',
    payload: { to: 'ops@example.com', subject: 'Daily report' },
  };
  parseBoundary('Queue message valid', QueueJob, message);
  safeParseBoundary('Queue message unsupported action', QueueJob, { jobId: 'job_43', action: 'redeploy', payload: {} });
});

demo('Webhook boundary', () => {
  const payload = {
    provider: 'github',
    topic: 'ping',
    payload: { zen: 'Keep it logically awesome.' },
  };
  assertBoundary('Webhook valid', Webhook, payload);
  safeParseBoundary('Webhook missing topic', Webhook, { provider: 'stripe', payload: {} });
});

demo('Local storage boundary', () => {
  const raw = '{"userId":"u_99","token":"abc123","meta":{"theme":"dark"}}';
  const stored = JSON.parse(raw);
  parseBoundary('Storage entry valid', StorageEntry, stored);
  safeParseBoundary('Storage entry tampered token', StorageEntry, { userId: 'u_99', token: null });
});

demo('Config file boundary', () => {
  const config = { env: 'production', port: 3000, features: ['beta'] };
  parseBoundary('Config valid', Config, config);
  safeParseBoundary('Config invalid port type', Config, { env: 'production', port: 'three-thousand' });
});

demo('Plugin input boundary', () => {
  const options = { name: 'auth-plugin', version: '1.0.0', settings: { maxAttempts: 3 } };
  parseBoundary('Plugin input valid', PluginInput, options);
  assertBoundary('Plugin input strict', PluginInput, { name: 'auth-plugin', version: '1.0.0', settings: {}, strict: true });
});

demo('AI tool call boundary', () => {
  const toolArgs = {
    title: 'Customer cannot access dashboard',
    priority: 'high',
    assigneeEmail: 'support@example.com',
    body: 'Customer reports a 403 after logging in.',
  };
  const toolDefinition = {
    type: 'function',
    function: {
      name: 'create_ticket',
      description: 'Create a support ticket from a validated AI tool call.',
      parameters: AiToolCall.toJSONSchema(),
    },
  };

  parseBoundary('AI tool call args', AiToolCall, toolArgs);
  console.log('AI tool definition:\n' + JSON.stringify(toolDefinition, null, 2));
});

demo('LLM structured output boundary', () => {
  const schema = {
    name: 'lead_intent',
    schema: LlmIntent.toJSONSchema(),
  };
  const output = {
    name: 'Dana',
    email: 'dana@example.com',
    urgency: 'high',
    summary: 'Interested in a production SigilJS rollout.',
  };

  parseBoundary('LLM structured output', LlmIntent, output);
  console.log('Structured output schema:\n' + JSON.stringify(schema, null, 2));
});
