export class HttpException extends Error {
  status: number;
  timestamp: number;
  error?: unknown;

  constructor(status: number, message: string, error?: unknown) {
    super(message);
    this.status = status;
    this.timestamp = Date.now();
    this.error = error;
  }
}
