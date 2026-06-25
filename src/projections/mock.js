import { generateValid } from '../testing/generate.js';

export function projectMock(description, options = {}) {
  return generateValid(description, options);
}
