/**
 * @experimental May change before 1.0.0.
 *
 * Projects a Sigil contract description into plain form field metadata.
 * Returns a { fields: { ... } } shape containing per-field constraints.
 *
 * Non-object contracts return { fields: {} }.
 * No DOM, no framework, no HTML is generated.
 */
export function projectFormConstraints(description) {
  if (description.kind !== 'object') return { fields: {} };

  return {
    fields: buildFieldMap(description.properties, []),
  };
}

// ─── Label derivation ───────────────────────────────────────────────────────

/**
 * Convert a camelCase or snake_case key to a Title Case label.
 * e.g. "firstName" → "First Name", "date_of_birth" → "Date Of Birth"
 */
function toLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Field map builder ──────────────────────────────────────────────────────

function buildFieldMap(properties, parentPath) {
  const fields = {};
  for (const property of properties) {
    fields[property.key] = buildField(property, parentPath);
  }
  return fields;
}

function buildField(property, parentPath) {
  const path = [...parentPath, property.key];
  const label = toLabel(property.key);
  const base = {
    name: property.key,
    path,
    required: property.required,
    label,
  };

  const typeInfo = formConstraintFor(property.contract, path);
  return Object.assign(base, typeInfo);
}

// ─── Type constraint projection ─────────────────────────────────────────────

function formConstraintFor(description, path) {
  switch (description.kind) {
    case 'string':
      return { type: 'text' };

    case 'number':
    case 'bigint':
      return { type: 'number' };

    case 'boolean':
      return { type: 'checkbox' };

    case 'union':
      return formConstraintForUnion(description.variants, path);

    case 'literal':
      return { type: 'select', options: [description.value] };

    case 'object':
      return {
        type: 'object',
        fields: buildFieldMap(description.properties || [], path),
      };

    case 'array':
      return formConstraintForArray(description, path);

    default:
      return { type: 'text' };
  }
}

function formConstraintForUnion(variants) {
  if (variants.every((v) => v.kind === 'literal')) {
    return {
      type: 'select',
      options: variants.map((v) => v.value),
    };
  }

  const accepted = variants.map((v) => formInputTypeFor(v));
  return {
    type: accepted[0] ?? 'text',
    accepts: [...new Set(accepted)],
  };
}

function formConstraintForArray(description) {
  const itemsDescription = description.items ?? { kind: 'string' };
  const itemsTypeInfo = formConstraintFor(itemsDescription, []);
  return {
    type: 'array',
    items: itemsTypeInfo,
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
