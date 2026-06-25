/**
 * Task 7 — Form Constraint Tests
 *
 * Comprehensive tests for toFormConstraints() projection behavior.
 * All tests are deterministic, offline, and framework-neutral.
 */
import { describe, test, expect } from 'bun:test';
import { oneOf, optional, sigil, union } from '../src/index.js';

// ─── Basic field types ─────────────────────────────────────────────────────

describe('Form constraints — basic field types', () => {
  test('string field projects to type text', () => {
    const Form = sigil.exact({ name: String });
    const { fields } = Form.toFormConstraints();

    expect(fields.name.type).toBe('text');
    expect(fields.name.required).toBe(true);
    expect(fields.name.name).toBe('name');
    expect(fields.name.path).toEqual(['name']);
    expect(fields.name.label).toBe('Name');
  });

  test('number field projects to type number', () => {
    const Form = sigil.exact({ age: Number });
    const { fields } = Form.toFormConstraints();

    expect(fields.age.type).toBe('number');
    expect(fields.age.required).toBe(true);
  });

  test('boolean field projects to type checkbox', () => {
    const Form = sigil.exact({ subscribed: Boolean });
    const { fields } = Form.toFormConstraints();

    expect(fields.subscribed.type).toBe('checkbox');
    expect(fields.subscribed.required).toBe(true);
  });
});

// ─── Required and optional ────────────────────────────────────────────────

describe('Form constraints — required and optional fields', () => {
  test('required field has required: true', () => {
    const Form = sigil.exact({ email: String });
    const { fields } = Form.toFormConstraints();
    expect(fields.email.required).toBe(true);
  });

  test('optional field has required: false', () => {
    const Form = sigil.exact({ phone: optional(String) });
    const { fields } = Form.toFormConstraints();
    expect(fields.phone.required).toBe(false);
  });

  test('optional field type is derived from inner contract', () => {
    const Form = sigil.exact({
      age: optional(Number),
      note: optional(String),
    });
    const { fields } = Form.toFormConstraints();
    expect(fields.age.type).toBe('number');
    expect(fields.note.type).toBe('text');
  });

  test('mix of required and optional in same form', () => {
    const Form = sigil.exact({
      name: String,
      bio: optional(String),
      age: optional(Number),
    });
    const { fields } = Form.toFormConstraints();
    expect(fields.name.required).toBe(true);
    expect(fields.bio.required).toBe(false);
    expect(fields.age.required).toBe(false);
  });
});

// ─── Literal union (select) ───────────────────────────────────────────────

describe('Form constraints — literal union select fields', () => {
  test('all-literal union projects to select with options', () => {
    const Form = sigil.exact({ role: oneOf('admin', 'user') });
    const { fields } = Form.toFormConstraints();

    expect(fields.role.type).toBe('select');
    expect(fields.role.options).toEqual(['admin', 'user']);
    expect(fields.role.required).toBe(true);
  });

  test('options preserve definition order', () => {
    const Form = sigil.exact({ tier: oneOf('free', 'pro', 'enterprise') });
    const { fields } = Form.toFormConstraints();
    expect(fields.tier.options).toEqual(['free', 'pro', 'enterprise']);
  });

  test('single literal projects to select with one option', () => {
    // A field constrained to a single literal value
    const Form = sigil.exact({ status: oneOf('active') });
    const { fields } = Form.toFormConstraints();
    expect(fields.status.type).toBe('select');
    expect(fields.status.options).toEqual(['active']);
  });

  test('optional literal union is required: false with select type', () => {
    const Form = sigil.exact({ plan: optional(oneOf('free', 'pro')) });
    const { fields } = Form.toFormConstraints();
    expect(fields.plan.required).toBe(false);
    expect(fields.plan.type).toBe('select');
    expect(fields.plan.options).toEqual(['free', 'pro']);
  });
});

// ─── Mixed union ──────────────────────────────────────────────────────────

describe('Form constraints — mixed union fields', () => {
  test('mixed union projects first accepted type with accepts array', () => {
    const Form = sigil.exact({ id: union(String, Number) });
    const { fields } = Form.toFormConstraints();
    expect(fields.id.type).toBe('text');
    expect(fields.id.accepts).toEqual(expect.arrayContaining(['text', 'number']));
  });
});

// ─── Label derivation ─────────────────────────────────────────────────────

describe('Form constraints — label derivation', () => {
  test('camelCase key becomes Title Case label', () => {
    const Form = sigil.exact({ firstName: String });
    const { fields } = Form.toFormConstraints();
    expect(fields.firstName.label).toBe('First Name');
  });

  test('snake_case key becomes Title Case label', () => {
    const Form = sigil.exact({ date_of_birth: String });
    const { fields } = Form.toFormConstraints();
    expect(fields.date_of_birth.label).toBe('Date Of Birth');
  });

  test('single lowercase key is capitalized', () => {
    const Form = sigil.exact({ name: String, email: String });
    const { fields } = Form.toFormConstraints();
    expect(fields.name.label).toBe('Name');
    expect(fields.email.label).toBe('Email');
  });
});

// ─── Path ─────────────────────────────────────────────────────────────────

describe('Form constraints — field path', () => {
  test('top-level field has single-element path', () => {
    const Form = sigil.exact({ email: String });
    const { fields } = Form.toFormConstraints();
    expect(fields.email.path).toEqual(['email']);
  });

  test('nested field path includes parent keys', () => {
    const Form = sigil.exact({
      address: sigil.exact({ city: String, zip: String }),
    });
    const { fields } = Form.toFormConstraints();
    expect(fields.address.fields.city.path).toEqual(['address', 'city']);
    expect(fields.address.fields.zip.path).toEqual(['address', 'zip']);
  });
});

// ─── Nested objects ───────────────────────────────────────────────────────

describe('Form constraints — nested object fields', () => {
  test('nested exact object projects to type object with fields', () => {
    const Form = sigil.exact({
      address: sigil.exact({ city: String, state: String }),
    });
    const { fields } = Form.toFormConstraints();

    expect(fields.address.type).toBe('object');
    expect(fields.address.fields).toBeDefined();
    expect(fields.address.fields.city.type).toBe('text');
    expect(fields.address.fields.state.type).toBe('text');
  });

  test('nested object preserves required semantics on nested fields', () => {
    const Form = sigil.exact({
      profile: sigil.exact({
        bio: optional(String),
        website: String,
      }),
    });
    const { fields } = Form.toFormConstraints();

    expect(fields.profile.fields.bio.required).toBe(false);
    expect(fields.profile.fields.website.required).toBe(true);
  });

  test('deeply nested objects project recursively', () => {
    const Form = sigil.exact({
      meta: sigil.exact({
        author: sigil.exact({ name: String }),
      }),
    });
    const { fields } = Form.toFormConstraints();

    expect(fields.meta.type).toBe('object');
    expect(fields.meta.fields.author.type).toBe('object');
    expect(fields.meta.fields.author.fields.name.type).toBe('text');
    expect(fields.meta.fields.author.fields.name.path).toEqual(['meta', 'author', 'name']);
  });
});

// ─── Array fields ─────────────────────────────────────────────────────────

describe('Form constraints — array fields', () => {
  test('Array field projects to type array with items', () => {
    const Form = sigil.exact({ tags: Array });
    const { fields } = Form.toFormConstraints();

    expect(fields.tags.type).toBe('array');
    expect(fields.tags.items).toBeDefined();
  });

  test('array field required status reflects optional wrapper', () => {
    const Form = sigil.exact({ tags: Array, notes: optional(Array) });
    const { fields } = Form.toFormConstraints();

    expect(fields.tags.required).toBe(true);
    expect(fields.notes.required).toBe(false);
  });
});

// ─── Exact object contract ────────────────────────────────────────────────

describe('Form constraints — exact object contract', () => {
  test('sigil.exact produces the same field structure as sigil()', () => {
    const ExactForm = sigil.exact({ name: String, age: Number });
    const OpenForm = sigil({ name: String, age: Number });

    const exact = ExactForm.toFormConstraints();
    const open = OpenForm.toFormConstraints();

    expect(Object.keys(exact.fields)).toEqual(Object.keys(open.fields));
    expect(exact.fields.name.type).toBe(open.fields.name.type);
    expect(exact.fields.age.type).toBe(open.fields.age.type);
  });
});

// ─── Non-object contracts ─────────────────────────────────────────────────

describe('Form constraints — non-object contracts', () => {
  test('string contract returns empty fields map', () => {
    expect(sigil(String).toFormConstraints()).toEqual({ fields: {} });
  });

  test('number contract returns empty fields map', () => {
    expect(sigil(Number).toFormConstraints()).toEqual({ fields: {} });
  });

  test('boolean contract returns empty fields map', () => {
    expect(sigil(Boolean).toFormConstraints()).toEqual({ fields: {} });
  });
});

// ─── Output shape ─────────────────────────────────────────────────────────

describe('Form constraints — output shape', () => {
  test('toFormConstraints returns { fields } wrapper', () => {
    const Form = sigil.exact({ name: String });
    const result = Form.toFormConstraints();
    expect(result).toHaveProperty('fields');
    expect(typeof result.fields).toBe('object');
  });

  test('returns a fresh object each call (not cached)', () => {
    const Form = sigil.exact({ name: String });
    const a = Form.toFormConstraints();
    const b = Form.toFormConstraints();
    a.fields.name.type = 'number'; // mutate first result
    expect(b.fields.name.type).toBe('text'); // second result is unaffected
  });

  test('field entries have name, path, type, required, label', () => {
    const Form = sigil.exact({ email: String });
    const { fields } = Form.toFormConstraints();
    expect(fields.email).toMatchObject({
      name: 'email',
      path: ['email'],
      type: 'text',
      required: true,
      label: 'Email',
    });
  });
});

// ─── Deterministic field order ────────────────────────────────────────────

describe('Form constraints — deterministic field order', () => {
  test('fields appear in definition order', () => {
    const Form = sigil.exact({
      email: String,
      name: String,
      role: oneOf('admin', 'user'),
      bio: optional(String),
    });
    const keys = Object.keys(Form.toFormConstraints().fields);
    expect(keys).toEqual(['email', 'name', 'role', 'bio']);
  });
});
