export class ResponseAlreadySentError extends Error {
  constructor() {
    super('Response has already been sent. Cannot modify headers or status.');
    this.name = 'ResponseAlreadySentError';
  }
}

export class InvalidStatusCodeError extends Error {
  constructor(status: number) {
    super(`Invalid HTTP status code: ${status}. Must be 100-599`);
    this.name = 'InvalidStatusCodeError';
  }
}
