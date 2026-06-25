import { projectionError } from '../projection-error.js';

export function projectTypeScript(description, options = {}) {
  assertDescription(description);

  const { name, resolve } = options;
  const registryNames = Array.from(collectRegistryNames(description)).filter(
    (candidate) => Boolean(resolve?.(candidate)),
  );

  const referenceTypes = new Map(
    registryNames.map((candidate) => [
      candidate,
      resolve(candidate)?.describe()?.metadata?.name ?? candidate,
    ]),
  );

  const declarationName = name ?? description.metadata?.name ?? 'Contract';
  const expression = typeScriptExpression(description, referenceTypes);

  if (expression === null) {
    return projectionError({
      projection: 'typescript',
      path: options.path ?? [],
      reason: 'unsupported contract description',
    });
  }

  return toTypeScriptDeclaration(declarationName, description, referenceTypes);
}

function assertDescription(description) {
  if (!description || typeof description !== 'object') {
    throw new Error('TypeScript projection requires a contract description');
  }
}

function collectRegistryNames(description, names = new Set()) {
  if (!description || typeof description !== 'object') return names;

  switch (description.kind) {
    case 'object':
      for (const property of Array.isArray(description.properties) ?
        description.properties
      : [])
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

function typeScriptExpression(
  description,
  registryNames = new Map(),
  depth = 0,
) {
  if (!description) return 'unknown';

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
      return arrayExpression(description, registryNames, depth);

    case 'object':
      return formatObjectType(description, registryNames, depth);

    case 'literal':
      return literalExpression(description.value);

    case 'union':
      return unionExpression(description, registryNames, depth);

    case 'reference':
      return registryNames.get(description.name) ?? description.name;

    case 'never':
      return 'never';

    default:
      return null;
  }
}

function literalExpression(value) {
  return JSON.stringify(value);
}

function unionExpression(description, registryNames, depth) {
  if (!Array.isArray(description.variants)) return 'unknown';
  return description.variants
    .map((variant) => typeScriptExpression(variant, registryNames, depth))
    .join(' | ');
}

function arrayExpression(description, registryNames, depth) {
  if (!description.element) return 'unknown[]';

  const element = typeScriptExpression(
    description.element,
    registryNames,
    depth,
  );
  if (
    description.element.kind === 'union' ||
    description.element.kind === 'object'
  ) {
    return `Array<${element}>`;
  }
  return `${element}[]`;
}

function formatObjectType(description, registryNames, depth) {
  if (!Array.isArray(description.properties)) {
    return 'Record<string, unknown>';
  }

  const currentIndent = '  '.repeat(depth);
  const propertyIndent = '  '.repeat(depth + 1);
  const properties = description.properties
    .map((property) => {
      const valueType = typeScriptExpression(
        property.contract,
        registryNames,
        depth + 1,
      );
      const optionalFlag = property.required ? '' : '?';
      return `${propertyIndent}${propertyKey(property.key)}${optionalFlag}: ${valueType}`;
    })
    .join('\n');

  return `{\n${properties}\n${currentIndent}}`;
}

function propertyKey(key) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
}
