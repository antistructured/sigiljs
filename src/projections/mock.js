export function projectMock(description, options = {}) {
  const { resolve } = options;

  switch (description.kind) {
    case 'string':
      return 'string';
    case 'number':
      return 1;
    case 'boolean':
      return true;
    case 'bigint':
      return 1n;
    case 'null':
      return null;
    case 'array':
      return [projectMock(description.element, options)];
    case 'object':
      return mockObject(description, options);
    case 'literal':
      return description.value;
    case 'union':
      return projectMock(
        description.variants[0] ?? { kind: 'unknown' },
        options,
      );
    case 'reference': {
      const sigil = resolve?.(description.name);
      return sigil ? sigil.mock() : undefined;
    }
    default:
      return undefined;
  }
}

function mockObject(description, options) {
  const value = {};
  for (const property of description.properties) {
    if (!property.required) continue;
    value[property.key] = projectMock(property.contract, options);
  }
  return value;
}
