# HTTP Contract Model Design

This document defines the minimal HTTP boundary model for SigilJS.
It is intentionally framework-neutral and dependency-free.

Current package: `@weipertda/sigiljs`

## Boundary shape

An HTTP contract describes a route-level request/response boundary.
It should accept plain objects, not framework-specific request/response instances.

Recommended route metadata fields:

```js
{
  method,
  path,
}
```

Recommended request parts:

```js
{
  params,
  query,
  headers,
  body,
}
```

Recommended response shape:

```js
{
  status,
  body,
}
```

All shape parts except `method` and `path` should be Sigil contracts when present.

## Request parts

| Part | Purpose | Contract requirement |
|------|---------|----------------------|
| `params` | Route parameters | Sigil contract when present |
| `query` | Query string values | Sigil contract when present |
| `headers` | Request headers | Sigil contract when present |
| `body` | Request body | Sigil contract when present |

These parts are validated independently.
Missing parts are allowed unless the application logic requires them.

## Response parts

| Part | Purpose | Contract requirement |
|------|---------|----------------------|
| `status` | HTTP status code | metadata or primitive contract |
| `body` | Response body | Sigil contract when present |

Response validation should operate on plain objects with `status` and `body`.
Framework-specific response objects should be normalized before validation.

## Metadata fields

`method` and `path` are metadata.
They describe the route but are not enforced as runtime data contracts by default.

They may be used for:

- OpenAPI documentation
- route matching
- documentation generation

They should not be validated with Sigil contracts unless the application explicitly wants that behavior.

## Stable vs experimental behavior

Stable behavior (do not change without semver care):

- `httpContract({ request, response })` remains the primary entrypoint
- request/response contracts remain framework-neutral
- `parseRequest`, `safeParseRequest`, `serializeResponse`, `safeSerializeResponse`, `handler`, and `toOpenAPI` remain the boundary methods

Experimental behavior (may change before 1.0.0):

- route metadata shape (`method`, `path`, `params`, `query`, `headers`)
- response status handling
- addition of helper constructors for params/query/headers
- OpenAPI expansion beyond `requestBody` plus `200`

## Recommended usage

```js
import { httpContract, sigil, oneOf, optional } from '@weipertda/sigiljs';

const CreateUserRequest = sigil.exact({
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});

const CreateUserResponse = sigil.exact({
  id: Number,
  email: String,
  name: String,
  role: oneOf('admin', 'user'),
});

const CreateUserRoute = httpContract({
  method: 'POST',
  path: '/users',
  body: CreateUserRequest,
  response: CreateUserResponse,
});
```

## Non-goals

Core does not provide:

- framework adaptapters
- request/response object wrappers
- automatic status code handling beyond projection helpers
- routing logic
- query-string parsing
- header normalization
- cookie/session handling
- multipart parsing

These remain adapter or application responsibilities.

## Future expansion

If the model expands, prefer additive properties on the existing `httpContract()` return object rather than new exported helpers.
Keep backward compatibility by making new fields optional.
