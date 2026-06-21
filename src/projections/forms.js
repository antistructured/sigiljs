export function projectFormConstraints(description) {
  if (description.kind !== 'object') return {};

  const constraints = {};
  for (const property of description.properties) {
    constraints[property.key] = {
      required: property.required,
      ...formConstraintFor(property.contract),
    };
  }
  return constraints;
}

function formConstraintFor(description) {
  switch (description.kind) {
    case 'string':
      return { type: 'text' };
    case 'number':
    case 'bigint':
      return { type: 'number' };
    case 'boolean':
      return { type: 'checkbox' };
    case 'union':
      return formConstraintForUnion(description.variants);
    case 'literal':
      return { type: 'select', options: [description.value] };
    default:
      return { type: 'text' };
  }
}

function formConstraintForUnion(variants) {
  if (variants.every((variant) => variant.kind === 'literal')) {
    return {
      type: 'select',
      options: variants.map((variant) => variant.value),
    };
  }

  const accepted = variants.map((variant) => formInputTypeFor(variant));
  return {
    type: accepted[0] ?? 'text',
    accepts: [...new Set(accepted)],
  };
}

function formInputTypeFor(description) {
  switch (description.kind) {
    case 'number':
    case 'bigint':
      return 'number';
    case 'boolean':
      return 'checkbox';
    default:
      return 'text';
  }
}
