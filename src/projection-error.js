export class SigilProjectionError extends Error {
  constructor({ message, projection, path = [], kind, reason }) {
    super(message);

    this.name = 'SigilProjectionError';
    this.code = 'SIGIL_PROJECTION_FAILED';
    this.projection = projection;
    this.path = [...path];
    this.kind = kind ?? null;
    this.reason = reason ?? null;
  }
}

export function projectionError({ projection, path = [], reason, fallback }) {
  const message =
    typeof fallback === 'string' ? fallback : (
      `${projection} projection cannot represent this contract description accurately.`
    );

  return new SigilProjectionError({
    message,
    projection,
    path,
    reason,
  });
}

export function unsupportedProjectionKind(projection, description, path = []) {
  const kind =
    description && typeof description === 'object' && description.kind ?
      description.kind
    : typeof description;

  return new SigilProjectionError({
    projection,
    path,
    kind,
    reason: 'unsupported_kind',
    message: `Cannot project ${kind} contract to ${projection}`,
  });
}
