import { realType } from '../core/realType.js';
import { canonicalize, validatorCache } from './cache.js';
import { resolve } from './registry.js';

export function getAstRegistry(ast) {
  return ast?.__registry;
}

function resolveName(name, registry) {
  return registry ? registry.get(name) : resolve(name);
}

const FAST_PRIMITIVES = new Set([
  'string',
  'number',
  'boolean',
  'symbol',
  'bigint',
  'undefined',
  'null',
  'array',
  'object',
  'function',
]);

function canUsePrimitiveFastUnion(names) {
  for (let i = 0; i < names.length; i++) {
    if (!FAST_PRIMITIVES.has(names[i])) return false;
  }
  return true;
}

/**
 * Compiles a normalized+partially-evaluated SigilJS AST into a fast validator function.
 *
 * Validators are memoized by structural identity (via JSON canonicalization).
 * A validator function has the signature: (value, opts?) => boolean
 *
 * @param {object} ast - Normalized & partially-evaluated AST node
 * @returns {(value: *, opts?: object) => boolean}
 */
export function compile(ast) {
  if (!ast) return () => true;

  const registry = getAstRegistry(ast);
  const key =
    registry ?
      `${registry.__sigilRegistryId}:${canonicalize(ast)}`
    : canonicalize(ast);
  const cached = validatorCache.get(key);
  if (cached !== undefined) return cached;

  const validator = build(ast);
  validatorCache.set(key, validator);
  return validator;
}

/**
 * Recursively builds a validator closure from an AST node.
 * @param {object} ast
 * @param {Set<string>} [visited] - Track visited identifiers for recursion safety
 * @returns {Function}
 */
function build(ast, visited = new Set()) {
  switch (ast.kind) {
    case 'primitive': {
      const p = ast.name;
      if (p === 'any' || p === 'unknown') return () => true;
      if (p === 'never') return () => false;

      switch (p) {
        case 'string':
          return (v) => typeof v === 'string';
        case 'number':
          return (v) => typeof v === 'number' && !Number.isNaN(v);
        case 'boolean':
          return (v) => typeof v === 'boolean';
        case 'symbol':
          return (v) => typeof v === 'symbol';
        case 'bigint':
          return (v) => typeof v === 'bigint';
        case 'undefined':
          return (v) => v === undefined;
        case 'null':
          return (v) => v === null;
        case 'array':
          return Array.isArray;
        case 'object':
          return (v) =>
            typeof v === 'object' && v !== null && !Array.isArray(v);
        case 'function':
          return (v) => typeof v === 'function';
      }
      return (v, opts) => realType(v, opts) === p;
    }

    case 'literal': {
      const val = ast.value;
      return (v) => v === val;
    }

    case 'literal_union': {
      // Fast-path: direct comparisons for small unions, Set membership for larger unions.
      const values = ast.values;
      switch (values.length) {
        case 0:
          return () => false;
        case 1: {
          const a = values[0];
          return (v) => v === a;
        }
        case 2: {
          const a = values[0];
          const b = values[1];
          return (v) => v === a || v === b;
        }
        case 3: {
          const a = values[0];
          const b = values[1];
          const c = values[2];
          return (v) => v === a || v === b || v === c;
        }
        case 4: {
          const a = values[0];
          const b = values[1];
          const c = values[2];
          const d = values[3];
          return (v) => v === a || v === b || v === c || v === d;
        }
      }
      const set = new Set(ast.values);
      return (v) => set.has(v);
    }

    case 'primitive_union': {
      const names = ast.names;
      if (canUsePrimitiveFastUnion(names)) {
        const checks = names.map((name) => build({ kind: 'primitive', name }));
        const len = checks.length;
        switch (len) {
          case 0:
            return () => false;
          case 1: {
            const a = checks[0];
            return (v) => a(v);
          }
          case 2: {
            const a = checks[0];
            const b = checks[1];
            return (v) => a(v) || b(v);
          }
          case 3: {
            const a = checks[0];
            const b = checks[1];
            const c = checks[2];
            return (v) => a(v) || b(v) || c(v);
          }
          case 4: {
            const a = checks[0];
            const b = checks[1];
            const c = checks[2];
            const d = checks[3];
            return (v) => a(v) || b(v) || c(v) || d(v);
          }
          default:
            return (v) => {
              for (let i = 0; i < len; i++) {
                if (checks[i](v)) return true;
              }
              return false;
            };
        }
      }

      const set = new Set(names);
      return (v, opts) => set.has(realType(v, opts));
    }

    case 'union': {
      const fns = ast.members.map((m) => build(m, visited));
      const len = fns.length;
      return (v, opts) => {
        for (let i = 0; i < len; i++) {
          if (fns[i](v, opts)) return true;
        }
        return false;
      };
    }

    case 'array': {
      const el = build(ast.element, visited);
      return (v, opts) => {
        if (!Array.isArray(v)) return false;
        for (let i = 0; i < v.length; i++) {
          if (!el(v[i], opts)) return false;
        }
        return true;
      };
    }

    case 'optional': {
      const inner = build(ast.inner, visited);
      return (v, opts) => v === undefined || inner(v, opts);
    }

    case 'object': {
      // Use pre-computed hint arrays from partial evaluation to avoid
      // re-filtering on every validator invocation (pure win — zero cost at compile time)
      const { hints, properties } = ast;
      const byKey = new Map();
      for (let i = 0; i < properties.length; i++) {
        const p = properties[i];
        byKey.set(p.key, p);
      }

      let req;
      let opt;
      if (hints) {
        const requiredKeys = hints.requiredKeys;
        const optionalKeys = hints.optionalKeys;
        req = new Array(requiredKeys.length);
        opt = new Array(optionalKeys.length);

        for (let i = 0; i < requiredKeys.length; i++) {
          const key = requiredKeys[i];
          req[i] = { key, check: build(byKey.get(key).value, visited) };
        }

        for (let i = 0; i < optionalKeys.length; i++) {
          const key = optionalKeys[i];
          opt[i] = { key, check: build(byKey.get(key).value, visited) };
        }
      } else {
        req = [];
        opt = [];
        for (let i = 0; i < properties.length; i++) {
          const p = properties[i];
          const compiled = { key: p.key, check: build(p.value, visited) };
          if (p.optional) opt.push(compiled);
          else req.push(compiled);
        }
      }

      const reqLen = req.length;
      const optLen = opt.length;
      let allowedKeys = null;
      if (ast.exact) {
        allowedKeys = new Set();
        for (let i = 0; i < properties.length; i++)
          allowedKeys.add(properties[i].key);
      }

      return (v, opts) => {
        if (typeof v !== 'object' || v === null || Array.isArray(v))
          return false;

        if (ast.exact) {
          for (const key in v) {
            if (!allowedKeys.has(key)) return false;
          }
        }

        for (let i = 0; i < reqLen; i++) {
          const p = req[i];
          if (!(p.key in v) || !p.check(v[p.key], opts)) return false;
        }
        for (let i = 0; i < optLen; i++) {
          const p = opt[i];
          if (p.key in v && v[p.key] !== undefined && !p.check(v[p.key], opts))
            return false;
        }
        return true;
      };
    }

    case 'identifier': {
      const name = ast.name;
      const sigil = resolveName(name, getAstRegistry(ast));

      // If the sigil isn't registered yet, or if we are currently visiting it (circularity),
      // we return a lazy wrapper that resolves the sigil at validation time.
      if (!sigil || visited.has(name)) {
        return (val, o) => {
          const resolved = resolveName(name, getAstRegistry(ast));
          if (!resolved) throw new Error(`Unknown sigil reference: ${name}`);
          return resolved.check(val, o);
        };
      }

      visited.add(name);
      const target = sigil.normalized || sigil.ast;
      const check = build(target, visited);
      visited.delete(name);
      return check;
    }

    default:
      return () => false;
  }
}
