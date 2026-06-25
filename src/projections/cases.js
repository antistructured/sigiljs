import { generateCases } from '../testing/cases.js';

export function projectCases(description, options = {}) {
  return generateCases(description, options);
}
