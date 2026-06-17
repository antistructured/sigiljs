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
export class SigilValidationError extends Error {
  /**
   * @param {string}   message  - Human-readable description of the failure
   * @param {string[]} path     - Property path to the failure (e.g. ["user", "age"])
   * @param {string}   expected - Type that was expected
   * @param {string}   actual   - Type that was actually received
   */
  constructor(message, path, expected, actual) {
    super(message);
    this.name = 'SigilValidationError';
    this.code = 'SIGIL_VALIDATION_FAILED';
    this.path = path;
    this.expected = expected;
    this.actual = actual;

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
