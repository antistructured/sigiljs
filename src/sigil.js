import { assert } from './core/assert.js';
import { compile } from './core/compile.js';
import { normalize } from './core/normalize.js';
import { parse } from './core/parser.js';
import { partial } from './core/partial.js';
import { register, resolve } from './core/registry.js';
import { validate } from './core/validate.js';

// Memoize fully-constructed Sigil objects by raw schema string.
const _sigilCache = new Map();
let _registryIdCounter = 0;
const DEFINE_HELPER = Symbol('sigil.defineHelper');

const CONSTRUCTOR_TYPES = new Map([
  [String, 'string'],
  [Number, 'number'],
  [Boolean, 'boolean'],
  [BigInt, 'bigint'],
  [Symbol, 'symbol'],
  [Array, 'array'],
  [Object, 'object'],
]);

function createSigil(options = {}, strings, ...values) {
  const {
    registry,
    transforms = [],
    fieldTransforms = [],
    metadata: contractMetadataInput,
    ...createOptions
  } = options;
  const contractMetadata = normalizeContractMetadata(contractMetadataInput);

  let raw = strings?.[0] ?? '';
  for (let i = 0; i < values.length; i++)
    raw += values[i] + (strings?.[i + 1] ?? '');

  const cacheable = transforms.length === 0 && fieldTransforms.length === 0;
  const cacheKey = cacheKeyFor(
    { ...createOptions, metadata: contractMetadata },
    raw,
  );
  const cached = cacheable ? _sigilCache.get(cacheKey) : undefined;
  if (cached !== undefined) return cached;

  const ast = parse(raw, createOptions);
  const normalized = partial(normalize(ast));
  if (registry) attachRegistry(normalized, registry);

  const validator = compile(normalized);
  const name = createOptions.named;
  const parseValue = (value, opts) => {
    const trusted = assert(sigil, value, opts);
    const transformed = applyTransforms(trusted, fieldTransforms, transforms);
    return assert(sigil, transformed, opts);
  };

  const sigil = Object.freeze({
    kind: 'sigil.contract',
    name,
    source: raw,
    raw,
    ast,
    normalized,
    options: registry ? { ...createOptions, registry } : createOptions,
    validator,
    check: (value, opts) => validate(sigil, value, opts),
    assert: (value, opts) => assert(sigil, value, opts),
    parse: parseValue,
    safeParse: (value, opts) => safeParse(sigil, value, opts),
    serialize: (value, opts) => assert(sigil, value, opts),
    transform: (fn) =>
      createSigil(
        {
          ...sigil.options,
          transforms: [...transforms, fn],
          fieldTransforms,
          metadata: contractMetadata,
        },
        [raw],
      ),
    withMetadata: (metadata) =>
      createSigil(
        {
          ...sigil.options,
          transforms,
          fieldTransforms,
          metadata: mergeContractMetadata(contractMetadata, metadata),
        },
        [raw],
      ),
    version: (version) => sigil.withMetadata({ version }),
    describe: () =>
      describeContract(
        normalized,
        transforms,
        fieldTransforms,
        contractMetadata,
      ),
    toJSONSchema: () => toJSONSchema(sigil.describe()),
    toTypeScript: (name) => {
      const described = sigil.describe();
      const registryNames = Array.from(collectRegistryNames(described)).filter(
        (candidate) => Boolean(resolve(candidate)),
      );
      return toTypeScriptDeclaration(name, described, registryNames);
    },
    toOpenAPI: () => toOpenAPI(sigil.toJSONSchema()),
    toFormConstraints: () => toFormConstraints(sigil.describe()),
    mock: () => mockValue(sigil.describe()),
    cases: () => casesFor(sigil.describe()),
    diff: (other) =>
      diffContracts(sigil.describe(), describeOtherContract(other)),
    compile: () => validator,
  });

  if (cacheable) _sigilCache.set(cacheKey, sigil);
  return sigil;
}

export function Sigil(strings, ...values) {
  return createSigil({ exact: false }, strings, ...values);
}

Sigil.exact = function (strings, ...values) {
  return createSigil({ exact: true }, strings, ...values);
};

Sigil.meta = function meta(metadata) {
  return function (strings, ...values) {
    return createSigil({ exact: false, metadata }, strings, ...values);
  };
};

Sigil.named = function (name) {
  return function (strings, ...values) {
    const sigil = createSigil(
      { exact: false, named: name },
      strings,
      ...values,
    );
    register(name, sigil);
    return sigil;
  };
};

Sigil.collection = function collection(definitions = {}) {
  const result = {};
  const local = new Map();
  const entries = Object.entries(definitions);

  for (const [name, definition] of entries) {
    assertSigilDefinition(definition, name);
    const placeholder = createSigil(
      { exact: false, named: name, registry: local },
      [name],
    );
    local.set(name, placeholder);
    result[name] = placeholder;
  }

  for (const [name, definition] of entries) {
    const sigil = createSigil(
      {
        exact: definition.options?.exact ?? false,
        named: name,
        registry: local,
      },
      [definition.raw],
    );
    local.set(name, sigil);
    result[name] = sigil;
  }

  return Object.freeze(result);
};

Sigil.define = Sigil.named;

export function sigil(definition, metadata) {
  return createSigil(
    {
      exact: false,
      fieldTransforms: collectFieldTransforms(definition),
      metadata,
    },
    [sourceFromDefinition(definition)],
  );
}

sigil.exact = function exact(definition, metadata) {
  return createSigil(
    {
      exact: true,
      fieldTransforms: collectFieldTransforms(definition),
      metadata,
    },
    [sourceFromDefinition(definition)],
  );
};

export function optional(definition) {
  return defineHelper('optional', { definition });
}

export function union(...definitions) {
  if (definitions.length === 0) {
    throw new Error('union() requires at least one definition');
  }
  return defineHelper('union', { definitions });
}

export function oneOf(...values) {
  if (values.length === 0) {
    throw new Error('oneOf() requires at least one literal value');
  }
  return defineHelper('oneOf', { values });
}

export function pipe(definition, ...transforms) {
  if (transforms.length === 0) {
    throw new Error('pipe() requires at least one transform function');
  }
  for (const transform of transforms) {
    if (typeof transform !== 'function') {
      throw new Error(
        `pipe() transforms must be functions, got ${typeof transform}`,
      );
    }
  }
  return defineHelper('pipe', { definition, transforms });
}

export function trim() {
  return (value) => value.trim();
}

function assertSigilDefinition(value, name) {
  if (
    value &&
    typeof value.raw === 'string' &&
    typeof value.normalized === 'object'
  )
    return;
  throw new Error(
    `Collection member "${name}" must be a tagged template sigil, got ${typeof value}`,
  );
}

function defineHelper(type, data) {
  return Object.freeze({ [DEFINE_HELPER]: true, type, ...data });
}

function sourceFromDefinition(definition) {
  if (CONSTRUCTOR_TYPES.has(definition))
    return CONSTRUCTOR_TYPES.get(definition);

  if (definition?.[DEFINE_HELPER]) return sourceFromHelper(definition);

  if (definition?.kind === 'sigil.contract') {
    return definition.name ?? definition.source;
  }

  if (isPlainObject(definition)) return sourceFromObject(definition);

  throw new Error(`Unsupported sigil definition: ${String(definition)}`);
}

function sourceFromHelper(helper) {
  switch (helper.type) {
    case 'optional':
      return `${sourceFromDefinition(helper.definition)}?`;
    case 'union':
      return helper.definitions.map(sourceFromDefinition).join(' | ');
    case 'oneOf':
      return helper.values.map(literalSource).join(' | ');
    case 'pipe':
      return sourceFromDefinition(helper.definition);
    default:
      throw new Error(`Unknown sigil definition helper: ${helper.type}`);
  }
}

function sourceFromObject(definition) {
  const properties = Object.entries(definition).map(([key, value]) => {
    const optionalField = value?.[DEFINE_HELPER] && value.type === 'optional';
    const actualValue = optionalField ? value.definition : value;
    const propertyKey = `${sourcePropertyKey(key)}${optionalField ? '?' : ''}`;
    return `${propertyKey}: ${sourceFromDefinition(actualValue)}`;
  });

  return `{ ${properties.join(', ')} }`;
}

function sourcePropertyKey(key) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
}

function literalSource(value) {
  if (value === null) return 'null';
  switch (typeof value) {
    case 'string':
      return JSON.stringify(value);
    case 'number':
      if (!Number.isFinite(value)) {
        throw new Error('oneOf() number literals must be finite');
      }
      return String(value);
    case 'boolean':
      return String(value);
    default:
      throw new Error(
        `oneOf() only supports string, number, boolean, and null literals; got ${typeof value}`,
      );
  }
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

function collectFieldTransforms(definition, path = []) {
  if (definition?.[DEFINE_HELPER] && definition.type === 'optional') {
    return collectFieldTransforms(definition.definition, path);
  }

  if (definition?.[DEFINE_HELPER] && definition.type === 'pipe') {
    return [
      { path, transforms: definition.transforms },
      ...collectFieldTransforms(definition.definition, path),
    ];
  }

  if (!isPlainObject(definition)) return [];

  const collected = [];
  for (const [key, value] of Object.entries(definition)) {
    collected.push(...collectFieldTransforms(value, [...path, key]));
  }
  return collected;
}

function applyTransforms(value, fieldTransforms, transforms) {
  let next = value;

  for (const fieldTransform of fieldTransforms) {
    next = applyFieldTransform(
      next,
      fieldTransform.path,
      fieldTransform.transforms,
    );
  }

  for (const transform of transforms) {
    next = transform(next);
  }

  return next;
}

function applyFieldTransform(value, path, transforms) {
  if (path.length === 0) {
    return applyTransformList(value, transforms);
  }

  if (!hasPath(value, path)) return value;

  const root = cloneContainer(value);
  let sourceCursor = value;
  let targetCursor = root;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const child = sourceCursor[key];
    const cloned = cloneContainer(child);
    targetCursor[key] = cloned;
    sourceCursor = child;
    targetCursor = cloned;
  }

  const finalKey = path[path.length - 1];
  if (targetCursor[finalKey] === undefined) return root;
  targetCursor[finalKey] = applyTransformList(
    targetCursor[finalKey],
    transforms,
  );
  return root;
}

function applyTransformList(value, transforms) {
  let next = value;
  for (const transform of transforms) next = transform(next);
  return next;
}

function hasPath(value, path) {
  let cursor = value;
  for (const key of path) {
    if (cursor === null || typeof cursor !== 'object' || !(key in cursor)) {
      return false;
    }
    cursor = cursor[key];
  }
  return true;
}

function cloneContainer(value) {
  return Array.isArray(value) ? [...value] : { ...value };
}

function cacheKeyFor(options, raw) {
  const registryKey =
    options.registry ? registryId(options.registry) : 'global';
  return `${registryKey}:${JSON.stringify({ ...options, registry: undefined })}:${raw}`;
}

function registryId(registry) {
  if (!registry.__sigilRegistryId) {
    Object.defineProperty(registry, '__sigilRegistryId', {
      configurable: false,
      enumerable: false,
      value: ++_registryIdCounter,
      writable: false,
    });
  }
  return registry.__sigilRegistryId;
}

function attachRegistry(node, registry) {
  if (!node || typeof node !== 'object') return;

  Object.defineProperty(node, '__registry', {
    configurable: false,
    enumerable: false,
    value: registry,
    writable: false,
  });

  switch (node.kind) {
    case 'array':
      attachRegistry(node.element, registry);
      break;
    case 'optional':
      attachRegistry(node.inner, registry);
      break;
    case 'union':
      for (const member of node.members) attachRegistry(member, registry);
      break;
    case 'object':
      for (const property of node.properties)
        attachRegistry(property.value, registry);
      break;
  }
}

function safeParse(sigil, value, opts) {
  try {
    return { success: true, data: sigil.parse(value, opts) };
  } catch (error) {
    return { success: false, error };
  }
}

function normalizeContractMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') return null;

  const normalized = {};
  if (typeof metadata.name === 'string') normalized.name = metadata.name;
  if (typeof metadata.version === 'string')
    normalized.version = metadata.version;
  if (typeof metadata.description === 'string') {
    normalized.description = metadata.description;
  }
  if (Array.isArray(metadata.tags)) {
    const tags = metadata.tags.filter((tag) => typeof tag === 'string');
    if (tags.length > 0) normalized.tags = tags;
  }

  return Object.keys(normalized).length > 0 ? normalized : null;
}

function mergeContractMetadata(current, next) {
  return normalizeContractMetadata({ ...(current ?? {}), ...(next ?? {}) });
}

function cloneContractMetadata(metadata) {
  if (!metadata) return null;
  return {
    ...metadata,
    ...(metadata.tags ? { tags: [...metadata.tags] } : {}),
  };
}

function describeContract(
  node,
  transforms = [],
  fieldTransforms = [],
  contractMetadata = null,
) {
  const description = describeNode(node);
  const metadata = {
    ...(cloneContractMetadata(contractMetadata) ?? {}),
    ...(describeTransformMetadata(transforms, fieldTransforms) ?? {}),
  };
  if (Object.keys(metadata).length === 0) return description;
  return { ...description, metadata };
}

function describeTransformMetadata(transforms, fieldTransforms) {
  if (transforms.length === 0 && fieldTransforms.length === 0) return null;

  return {
    transforms: {
      contract: transforms.length,
      fields: fieldTransforms.map((fieldTransform) => ({
        path: [...fieldTransform.path],
        count: fieldTransform.transforms.length,
      })),
    },
  };
}

function describeNode(node) {
  if (!node) return { kind: 'unknown' };

  switch (node.kind) {
    case 'primitive':
      return { kind: node.name };

    case 'literal':
      return { kind: 'literal', value: node.value };

    case 'literal_union':
      return {
        kind: 'union',
        variants: node.values.map((value) => ({ kind: 'literal', value })),
      };

    case 'primitive_union':
      return {
        kind: 'union',
        variants: node.names.map((name) => ({ kind: name })),
      };

    case 'union':
      return {
        kind: 'union',
        variants: node.members.map(describeNode),
      };

    case 'array':
      return { kind: 'array', element: describeNode(node.element) };

    case 'optional':
      return describeNode(node.inner);

    case 'identifier':
      return { kind: 'reference', name: node.name };

    case 'object':
      return {
        kind: 'object',
        exact: Boolean(node.exact),
        properties: node.properties.map((property) => ({
          key: property.key,
          required: !property.optional,
          contract: describeNode(property.value),
        })),
      };

    default:
      return { kind: node.kind ?? 'unknown' };
  }
}

function toJSONSchema(description) {
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
        return { type: 'array', items: toJSONSchema(description.element) };

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

      default:
        return {};
    }
  })();

  return applyProjectionMetadata(schema, description.metadata);
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
    properties: {},
  };
  const required = [];

  for (const property of description.properties) {
    schema.properties[property.key] = toJSONSchema(property.contract);
    if (property.required) required.push(property.key);
  }

  if (required.length > 0) schema.required = required;
  if (description.exact) schema.additionalProperties = false;

  return schema;
}

function unionToJSONSchema(variants) {
  if (variants.every((variant) => variant.kind === 'literal')) {
    return { enum: variants.map((variant) => variant.value) };
  }

  if (
    variants.every((variant) => JSON_SCHEMA_PRIMITIVE_TYPES.has(variant.kind))
  ) {
    return { type: variants.map((variant) => variant.kind) };
  }

  return { anyOf: variants.map(toJSONSchema) };
}

const JSON_SCHEMA_PRIMITIVE_TYPES = new Set([
  'string',
  'number',
  'boolean',
  'null',
]);

function collectRegistryNames(description, names = new Set()) {
  if (!description || typeof description !== 'object') return names;

  switch (description.kind) {
    case 'object':
      for (const property of description.properties)
        collectRegistryNames(property.contract, names);
      return names;
    case 'array':
      return collectRegistryNames(description.element, names);
    case 'union':
      for (const variant of description.variants)
        collectRegistryNames(variant, names);
      return names;
    case 'reference':
      names.add(description.name);
      return names;
    default:
      return names;
  }
}

function toTypeScriptDeclaration(name, description, registryNames = []) {
  const declaration = `type ${name} = ${typeScriptExpression(description, registryNames)}`;
  const comment = typeScriptMetadataComment(description.metadata);
  return comment ? `${comment}\n${declaration}` : declaration;
}

function typeScriptMetadataComment(metadata) {
  if (!metadata) return '';

  const lines = [];
  if (metadata.description) lines.push(metadata.description);
  if (metadata.version) lines.push(`@version ${metadata.version}`);
  if (metadata.tags) lines.push(`@tags ${metadata.tags.join(', ')}`);
  if (lines.length === 0) return '';

  return [
    '/**',
    ...lines.map((line) => ` * ${escapeCommentLine(line)}`),
    ' */',
  ].join('\n');
}

function escapeCommentLine(line) {
  return String(line).replaceAll('*/', '*\\/');
}

function typeScriptExpression(description, registryNames = []) {
  switch (description.kind) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'null':
    case 'any':
    case 'unknown':
      return description.kind;

    case 'bigint':
      return 'bigint';

    case 'array':
      return `${typeScriptExpression(description.element, registryNames)}[]`;

    case 'object':
      return formatObjectType(description, registryNames);

    case 'literal':
      return `${JSON.stringify(description.value)}`;

    case 'union':
      return description.variants
        .map((variant) => typeScriptExpression(variant, registryNames))
        .join(' | ');

    case 'reference': {
      const referenceName = description.name;
      const namedDescription =
        registryNames.includes(referenceName) ? referenceName : null;
      return namedDescription ?? referenceName;
    }

    case 'never':
      return 'never';

    default:
      return 'unknown';
  }
}

function formatObjectType(description, registryNames) {
  const properties = description.properties
    .map((property) => {
      const valueType = typeScriptExpression(property.contract, registryNames);
      const optionalFlag = property.required ? '' : '?';
      return `  ${property.key}${optionalFlag}: ${valueType}`;
    })
    .join('\n');

  return `{\n${properties}\n}`;
}

function toOpenAPI(jsonSchema) {
  return cloneJSON(jsonSchema);
}

function toFormConstraints(description) {
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

function mockValue(description) {
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
      return [mockValue(description.element)];
    case 'object':
      return mockObject(description);
    case 'literal':
      return description.value;
    case 'union':
      return mockValue(description.variants[0] ?? { kind: 'unknown' });
    case 'reference': {
      const sigil = resolve(description.name);
      return sigil ? sigil.mock() : undefined;
    }
    default:
      return undefined;
  }
}

function mockObject(description) {
  const value = {};
  for (const property of description.properties) {
    if (!property.required) continue;
    value[property.key] = mockValue(property.contract);
  }
  return value;
}

function casesFor(description) {
  const valid = mockValue(description);
  return {
    valid: [valid],
    invalid: [invalidValue(description, valid)],
  };
}

function invalidValue(description, valid) {
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
      const sigil = resolve(description.name);
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

function describeOtherContract(other) {
  if (!other || typeof other.describe !== 'function') {
    throw new Error('Contract diff requires another Sigil contract');
  }
  return other.describe();
}

function diffContracts(after, before) {
  if (after.kind !== 'object' || before.kind !== 'object') {
    throw new Error('Contract diff currently supports object contracts only');
  }

  return [
    ...diffObjectDescriptions(after, before, []),
    ...diffMetadata(after.metadata, before.metadata),
  ];
}

function diffObjectDescriptions(after, before, path) {
  const afterProperties = propertiesByKey(after);
  const beforeProperties = propertiesByKey(before);
  const changes = [];

  for (const [key, afterField] of afterProperties) {
    const beforeField = beforeProperties.get(key);
    const fieldPath = [...path, key];
    if (!beforeField) {
      changes.push({
        kind: 'property.added',
        path: fieldPath,
        contract: afterField.contract,
        impact: 'non-breaking',
      });
      continue;
    }

    if (
      afterField.contract.kind === 'object' &&
      beforeField.contract.kind === 'object'
    ) {
      changes.push(
        ...diffObjectDescriptions(
          afterField.contract,
          beforeField.contract,
          fieldPath,
        ),
      );
    } else if (!sameDescription(afterField.contract, beforeField.contract)) {
      changes.push({
        kind: 'property.changed',
        path: fieldPath,
        from: beforeField.contract,
        to: afterField.contract,
        impact: impactForContractChange(
          beforeField.contract,
          afterField.contract,
        ),
      });
    }

    if (afterField.required !== beforeField.required) {
      changes.push({
        kind: 'property.required_changed',
        path: fieldPath,
        from: beforeField.required,
        to: afterField.required,
        impact: afterField.required ? 'breaking' : 'non-breaking',
      });
    }
  }

  for (const [key, beforeField] of beforeProperties) {
    if (!afterProperties.has(key)) {
      changes.push({
        kind: 'property.removed',
        path: [...path, key],
        contract: beforeField.contract,
        impact: 'breaking',
      });
    }
  }

  if (after.exact !== before.exact) {
    changes.push({
      kind: 'object.exact_changed',
      path,
      from: before.exact,
      to: after.exact,
      impact: after.exact ? 'breaking' : 'non-breaking',
    });
  }

  return changes;
}

function diffMetadata(after = {}, before = {}) {
  const changes = [];
  for (const key of ['name', 'version', 'description', 'tags']) {
    if (!sameDescription(after?.[key], before?.[key])) {
      changes.push({
        kind: `metadata.${key}_changed`,
        path: ['metadata', key],
        from: cloneMetadataValue(before?.[key]),
        to: cloneMetadataValue(after?.[key]),
        impact: 'unknown',
      });
    }
  }
  return changes;
}

function impactForContractChange(before, after) {
  if (isLiteralUnion(before) && isLiteralUnion(after)) return 'unknown';
  return 'breaking';
}

function isLiteralUnion(description) {
  return (
    description.kind === 'union' &&
    description.variants.every((variant) => variant.kind === 'literal')
  );
}

function cloneMetadataValue(value) {
  return Array.isArray(value) ? [...value] : value;
}

function propertiesByKey(description) {
  return new Map(
    description.properties.map((property) => [property.key, property]),
  );
}

function sameDescription(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function cloneJSON(value) {
  return JSON.parse(JSON.stringify(value));
}
