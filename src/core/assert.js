import { validate } from './validate.js';
import { SigilValidationError } from './errors.js';
import { realType } from './realType.js';
import { resolve } from './registry.js';
import { getAstRegistry } from './compile.js';

function resolveName(name, registry) {
  return registry ? registry.get(name) : resolve(name);
}

/**
 * Validates a value against a schema and throws a structured `SigilValidationError`
 * if validation fails. Returns the validated value if validation passes.
 *
 * @param {object} astOrSigil - Raw AST, or a Sigil object with `.normalized` / `.ast`
 * @param {*} value           - The value to validate
 * @param {object} [opts]     - Optional hooks / options
 * @returns {*}
 * @throws {SigilValidationError}
 */
export function assert(astOrSigil, value, opts) {
  try {
    if (validate(astOrSigil, value, opts)) return value;
  } catch (e) {
    // validate() may throw when a lazy identifier resolver can't find a named sigil.
    // Re-wrap as a structured SigilValidationError so callers always get a consistent type.
    throw new SigilValidationError({
      message: e.message ?? 'Validation failed',
      path: [],
      expected: 'unknown',
      actual: realType(value, opts),
    });
  }

  const ast = astOrSigil.normalized ?? astOrSigil.ast ?? astOrSigil;

  let err;
  try {
    err = findError(ast, value, opts, []);
  } catch (e) {
    // findError's identifier case may also throw for unresolvable names.
    throw new SigilValidationError({
      message: e.message ?? 'Validation failed',
      path: [],
      expected: 'unknown',
      actual: realType(value, opts),
    });
  }

  if (err) {
    throw new SigilValidationError(err);
  }

  // Generic fallback (should rarely be reached)
  throw new SigilValidationError({
    message: 'Validation failed',
    path: [],
    expected: 'match',
    actual: realType(value, opts),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a human-readable type string for any AST node.
 * Used in error messages as the "expected" description.
 *
 * @param {object} ast
 * @returns {string}
 */
function describeType(ast) {
  if (!ast) return 'unknown';
  switch (ast.kind) {
    case 'primitive':
      return ast.name;
    case 'literal':
      return JSON.stringify(ast.value);
    case 'literal_union':
      return ast.values.map((v) => JSON.stringify(v)).join(' | ');
    case 'primitive_union':
      return ast.names.join(' | ');
    case 'union':
      return ast.members.map(describeType).join(' | ');
    case 'array':
      return `${describeType(ast.element)}[]`;
    case 'optional':
      return `${describeType(ast.inner)}?`;
    case 'object':
      return 'object';
    case 'identifier':
      return ast.name;
    default:
      return ast.kind ?? 'unknown';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Core error-finding walker
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recursively walks the AST to find the deepest, most-specific failure point.
 *
 * Returns a structured error descriptor, or null if no specific failure is found.
 *
 * @param {object}   ast
 * @param {*}        value
 * @param {object}   opts
 * @param {Array<string|number>} path - Accumulated property path (e.g. ["user", "items", 0, "price"])
 * @returns {{ message: string, path: Array<string|number>, expected: string, actual: string } | null}
 */
function findError(ast, value, opts, path) {
  if (!ast) return null;

  switch (ast.kind) {
    // ── Primitive ────────────────────────────────────────────────────────────
    case 'primitive': {
      const p = ast.name;
      if (p === 'any' || p === 'unknown') return null;

      if (p === 'never') {
        const actual = realType(value, opts);
        return {
          message: `Expected never, got ${actual}`,
          path,
          expected: 'never',
          actual,
        };
      }

      if (
        p === 'string' ||
        p === 'number' ||
        p === 'boolean' ||
        p === 'symbol' ||
        p === 'bigint' ||
        p === 'undefined'
      ) {
        const actual = typeof value;
        return actual !== p ?
            {
              message: `Expected ${p}, got ${actual}`,
              path,
              expected: p,
              actual,
            }
          : null;
      }

      const actual = realType(value, opts);
      return actual !== p ?
          { message: `Expected ${p}, got ${actual}`, path, expected: p, actual }
        : null;
    }

    // ── Literal ───────────────────────────────────────────────────────────────
    case 'literal': {
      if (value !== ast.value) {
        const expected = JSON.stringify(ast.value);
        const actual = JSON.stringify(value);
        return {
          message: `Expected literal ${expected}, got ${actual}`,
          path,
          expected,
          actual: String(value),
        };
      }
      return null;
    }

    // ── Literal union ─────────────────────────────────────────────────────────
    case 'literal_union': {
      if (!ast.values.includes(value)) {
        const expected = ast.values.map((v) => JSON.stringify(v)).join(' | ');
        return {
          message: `Expected one of [${expected}], got ${JSON.stringify(value)}`,
          path,
          expected,
          actual: String(value),
        };
      }
      return null;
    }

    // ── Primitive union ───────────────────────────────────────────────────────
    case 'primitive_union': {
      const actual = realType(value, opts);
      if (!ast.names.includes(actual)) {
        const expected = ast.names.join(' | ');
        return {
          message: `Expected ${expected}, got ${actual}`,
          path,
          expected,
          actual,
        };
      }
      return null;
    }

    // ── Union (mixed / complex) ───────────────────────────────────────────────
    //
    // Strategy: try every branch and keep the error with the deepest path
    // (most specific failure). If any sub-error reaches deeper than the current
    // path, return that — it gives the user the most actionable location.
    // If all failures are at the same depth, fall back to a union-level message.
    case 'union': {
      let bestErr = null;
      for (const member of ast.members) {
        const err = findError(member, value, opts, path);
        if (!bestErr || (err && err.path.length > bestErr.path.length)) {
          bestErr = err;
        }
      }
      // A sub-branch had a deeper, more specific failure — surface it
      if (bestErr && bestErr.path.length > path.length) {
        return bestErr;
      }
      // All branches failed at the current depth — report the union itself
      const expected = ast.members.map(describeType).join(' | ');
      const actual = realType(value, opts);
      return {
        message: `Expected ${expected}, got ${actual}`,
        path,
        expected,
        actual,
      };
    }

    // ── Optional ─────────────────────────────────────────────────────────────
    case 'optional': {
      return value === undefined ? null : (
          findError(ast.inner, value, opts, path)
        );
    }

    // ── Array ─────────────────────────────────────────────────────────────────
    case 'array': {
      if (!Array.isArray(value)) {
        const actual = realType(value, opts);
        return {
          message: `Expected array, got ${actual}`,
          path,
          expected: 'array',
          actual,
        };
      }
      const elemType = describeType(ast.element);
      for (let i = 0; i < value.length; i++) {
        const err = findError(ast.element, value[i], opts, [...path, i]);
        if (err) {
          return {
            ...err,
            message: `Expected item [${i}] to be ${elemType}, got ${err.actual}`,
          };
        }
      }
      return null;
    }

    // ── Object ────────────────────────────────────────────────────────────────
    case 'object': {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        const actual = realType(value, opts);
        return {
          message: `Expected object, got ${actual}`,
          path,
          expected: 'object',
          actual,
        };
      }

      // Exact mode: report the first unexpected property
      if (ast.exact) {
        const allowed = new Set(ast.properties.map((p) => p.key));
        for (const key in value) {
          if (!allowed.has(key)) {
            return {
              message: `Unexpected property "${key}"`,
              path: [...path, key],
              expected: 'never',
              actual: realType(value[key], opts),
            };
          }
        }
      }

      // Check required properties
      for (const p of ast.properties) {
        if (!p.optional && !(p.key in value)) {
          const expected = describeType(p.value);
          return {
            message: `Missing required property "${p.key}" (expected ${expected})`,
            path: [...path, p.key],
            expected,
            actual: 'undefined',
          };
        }

        if (p.key in value && value[p.key] !== undefined) {
          const err = findError(p.value, value[p.key], opts, [...path, p.key]);
          if (err) {
            // Only override the message if the error is exactly one level deep
            // (i.e., the failure IS the property itself). Deeper errors already
            // carry their own enriched contextual message and must not be re-wrapped.
            const isDirectFailure = err.path.length === path.length + 1;
            return {
              ...err,
              message:
                isDirectFailure ?
                  `Expected property "${p.key}" to be ${err.expected}, got ${err.actual}`
                : err.message,
            };
          }
        }
      }

      return null;
    }

    // ── Identifier (named sigil reference) ───────────────────────────────────
    case 'identifier': {
      const name = ast.name;
      const sigil = resolveName(name, getAstRegistry(ast));
      if (!sigil) {
        // Unknown at error-finding time — mirror the runtime throw as an error object
        return {
          message: `Unknown sigil reference: ${name}`,
          path,
          expected: name,
          actual: realType(value, opts),
        };
      }
      return findError(sigil.normalized ?? sigil.ast, value, opts, path);
    }

    default:
      return null;
  }
}
