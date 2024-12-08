export class InvalidConfigurationType extends Error {
  constructor(property: string, expectedType: string, actualType: string) {
    super(
      `Invalid configuration type for property "${property}". Expected "${expectedType}" but received "${actualType}".`,
    );
  }
}
