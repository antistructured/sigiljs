import { projectMock } from './mock.js';

export function projectCases(description, options = {}) {
  const valid = projectMock(description, options);
  return {
    valid: [valid],
    invalid: [invalidValue(description, valid, options)],
  };
}

function invalidValue(description, valid, options) {
  switch (description.kind) {
    case 'string':
      return 1;
    case 'number':
    case 'bigint':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'null':
      return 'null';
    case 'array':
      return 'array';
    case 'object':
      return invalidObject(description, valid);
    case 'literal':
      return invalidLiteral(description.value);
    case 'union':
      return invalidUnion(description.variants);
    case 'reference': {
      const sigil = options.resolve?.(description.name);
      return sigil ? sigil.cases().invalid[0] : undefined;
    }
    default:
      return null;
  }
}

function invalidObject(description, valid) {
  const firstRequired = description.properties.find(
    (property) => property.required,
  );
  if (!firstRequired) return 'object';

  const invalid = { ...valid };
  delete invalid[firstRequired.key];
  return invalid;
}

function invalidLiteral(value) {
  switch (typeof value) {
    case 'string':
      return `${value}_invalid`;
    case 'number':
      return value + 1;
    case 'boolean':
      return !value;
    default:
      return value === null ? 'null' : undefined;
  }
}

function invalidUnion(variants) {
  const kinds = new Set(variants.map((variant) => variant.kind));
  if (!kinds.has('boolean')) return false;
  if (!kinds.has('number')) return 1;
  if (!kinds.has('string')) return 'string';
  return null;
}
