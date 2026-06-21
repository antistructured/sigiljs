import { projectJSONSchema } from './json-schema.js';

export function projectOpenAPI(description) {
  return cloneJSON(projectJSONSchema(description));
}

function cloneJSON(value) {
  return JSON.parse(JSON.stringify(value));
}
