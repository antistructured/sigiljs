function assertSigilContract(value, label) {
  if (
    value &&
    value.kind === 'sigil.contract' &&
    typeof value.parse === 'function' &&
    typeof value.safeParse === 'function' &&
    typeof value.toOpenAPI === 'function'
  ) {
    return;
  }

  throw new Error(`httpContract ${label} must be a Sigil contract`);
}

function safe(fn) {
  try {
    return { success: true, data: fn() };
  } catch (error) {
    return { success: false, error };
  }
}

function openAPIFor(contract) {
  return {
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: contract.request.toOpenAPI(),
        },
      },
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: contract.response.toOpenAPI(),
          },
        },
      },
    },
  };
}

export function httpContract({ request, response } = {}) {
  assertSigilContract(request, 'request');
  assertSigilContract(response, 'response');

  const contract = Object.freeze({
    kind: 'sigil.httpContract',
    request,
    response,
    parseRequest: (body) => request.parse(body),
    safeParseRequest: (body) => request.safeParse(body),
    serializeResponse: (body) => response.serialize(body),
    safeSerializeResponse: (body) => safe(() => response.serialize(body)),
    toOpenAPI: () => openAPIFor(contract),
    handler: (fn) => async (body) => {
      const parsedRequest = contract.parseRequest(body);
      const rawResponse = await fn(parsedRequest);
      return contract.serializeResponse(rawResponse);
    },
  });

  return contract;
}
