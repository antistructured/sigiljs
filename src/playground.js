#!/usr/bin/env bun
import { file } from 'bun';
import { basename } from 'node:path';
import { T } from './index.js';

const COMMANDS = new Set([
  'check',
  'parse',
  'safe-parse',
  'describe',
  'json-schema',
  'types',
  'openapi',
  'mock',
  'diff',
]);
const args = process.argv.slice(2);

if (COMMANDS.has(args[0])) {
  await runCommand(args[0], args.slice(1));
} else {
  runLegacyPlayground(args);
}

async function runCommand(command, args) {
  const options = parseCommandOptions(args);

  try {
    switch (command) {
      case 'check':
        await runCheck(options.args, options);
        return;
      case 'parse':
        await runParse(options.args, options);
        return;
      case 'safe-parse':
        await runSafeParse(options.args);
        return;
      case 'describe':
        await runProjection(options.args, (sigil) => sigil.describe());
        return;
      case 'json-schema':
        await runProjection(options.args, (sigil) => sigil.toJSONSchema());
        return;
      case 'types':
        await runTypes(options.args);
        return;
      case 'openapi':
        await runProjection(options.args, (sigil) => sigil.toOpenAPI());
        return;
      case 'mock':
        await runProjection(options.args, (sigil) => sigil.mock());
        return;
      case 'diff':
        await runDiff(options.args, options);
        return;
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

function parseCommandOptions(args) {
  return {
    json: args.includes('--json'),
    args: args.filter((arg) => arg !== '--json'),
  };
}

async function runCheck(args, options) {
  const [schemaPath, dataPath] = args;
  if (!schemaPath || !dataPath) {
    failUsage('Usage: sigil check schema.sigil data.json');
  }

  const sigil = await readSigil(schemaPath);
  const value = await readJSON(dataPath);

  try {
    sigil.assert(value);
    printCheckSuccess(schemaPath, dataPath, options);
    process.exit(0);
  } catch (error) {
    printCommandError(error, options);
    process.exit(1);
  }
}

async function runParse(args, options) {
  const [schemaPath, dataPath] = args;
  if (!schemaPath || !dataPath) {
    failUsage('Usage: sigil parse schema.sigil data.json');
  }

  const sigil = await readSigil(schemaPath);
  const value = await readJSON(dataPath);

  try {
    console.log(JSON.stringify(sigil.parse(value), null, 2));
    process.exit(0);
  } catch (error) {
    printCommandError(error, options);
    process.exit(1);
  }
}

async function runSafeParse(args) {
  const [schemaPath, dataPath] = args;
  if (!schemaPath || !dataPath) {
    failUsage('Usage: sigil safe-parse schema.sigil data.json');
  }

  const sigil = await readSigil(schemaPath);
  const value = await readJSON(dataPath);
  const result = sigil.safeParse(value);

  console.log(JSON.stringify(serializeResult(result), null, 2));
}

async function runProjection(args, project) {
  const [schemaPath] = args;
  if (!schemaPath) failUsage('Usage: sigil <command> schema.sigil');

  const sigil = await readSigil(schemaPath);
  console.log(JSON.stringify(project(sigil), null, 2));
}

async function runTypes(args) {
  const [schemaPath, explicitName] = args;
  if (!schemaPath) failUsage('Usage: sigil types schema.sigil [Name]');

  const sigil = await readSigil(schemaPath);
  console.log(sigil.toTypeScript(explicitName ?? typeNameFromPath(schemaPath)));
}

async function runDiff(args, options) {
  const [beforePath, afterPath] = args;
  if (!beforePath || !afterPath) {
    failUsage('Usage: sigil diff before.sigil after.sigil');
  }

  const before = await readSigil(beforePath);
  const after = await readSigil(afterPath);
  const changes = after.diff(before);

  if (options.json) {
    console.log(JSON.stringify(changes, null, 2));
  } else {
    printHumanDiff(changes);
  }
}

function runLegacyPlayground(args) {
  const jsonStr = args[0];
  const sigilStr = args[1];

  if (!jsonStr || !sigilStr) {
    console.error("Usage: bun run src/playground.js '<json>' '<sigil>'");
    console.error('Usage: sigil check schema.sigil data.json');
    process.exit(1);
  }

  let value;
  try {
    value = JSON.parse(jsonStr);
  } catch (error) {
    console.error('Invalid JSON input:', error.message);
    process.exit(1);
  }

  let sigil;
  try {
    sigil = compileSigil(sigilStr);
  } catch (error) {
    console.error('Invalid Sigil schema:', error.message);
    process.exit(1);
  }

  console.log(`Sigil: ${sigilStr}`);
  console.log(`Value: ${formatValue(value)}`);

  try {
    sigil.assert(value);
    console.log('Result: valid');
    process.exit(0);
  } catch (error) {
    printValidationError(error);
    process.exit(1);
  }
}

async function readSigil(path) {
  const source = await readTextFile(path, 'Contract');

  try {
    return compileSigil(source);
  } catch (error) {
    throw new Error(`Invalid Sigil contract in ${path}: ${error.message}`);
  }
}

async function readJSON(path) {
  const source = await readTextFile(path, 'Data');

  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`Invalid JSON data in ${path}: ${error.message}`);
  }
}

async function readTextFile(path, label) {
  try {
    return await file(path).text();
  } catch (error) {
    if (isMissingFileError(error)) {
      throw new Error(`${label} file not found: ${path}`);
    }
    throw new Error(
      `Unable to read ${label.toLowerCase()} file ${path}: ${error.message}`,
    );
  }
}

function isMissingFileError(error) {
  return error?.code === 'ENOENT' || error?.message?.includes('ENOENT');
}

function compileSigil(source) {
  const strings = [source.trim()];
  strings.raw = [source.trim()];
  return T(strings);
}

function printValidationError(error) {
  console.log('Result: invalid');
  console.log(`Path: ${formatPath(error.path)}`);
  console.log(`Expected: ${error.expected ?? 'unknown'}`);
  console.log(`Actual: ${error.actual ?? 'unknown'}`);
}

function printCheckSuccess(schemaPath, dataPath, options) {
  if (options.json) {
    console.log(JSON.stringify({ success: true }, null, 2));
    return;
  }

  console.log('✓ valid');
  console.log('');
  console.log(`Contract: ${typeNameFromPath(schemaPath)}`);
  console.log(`Data: ${dataPath}`);
}

function printCommandError(error, options) {
  if (options.json) {
    console.log(
      JSON.stringify(
        { success: false, error: serializeCliError(error) },
        null,
        2,
      ),
    );
    return;
  }

  printHumanValidationError(error);
}

function printHumanValidationError(error) {
  const details = serializeCliError(error);

  console.log('✗ invalid');
  console.log('');
  console.log(`Path: ${formatPath(details.path)}`);
  console.log(`Expected: ${details.expected ?? 'unknown'}`);
  console.log(`Actual: ${details.actual ?? 'unknown'}`);
  console.log(`Message: ${details.message}`);
}

function printHumanDiff(changes) {
  console.log('Contract changes:');

  if (changes.length === 0) {
    console.log('');
    console.log('No changes.');
    return;
  }

  printDiffGroup(
    'BREAKING',
    changes.filter((change) => change.impact === 'breaking'),
  );
  printDiffGroup(
    'NON-BREAKING',
    changes.filter((change) => change.impact === 'non-breaking'),
  );
  printDiffGroup(
    'UNKNOWN',
    changes.filter((change) => change.impact === 'unknown'),
  );
}

function printDiffGroup(title, changes) {
  if (changes.length === 0) return;

  console.log('');
  console.log(title);
  for (const change of changes) {
    console.log(`- ${formatDiffChange(change)}`);
  }
}

function formatDiffChange(change) {
  const path = formatPath(change.path);

  switch (change.kind) {
    case 'property.added':
      return `added property: ${path}`;
    case 'property.removed':
      return `removed property: ${path}`;
    case 'property.required_changed':
      return change.to ?
          `required property: ${path}`
        : `optional property: ${path}`;
    case 'property.contract_changed':
      return `changed property: ${path} ${formatContract(change.from)} → ${formatContract(change.to)}`;
    case 'exact.changed':
      return `changed exact mode: ${change.from} → ${change.to}`;
    case 'metadata.changed':
      return `changed metadata: ${path}`;
    default:
      return `${change.kind}: ${path}`;
  }
}

function formatContract(contract) {
  if (!contract) return 'unknown';
  if (contract.kind) return contract.kind;
  return JSON.stringify(contract);
}

function serializeCliError(error) {
  return {
    code: error?.code ?? 'SIGIL_VALIDATION_FAILED',
    path: Array.isArray(error?.path) ? error.path : [],
    expected: error?.expected ?? 'unknown',
    actual: error?.actual ?? 'unknown',
    message: error?.message ?? String(error),
  };
}

function serializeResult(result) {
  if (result.success) return result;
  return { success: false, error: serializeError(result.error) };
}

function serializeError(error) {
  if (typeof error?.toJSON === 'function') return error.toJSON();
  return {
    name: error?.name ?? 'Error',
    message: error?.message ?? String(error),
  };
}

function formatValue(value) {
  return JSON.stringify(value, null, 2).replace(/\n\s*/g, ' ');
}

function formatPath(path) {
  if (!Array.isArray(path) || path.length === 0) return '(root)';
  return path.join('.');
}

function typeNameFromPath(path) {
  const withoutExtension = basename(path).replace(/\.sigil$/i, '');
  const parts = withoutExtension.split(/[^A-Za-z0-9]+/).filter(Boolean);
  const name = parts.map(capitalize).join('');
  return name || 'Schema';
}

function capitalize(value) {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function failUsage(message) {
  throw new Error(message);
}
