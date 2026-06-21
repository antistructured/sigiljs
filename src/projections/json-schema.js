import { unsupportedProjectionKind } from '../projection-error.js';

export function projectJSONSchema(description) {
  assertDescription(description);

  const schema = (() => {
    switch (description.kind) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'null':
        return { type: description.kind };

      case 'bigint':
        return { type: 'integer' };

      case 'array':
        return arrayToJSONSchema(description);

      case 'object':
        return objectToJSONSchema(description);

      case 'literal':
        return literalToJSONSchema(description.value);

      case 'union':
        return unionToJSONSchema(description.variants);

      case 'reference':
        return { $ref: `#/$defs/${description.name}` };

      case 'any':
      case 'unknown':
        return {};

      case 'never':
        return { not: {} };

      case 'symbol':
        throw unsupportedProjectionKind('json-schema', description);

      default:
        throw unsupportedProjectionKind('json-schema', description);
    }
  })();

  return applyProjectionMetadata(schema, description.metadata);
}

function assertDescription(description) {
  if (!description || typeof description !== 'object') {
    throw new Error('JSON Schema projection requires a contract description');
  }
}

function applyProjectionMetadata(schema, metadata) {
  if (!metadata) return schema;

  const projected = { ...schema };
  if (metadata.name) projected.title = metadata.name;
  if (metadata.description) projected.description = metadata.description;
  if (metadata.version) projected['x-version'] = metadata.version;
  if (metadata.tags) projected['x-tags'] = [...metadata.tags];
  return metadataFirst(projected);
}

function metadataFirst(schema) {
  const ordered = {};
  for (const key of ['title', 'description', 'x-version', 'x-tags']) {
    if (key in schema) ordered[key] = schema[key];
  }
  for (const [key, value] of Object.entries(schema)) {
    if (!(key in ordered)) ordered[key] = value;
  }
  return ordered;
}

function literalToJSONSchema(value) {
  if (value === null) return { type: 'null' };
  return { const: value };
}

function objectToJSONSchema(description) {
  const schema = {
    type: 'object',
  };
  if (!Array.isArray(description.properties)) return schema;

  schema.properties = {};
  const required = [];

  for (const property of description.properties) {
    schema.properties[property.key] = projectJSONSchema(property.contract);
    if (property.required) required.push(property.key);
  }

  if (required.length > 0) schema.required = required;
  if (description.exact) schema.additionalProperties = false;

  return schema;
}

function arrayToJSONSchema(description) {
  const schema = { type: 'array' };
  if (description.element)
    schema.items = projectJSONSchema(description.element);
  return schema;
}

function unionToJSONSchema(variants) {
  if (!Array.isArray(variants)) {
    throw new Error('JSON Schema projection requires union variants');
  }

  if (variants.every((variant) => variant.kind === 'literal')) {
    return { enum: variants.map((variant) => variant.value) };
  }

  if (
    variants.every((variant) => JSON_SCHEMA_PRIMITIVE_TYPES.has(variant.kind))
  ) {
    return { type: variants.map((variant) => variant.kind) };
  }

  return { anyOf: variants.map(projectJSONSchema) };
}

const JSON_SCHEMA_PRIMITIVE_TYPES = new Set([
  'string',
  'number',
  'boolean',
  'null',
]);
