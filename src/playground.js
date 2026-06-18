#!/usr/bin/env bun
import { file } from 'bun';
import { basename } from 'node:path';
import { T } from './index.js';

const COMMANDS = new Set(['check', 'describe', 'json-schema', 'types', 'mock']);
const args = process.argv.slice(2);

if (COMMANDS.has(args[0])) {
  await runCommand(args[0], args.slice(1));
} else {
  runLegacyPlayground(args);
}

async function runCommand(command, args) {
  try {
    switch (command) {
      case 'check':
        await runCheck(args);
        return;
      case 'describe':
        await runProjection(args, (sigil) => sigil.describe());
        return;
      case 'json-schema':
        await runProjection(args, (sigil) => sigil.toJSONSchema());
        return;
      case 'types':
        await runTypes(args);
        return;
      case 'mock':
        await runProjection(args, (sigil) => sigil.mock());
        return;
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

async function runCheck(args) {
  const [schemaPath, dataPath] = args;
  if (!schemaPath || !dataPath) {
    failUsage('Usage: sigil check schema.sigil data.json');
  }

  const sigil = await readSigil(schemaPath);
  const value = await readJSON(dataPath);

  console.log(`Sigil: ${schemaPath}`);
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

async function runProjection(args, project) {
  const [schemaPath] = args;
  if (!schemaPath) failUsage('Usage: sigil <command> schema.sigil');

  const sigil = await readSigil(schemaPath);
  console.log(JSON.stringify(project(sigil), null, 2));
}

async function runTypes(args) {
  const [schemaPath] = args;
  if (!schemaPath) failUsage('Usage: sigil types schema.sigil');

  const sigil = await readSigil(schemaPath);
  console.log(sigil.toTypeScript(typeNameFromPath(schemaPath)));
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
  try {
    return compileSigil(await file(path).text());
  } catch (error) {
    throw new Error(`Invalid Sigil schema: ${error.message}`);
  }
}

async function readJSON(path) {
  try {
    return JSON.parse(await file(path).text());
  } catch (error) {
    throw new Error(`Invalid JSON input: ${error.message}`);
  }
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
