/**
 * Type smoke test: experimental HTTP helper declarations
 */
import {
  httpContract,
  sigil,
  type HttpContract,
  type HttpContractOptions,
  type SigilParseResult,
} from '@weipertda/sigiljs';

type CreateUserRequest = {
  email: string;
};

type UserResponse = {
  id: string;
  email: string;
};

const Request = sigil<CreateUserRequest>({ email: String });
const Response = sigil<UserResponse>({ id: String, email: String });
const ErrorResponse = sigil<{ error: string }>({ error: String });

const options: HttpContractOptions = {
  method: 'POST',
  path: '/users',
  request: Request,
  response: Response,
  responses: {
    201: Response,
    400: ErrorResponse,
  },
  summary: 'Create user',
  operationId: 'createUser',
};

const route: HttpContract = httpContract(options);

const parsedRequest: Record<string, unknown> = route.parseRequest({
  body: { email: 'alex@example.com' },
});

const safeRequest: SigilParseResult<Record<string, unknown>> = route.safeParseRequest({
  body: { email: 'alex@example.com' },
});

if (safeRequest.success) {
  const body = safeRequest.data.body;
  void body;
} else {
  const error: unknown = safeRequest.error;
  void error;
}

const parsedResponse: { status: number; body: unknown } = route.parseResponse({
  status: 201,
  body: { id: 'user_1', email: 'alex@example.com' },
});

const safeResponse: SigilParseResult<{ status: number; body: unknown }> =
  route.safeParseResponse({
    status: 400,
    body: { error: 'Invalid request' },
  });

const operation: Record<string, unknown> = route.toOpenAPI();
const pathItem: Record<string, unknown> = route.toPathItem();

const handler = route.handler(async (request) => {
  void request;
  return { id: 'user_1', email: 'alex@example.com' };
});

void parsedRequest;
void parsedResponse;
void safeResponse;
void operation;
void pathItem;
void handler;

export {};
