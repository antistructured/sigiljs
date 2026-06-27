/**
 * Type smoke test: projection APIs
 */
import {
  sigil,
  optional,
  oneOf,
  type FormConstraints,
  type FormFieldConstraint,
  type SigilDescription,
} from '@weipertda/sigiljs';

const User = sigil<{ name: string; role: 'admin' | 'user'; age?: number }>({
  name: String,
  role: oneOf('admin', 'user'),
  age: optional(Number),
});

const description: SigilDescription = User.describe();
const descriptionKind: string = description.kind;

const jsonSchema: Record<string, unknown> = User.toJSONSchema();
const openapiSchema: Record<string, unknown> = User.toOpenAPI();
const typeScriptSource: string = User.toTypeScript('User');
const formConstraints: FormConstraints = User.toFormConstraints();

const fields: Record<string, FormFieldConstraint> = formConstraints.fields;
const nameField: FormFieldConstraint | undefined = fields.name;

if (nameField) {
  const name: string = nameField.name;
  const path: string[] = nameField.path;
  const type: string = nameField.type;
  const required: boolean = nameField.required;
  const label: string = nameField.label;
  const options: Array<string | number> | undefined = nameField.options;

  void name;
  void path;
  void type;
  void required;
  void label;
  void options;
}

void descriptionKind;
void jsonSchema;
void openapiSchema;
void typeScriptSource;

export {};
