import { generateValid } from './generate.js';

export function generateCases(description, options = {}) {
  const validValue = generateValid(description, options);
  const valid = { label: 'valid default', value: validValue };
  const invalid = generateInvalidCases(description, options, [], new Set());

  return {
    valid: [valid],
    invalid,
  };
}

function generateInvalidCases(
  description,
  options,
  path = [],
  visited = new Set(),
) {
  const cases = [];

  switch (description.kind) {
    case 'object': {
      const validValue = generateValid(description, options);

      const firstRequired = description.properties.find((p) => p.required);
      if (firstRequired) {
        const missingRequired = { ...validValue };
        delete missingRequired[firstRequired.key];
        cases.push({
          label: `missing required property: ${firstRequired.key}`,
          value: missingRequired,
          expectedPath: [...path, firstRequired.key],
        });
      }

      for (const property of description.properties) {
        if (!property.required) continue;
        const fieldCases = generateFieldInvalidCases(
          property.contract,
          options,
          [...path, property.key],
        );
        for (const entry of fieldCases) {
          if (
            !cases.some(
              (c) =>
                c.label === entry.label &&
                c.expectedPath?.join('.') === entry.expectedPath?.join('.'),
            )
          ) {
            cases.push(entry);
          }
        }
      }

      if (description.exact) {
        cases.push({
          label: 'extra key in exact object',
          value: { ...validValue, _extra: 'extra' },
          expectedPath: [...path, '_extra'],
        });
      }

      const nestedRequired = description.properties.find(
        (p) => p.required && p.contract.kind === 'object',
      );
      if (nestedRequired) {
        const nestedInvalid = generateInvalidCases(
          nestedRequired.contract,
          options,
          [...path, nestedRequired.key],
          visited,
        );
        if (nestedInvalid.length > 0) {
          const nestedFailure = { ...validValue };
          nestedFailure[nestedRequired.key] = nestedInvalid[0].value;
          cases.push({
            label: `nested: ${nestedInvalid[0].label}`,
            value: nestedFailure,
            expectedPath: nestedInvalid[0].expectedPath,
          });
        }
      }
      break;
    }

    case 'array': {
      cases.push({
        label: 'non-array value',
        value: 'array',
        expectedPath: path,
      });

      if (description.element) {
        const elementInvalid = generateInvalidCases(
          description.element,
          options,
          [...path, 0],
          visited,
        );
        if (elementInvalid.length > 0) {
          cases.push({
            label: `invalid array item: ${elementInvalid[0].label}`,
            value: [elementInvalid[0].value],
            expectedPath: [...path, 0],
          });
        }
      }
      break;
    }

    case 'reference': {
      const sigil = options.resolve?.(description.name);
      if (sigil && !visited.has(description.name)) {
        visited.add(description.name);
        const refCases = generateInvalidCases(
          sigil.describe(),
          options,
          path,
          visited,
        );
        cases.push(...refCases);
      }
      break;
    }

    default: {
      const fieldCases = generateFieldInvalidCases(description, options, path);
      cases.push(...fieldCases);
    }
  }

  return cases;
}

function generateFieldInvalidCases(description, options, path) {
  const cases = [];

  switch (description.kind) {
    case 'string':
      cases.push({ value: 0, label: 'invalid string', expectedPath: path });
      break;
    case 'number':
      cases.push({
        value: 'number',
        label: 'invalid number',
        expectedPath: path,
      });
      break;
    case 'boolean':
      cases.push({
        value: 'boolean',
        label: 'invalid boolean',
        expectedPath: path,
      });
      break;
    case 'bigint':
      cases.push({
        value: 'bigint',
        label: 'invalid bigint',
        expectedPath: path,
      });
      break;
    case 'null':
      cases.push({ value: 'null', label: 'invalid null', expectedPath: path });
      break;
    case 'symbol':
      cases.push({
        value: 'symbol',
        label: 'invalid symbol',
        expectedPath: path,
      });
      break;
    case 'literal':
      cases.push({
        value: invalidLiteralValue(description.value),
        label: 'invalid literal',
        expectedPath: path,
      });
      break;
    case 'union':
      cases.push({
        value: invalidUnionValue(description.variants),
        label: 'invalid union',
        expectedPath: path,
      });
      break;
    case 'array':
      cases.push({
        value: 'array',
        label: 'invalid array',
        expectedPath: path,
      });
      break;
    case 'object':
      cases.push({
        value: 'object',
        label: 'invalid object',
        expectedPath: path,
      });
      break;
    case 'reference':
      cases.push({
        value: undefined,
        label: 'invalid reference',
        expectedPath: path,
      });
      break;
  }

  return cases;
}

function invalidLiteralValue(value) {
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

function invalidUnionValue(variants) {
  const kinds = new Set(variants.map((variant) => variant.kind));
  if (!kinds.has('boolean')) return false;
  if (!kinds.has('number')) return 1;
  if (!kinds.has('string')) return 'string';
  return null;
}
