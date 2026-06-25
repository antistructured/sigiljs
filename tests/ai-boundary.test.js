import { describe, test, expect } from 'bun:test';
import { oneOf, sigil } from '../src/index.js';

const llmContract = sigil.exact({
  model: String,
  urgency: oneOf('low', 'medium', 'high'),
  summary: String,
});

const toolCallArgs = sigil.exact({
  name: String,
  arguments: {
    recipient: String,
    amount: Number,
  },
});

describe('AI boundary contracts', () => {
  test('LLM structured output valid case', () => {
    const result = llmContract.safeParse({
      model: 'assistant',
      urgency: 'low',
      summary: 'ok',
    });

    expect(result.success).toBe(true);
  });

  test('LLM structured output invalid enum case', () => {
    const result = llmContract.safeParse({
      model: 'assistant',
      urgency: 'urgent',
      summary: 'ok',
    });

    expect(result.success).toBe(false);

    const error = result.error;
    expect(error instanceof Error).toBe(true);

    const issue = error.issues?.[0];
    if (issue) {
      expect(issue.path).toEqual(expect.arrayContaining(['urgency']));
    }
  });

  test('LLM structured output missing required field', () => {
    const result = llmContract.safeParse({
      model: 'assistant',
      urgency: 'medium',
    });

    expect(result.success).toBe(false);

    if (result.error.issues?.length) {
      expect(result.error.issues[0].path).toEqual(
        expect.arrayContaining(['summary']),
      );
    }
  });

  test('AI tool-call args valid case', () => {
    const result = toolCallArgs.safeParse({
      name: 'transfer',
      arguments: {
        recipient: 'acme',
        amount: 100,
      },
    });

    expect(result.success).toBe(true);
  });

  test('AI tool-call args invalid case', () => {
    const result = toolCallArgs.safeParse({
      name: 'transfer',
      arguments: {
        recipient: 'acme',
      },
    });

    expect(result.success).toBe(false);
  });

  test('JSON Schema projection bridge', () => {
    const schema = llmContract.toJSONSchema();

    expect(schema).toEqual(
      expect.objectContaining({
        type: 'object',
        required: expect.arrayContaining(['model', 'urgency', 'summary']),
        properties: expect.objectContaining({
          urgency: expect.objectContaining({
            enum: expect.arrayContaining(['low', 'medium', 'high']),
          }),
        }),
      }),
    );
  });
});
