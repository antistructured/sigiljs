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

/**
 * Build the OpenAPI shape for a single response contract at a given status.
 */
function responseSchemaEntry(statusCode, responseContract, description) {
  return {
    [statusCode]: {
      description: description || statusDescription(statusCode),
      content: {
        'application/json': {
          schema: responseContract.toOpenAPI(),
        },
      },
    },
  };
}

function statusDescription(code) {
  const descriptions = {
    200: 'Successful response',
    201: 'Created',
    204: 'No content',
    400: 'Bad request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
    409: 'Conflict',
    422: 'Unprocessable entity',
    500: 'Internal server error',
  };
  return descriptions[code] || `Response ${code}`;
}

function openAPIFor(httpContractObj, responses) {
  const responsesShape = {};

  if (responses && typeof responses === 'object') {
    for (const [code, contract] of Object.entries(responses)) {
      Object.assign(responsesShape, responseSchemaEntry(Number(code), contract));
    }
  } else {
    Object.assign(
      responsesShape,
      responseSchemaEntry(200, httpContractObj.response),
    );
  }

  const result = {};

  if (httpContractObj.request) {
    result.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: httpContractObj.request.toOpenAPI(),
        },
      },
    };
  }

  result.responses = responsesShape;
  return result;
}

/**
 * Normalize a response input to a { status, body } shape.
 * Accepts either:
 *   - { status, body } — structured response input
 *   - any other value — treated as a flat body with implicit status 200
 */
function normalizeResponseInput(input) {
  if (
    input !== null &&
    typeof input === 'object' &&
    'status' in input &&
    'body' in input
  ) {
    return { status: input.status, body: input.body };
  }
  return { status: 200, body: input };
}

/**
 * @experimental May change before 1.0.0.
 *
 * Creates a framework-neutral HTTP boundary contract.
 * Accepts Sigil contracts for request body, response body, and optional
 * route parts (params, query, headers). Returns an object with helpers
 * for parsing, validating, serializing, and projecting HTTP boundaries.
 *
 * @param {object} options
 * @param {object} options.request - Sigil contract for the request body (required)
 * @param {object} options.response - Sigil contract for the primary response body (required)
 * @param {object} [options.responses] - Multi-status response map: { [statusCode]: SigilContract }
 * @param {object} [options.params]   - Sigil contract for route params
 * @param {object} [options.query]    - Sigil contract for query string values
 * @param {object} [options.headers]  - Sigil contract for request headers
 * @param {string} [options.method]   - HTTP method metadata (e.g. 'POST')
 * @param {string} [options.path]     - Route path metadata (e.g. '/users/:id')
 * @param {string} [options.summary]  - OpenAPI summary string
 * @param {string} [options.operationId] - OpenAPI operationId string
 * @returns {object} Frozen HTTP contract object
 */
export function httpContract({
  method,
  path,
  request,
  response,
  responses,
  params,
  query,
  headers,
  summary,
  operationId,
} = {}) {
  assertSigilContract(request, 'request');
  assertSigilContract(response, 'response');

  // Validate any additional status-keyed response contracts
  if (responses && typeof responses === 'object') {
    for (const [code, contract] of Object.entries(responses)) {
      assertSigilContract(contract, `responses[${code}]`);
    }
  }

  const requestParts = Object.freeze({
    ...(params ? { params } : {}),
    ...(query ? { query } : {}),
    ...(headers ? { headers } : {}),
    body: request,
  });

  const parsedRequestCache = new WeakMap();

  function parseRequestInput(input = {}) {
    const objectInput =
      typeof input === 'object' && input !== null ? input : {};

    if (parsedRequestCache.has(objectInput)) {
      return parsedRequestCache.get(objectInput);
    }

    const normalized = {};
    const errors = [];

    for (const [part, partContract] of Object.entries(requestParts)) {
      if (!Object.hasOwn(requestParts, part)) continue;

      const raw = objectInput[part];
      if (raw === undefined || raw === null || raw === '') {
        // Skip missing parts — callers control which parts are required.
        // Providing an invalid (non-object) body will still throw from parse().
        continue;
      }

      try {
        normalized[part] = partContract.parse(raw);
      } catch (error) {
        errors.push({ part, error });
      }
    }

    if (errors.length > 0) {
      const validationError = new Error(
        `httpContract request has ${errors.length} invalid part(s): ${errors
          .map(({ part }) => part)
          .join(', ')}`,
      );
      validationError.parts = errors.map(({ part, error }) => ({ part, error }));
      throw validationError;
    }

    const trustedRequest = Object.freeze(normalized);
    parsedRequestCache.set(objectInput, trustedRequest);
    return trustedRequest;
  }

  /**
   * Parse a response body or structured { status, body } input.
   * When status is provided, selects the contract from `responses` map if defined.
   * Falls back to the primary `response` contract.
   */
  function parseResponseInput(input) {
    const { status, body } = normalizeResponseInput(input);
    const selectedContract =
      responses && responses[status] ? responses[status] : response;
    const parsed = selectedContract.parse(body);
    return { status, body: parsed };
  }

  function safeParseResponseInput(input) {
    return safe(() => parseResponseInput(input));
  }

  const contract = Object.freeze({
    kind: 'sigil.httpContract',
    ...(method !== undefined ? { method } : {}),
    ...(path !== undefined ? { path } : {}),
    ...(summary !== undefined ? { summary } : {}),
    ...(operationId !== undefined ? { operationId } : {}),
    request,
    response,
    ...(responses !== undefined ? { responses } : {}),
    requestParts,
    parseRequest: parseRequestInput,
    safeParseRequest: (input) => {
      try {
        return { success: true, data: parseRequestInput(input) };
      } catch (error) {
        return { success: false, error };
      }
    },
    parseResponse: parseResponseInput,
    safeParseResponse: safeParseResponseInput,
    serializeResponse: (body) => response.serialize(body),
    safeSerializeResponse: (body) => safe(() => response.serialize(body)),
    toOpenAPI: () => openAPIFor(contract, responses),
    toPathItem: () => {
      const operation = openAPIFor(contract, responses);
      if (summary !== undefined) operation.summary = summary;
      if (operationId !== undefined) operation.operationId = operationId;

      if (method && path) {
        return {
          [path]: {
            [method.toLowerCase()]: operation,
          },
        };
      }

      return operation;
    },
    handler: (fn) => async (input) => {
      const parsedRequest = parseRequestInput(input);
      const rawResponse = await fn(parsedRequest);
      return contract.serializeResponse(rawResponse);
    },
  });

  return contract;
}
