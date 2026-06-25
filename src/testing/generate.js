export function generateValid(description, options = {}) {
  const { includeOptional = false, arrayLength = 1, resolve } = options;

  switch (description.kind) {
    case 'string':
      return 'string';
    case 'number':
      return 0;
    case 'boolean':
      return true;
    case 'bigint':
      return 0n;
    case 'null':
      return null;
    case 'symbol':
      return Symbol();
    case 'literal':
      return description.value;
    case 'reference': {
      const sigil = resolve?.(description.name);
      return sigil ? generateValid(sigil.describe(), options) : undefined;
    }
    case 'array':
      return Array.from({ length: arrayLength }, () =>
        generateValid(description.element, options),
      );
    case 'object':
      return generateObject(description, includeOptional, options);
    case 'union':
      return generateValid(
        description.variants[0] ?? { kind: 'unknown' },
        options,
      );
    default:
      return undefined;
  }
}

function generateObject(description, includeOptional, options) {
  const value = {};
  for (const property of description.properties) {
    if (!property.required && !includeOptional) continue;
    value[property.key] = generateValid(property.contract, options);
  }
  return value;
}
