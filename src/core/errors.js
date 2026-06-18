/**
 * Thrown by `assert()` when a value fails validation.
 *
 * Shape:
 *   {
 *     code:     "SIGIL_VALIDATION_FAILED",  // always — machine-readable
 *     message:  "Expected property \"age\" to be number, got string",
 *     path:     ["user", "age"],             // key path to the failing field
 *     expected: "number",                    // type that was required
 *     actual:   "string"                     // type that was received
 *   }
 */
export function createValidationError(details) {
  return {
    code: 'SIGIL_VALIDATION_FAILED',
    message: details.message,
    path: details.path || [],
    expected: details.expected,
    actual: details.actual,
  };
}

export class SigilValidationError extends Error {
  /**
   * @param {object|string} details - Validation details, or legacy message
   * @param {string[]} [path]       - Legacy property path
   * @param {string}   [expected]   - Legacy expected type
   * @param {string}   [actual]     - Legacy actual type
   */
  constructor(details, path, expected, actual) {
    const error =
      typeof details === 'object' ?
        createValidationError(details)
      : createValidationError({ message: details, path, expected, actual });

    super(error.message);
    this.name = 'SigilValidationError';
    this.code = error.code;
    this.path = error.path;
    this.expected = error.expected;
    this.actual = error.actual;

    // Omit the constructor frame from V8/Bun stack traces
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SigilValidationError);
    }
  }

  /**
   * Returns the canonical JSON shape for structured logging / API responses.
   *
   * @returns {{ code: string, message: string, path: string[], expected: string, actual: string }}
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      expected: this.expected,
      actual: this.actual,
    };
  }

  /** Consistent devtools / console.log labeling */
  get [Symbol.toStringTag]() {
    return 'SigilValidationError';
  }
}
