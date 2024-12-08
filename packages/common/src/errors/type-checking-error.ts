export class TypeCheckingError extends Error {
  constructor(stack?: string) {
    super('Type checking failed. Please check the logs for more information.');
    this.stack = stack;
  }
}
