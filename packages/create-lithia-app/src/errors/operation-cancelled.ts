export class OperationCancelledError extends Error {
  constructor() {
    super('Operation cancelled by the user.');
  }
}
