#!/usr/bin/env bun
import { file, write } from 'bun';
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
  'form',
  'mock',
  'cases',
  'test',
  'diff',
]);
const args = process.argv.slice(2);

if (isHelpRequest(args)) {
  printHelp();
  process.exit(0);
} else if (COMMANDS.has(args[0])) {
  await runCommand(args[0], args.slice(1));
} else {
  runLegacyPlayground(args);
}

function isHelpRequest(args) {
  return (
    args.length === 0 ||
    args[0] === '--help' ||
    args[0] === '-h' ||
    args[0] === 'help'
  );
}

function printHelp() {
  console.log(`SigilJS CLI

Executable data contracts for JavaScript.

Usage: sigil <command> <contract-file> [data-file] [options]

Commands:
  check       Validate JSON data and print human-readable success/failure
  parse       Parse JSON data or exit non-zero with diagnostics
  safe-parse  Parse JSON data and print { success, data } or { success, error }
  describe    Print the stable contract description JSON
  json-schema Print the JSON Schema projection
  types       Print a TypeScript type declaration
  openapi     Print the OpenAPI-compatible projection
  form        Print the form constraint projection
  mock        Print deterministic valid sample data
  cases       Print generated valid and invalid test cases
  test        Print a contract self-test report
  diff        Compare two contract files

Options:
  --json        Output as machine-readable JSON (check, parse, diff)
  --export <N>  Use a named export from a .sigil.js module (default: default)
  --out <path>  Write output to a file instead of stdout

Contract files:
  .sigil files      Sigil type expressions (e.g. { id: number, name: string })
  .sigil.js files   JS modules with a default or named Sigil contract export

Examples:
  sigil check contracts/user.sigil data/user.json
  sigil check contracts/user.sigil.js data/user.json
  sigil parse contracts/user.sigil data/user.json --json
  sigil types contracts/user.sigil User
  sigil json-schema contracts/user.sigil
  sigil form contracts/user.sigil.js
  sigil cases contracts/user.sigil.js
  sigil diff contracts/user-v1.sigil contracts/user-v2.sigil
  sigil describe contracts/user.sigil.js --export User
`);
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
        await runSafeParse(options.args, options);
        return;
      case 'describe':
        await runProjection(options.args, (c) => c.describe(), options);
        return;
      case 'json-schema':
        await runProjection(options.args, (c) => c.toJSONSchema(), options);
        return;
      case 'types':
        await runTypes(options.args, options);
        return;
      case 'openapi':
        await runProjection(options.args, (sigil) => sigil.toOpenAPI(), options);
        return;
      case 'form':
        await runProjection(options.args, (sigil) => sigil.toFormConstraints(), options);
        return;
      case 'mock':
        await runProjection(options.args, (sigil) => sigil.mock(), options);
        return;
      case 'cases':
        await runCases(options.args, options);
        return;
      case 'test':
        await runTest(options.args, options);
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
  const exportIdx = args.indexOf('--export');
  const exportName = exportIdx !== -1 ? args[exportIdx + 1] : null;
  const outIdx = args.indexOf('--out');
  const outPath = outIdx !== -1 ? args[outIdx + 1] : null;

  const flags = new Set(['--json', '--export', '--out']);
  const filtered = args.filter((arg, i) => {
    if (flags.has(arg)) return false;
    if (i > 0 && (args[i - 1] === '--export' || args[i - 1] === '--out'))
      return false;
    return true;
  });

  return {
    json: args.includes('--json'),
    exportName,
    outPath,
    args: filtered,
  };
}

async function runCheck(args, options) {
  const [schemaPath, dataPath] = args;
  if (!schemaPath || !dataPath) {
    failUsage('Usage: sigil check schema.sigil data.json');
  }

  const contract = await readSigil(schemaPath, options);
  const value = await readJSON(dataPath);

  try {
    contract.assert(value);
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

  const contract = await readSigil(schemaPath, options);
  const value = await readJSON(dataPath);

  try {
    console.log(JSON.stringify(contract.parse(value), null, 2));
    process.exit(0);
  } catch (error) {
    printCommandError(error, options);
    process.exit(1);
  }
}

async function runSafeParse(args, options = {}) {
  const [schemaPath, dataPath] = args;
  if (!schemaPath || !dataPath) {
    failUsage('Usage: sigil safe-parse schema.sigil data.json');
  }

  const contract = await readSigil(schemaPath, options);
  const value = await readJSON(dataPath);
  const result = contract.safeParse(value);

  console.log(JSON.stringify(serializeResult(result), null, 2));
}

async function runProjection(args, project, options = {}) {
  const [schemaPath] = args;
  if (!schemaPath) failUsage('Usage: sigil <command> schema.sigil');

  const contract = await readSigil(schemaPath, options);
  const output = JSON.stringify(project(contract), null, 2);
  await writeOutput(output, options);
}

async function runCases(args, options) {
  const [schemaPath] = args;
  if (!schemaPath) failUsage('Usage: sigil cases schema.sigil');

  const contract = await readSigil(schemaPath, options);
  const output = JSON.stringify(contract.cases(), null, 2);
  await writeOutput(output, options);
}

async function runTest(args, options) {
  const [schemaPath] = args;
  if (!schemaPath) failUsage('Usage: sigil test schema.sigil');

  const contract = await readSigil(schemaPath, options);
  // Run self-test with generated cases
  const generatedCases = contract.cases();
  const report = contract.test(generatedCases);
  const output = JSON.stringify(report, null, 2);
  await writeOutput(output, options);
}

async function writeOutput(text, options = {}) {
  if (options.outPath) {
    await write(options.outPath, text + '\n');
  } else {
    console.log(text);
  }
}

async function runTypes(args, options = {}) {
  const [schemaPath, explicitName] = args;
  if (!schemaPath) failUsage('Usage: sigil types schema.sigil [Name]');

  const contract = await readSigil(schemaPath, options);
  console.log(contract.toTypeScript(explicitName ?? typeNameFromPath(schemaPath)));
}

async function runDiff(args, options) {
  const [beforePath, afterPath] = args;
  if (!beforePath || !afterPath) {
    failUsage('Usage: sigil diff before.sigil after.sigil');
  }

  const before = await readSigil(beforePath, options);
  const after = await readSigil(afterPath, options);
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

async function readSigil(path, options = {}) {
  // Auto-detect JS module files by extension
  if (path.endsWith('.js') || path.endsWith('.mjs')) {
    return readSigilModule(path, options);
  }

  const source = await readTextFile(path, 'Contract');

  try {
    return compileSigil(source);
  } catch (error) {
    throw new Error(`Invalid Sigil contract in ${path}: ${error.message}`, { cause: error });
  }
}

/**
 * Load a Sigil contract from a JS module file.
 * Supports `export default` and named exports via --export <name>.
 */
async function readSigilModule(path, options = {}) {
  const resolved = new URL(path, `file://${process.cwd()}/`).href;

  let mod;
  try {
    mod = await import(resolved);
  } catch (error) {
    if (isMissingFileError(error) || error?.message?.includes('Cannot find module')) {
      throw new Error(`Contract file not found: ${path}`, { cause: error });
    }
    throw new Error(`Failed to load contract module ${path}: ${error.message}`, { cause: error });
  }

  const exportName = options.exportName;

  if (exportName) {
    if (!Object.hasOwn(mod, exportName)) {
      throw new Error(
        `Named export '${exportName}' not found in ${path}. Available exports: ${Object.keys(mod).join(', ')}`,
      );
    }
    return assertSigilContract(mod[exportName], path, exportName);
  }

  if (mod.default !== undefined) {
    return assertSigilContract(mod.default, path, 'default');
  }

  const named = Object.keys(mod).filter((k) => k !== 'default');
  if (named.length === 1) {
    return assertSigilContract(mod[named[0]], path, named[0]);
  }

  throw new Error(
    `No default export found in ${path}. Use --export <name> to select a named export. Available: ${Object.keys(mod).join(', ')}`,
  );
}

function assertSigilContract(value, path, exportName) {
  if (
    value &&
    typeof value === 'object' &&
    typeof value.parse === 'function' &&
    typeof value.safeParse === 'function'
  ) {
    return value;
  }
  throw new Error(
    `Export '${exportName}' in ${path} is not a Sigil contract. Make sure it is created with sigil() or sigil.exact().`,
  );
}

async function readJSON(path) {
  const source = await readTextFile(path, 'Data');

  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`Invalid JSON data in ${path}: ${error.message}`, { cause: error });
  }
}

async function readTextFile(path, label) {
  try {
    return await file(path).text();
  } catch (error) {
    if (isMissingFileError(error)) {
      throw new Error(`${label} file not found: ${path}`, { cause: error });
    }
    throw new Error(
      `Unable to read ${label.toLowerCase()} file ${path}: ${error.message}`,
      { cause: error },
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
