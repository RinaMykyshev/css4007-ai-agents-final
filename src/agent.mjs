
import { complete } from './model-client.mjs';
import { toolDefinitions, executeTool } from './tools.mjs';

const systemPrompt = `
You are AI Study Assistant.

Help students understand sample course details and deadlines.

The catalog is illustrative, not connected to a university.

Rules:
- Use tools for course-specific facts.
- Never invent course details, dates, or tool results.
- For general study advice, answer directly without tools.
- If a course is absent, say so.
- Be concise and clear.
`;

export async function runAgent(
  input,
  {
    model = complete,
    logger = () => {},
    maxRounds = 4
  } = {}
) {
  if (
    typeof input !== 'string' ||
    !input.trim() ||
    input.length > 2000
  ) {
    throw new Error('Request must be 1–2000 characters');
  }

  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: input.trim()
    }
  ];

  const trace = [];

  for (let round = 0; round < maxRounds; round++) {
    const msg = await model(messages, toolDefinitions);

    if (
      !msg ||
      (
        msg.tool_calls !== undefined &&
        !Array.isArray(msg.tool_calls)
      )
    ) {
      throw new Error('Invalid model response');
    }

    const calls = msg.tool_calls || [];

    if (!calls.length) {
      if (
        typeof msg.content !== 'string' ||
        !msg.content.trim()
      ) {
        throw new Error('Empty model answer');
      }

      return {
        answer: msg.content.trim(),
        trace
      };
    }

    if (calls.length > 5) {
      throw new Error('Too many tool calls in one round');
    }

    messages.push({
      role: 'assistant',
      content: msg.content ?? null,
      tool_calls: calls
    });

    for (const call of calls) {
      let result;

      try {
        if (
          !call?.id ||
          !call?.function?.name ||
          typeof call.function["arguments"] !== 'string'
        ) {
          throw new Error('Malformed tool call');
        }

        const args = JSON.parse(
          call.function["arguments"]
        );

        result = executeTool(
          call.function.name,
          args
        );

      } catch (error) {
        result = {
          error: error.message
        };
      }

      const record = {
        name: call?.function?.name || 'unknown',
        result
      };

      trace.push(record);
      logger(record);

      messages.push({
        role: 'tool',
        tool_call_id: call.id || 'invalid',
        content: JSON.stringify(result)
      });
    }
  }

  throw new Error('Agent execution limit reached');
}
