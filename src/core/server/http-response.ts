import { OutgoingHttpHeader, OutgoingHttpHeaders, ServerResponse } from 'http';
import { Lithia, LithiaResponse } from 'lithia/types';
import { InvalidStatusCodeError, ResponseAlreadySentError } from './_errors';

export class LithiaHttpResponse implements LithiaResponse {
  isEnded: boolean;

  constructor(
    private readonly res: ServerResponse,
    private readonly lithia: Lithia,
  ) {
    this.isEnded = false;
  }

  get statusCode(): number {
    return this.res.statusCode;
  }

  headers(): Readonly<OutgoingHttpHeaders> {
    return this.res.getHeaders();
  }

  status(code: number): this {
    if (this.isEnded) throw new ResponseAlreadySentError();
    if (code < 100 || code > 599) throw new InvalidStatusCodeError(code);
    this.res.statusCode = code;
    return this;
  }

  addHeader(key: string, value: OutgoingHttpHeader): this {
    this.res.setHeader(key, value);
    return this;
  }

  removeHeader(key: string): this {
    this.res.removeHeader(key);
    return this;
  }

  send<T = any>(data: T): void {}

  end(chunk?: string | Buffer): void {
    if (this.isEnded) throw new ResponseAlreadySentError();
    this.isEnded = true;
    this.res.end(chunk);
  }

  json<T extends object>(data: T): void {
    this.res.setHeader('Content-Type', 'application/json');
    this.res.setHeader('Content-Length', Buffer.byteLength(JSON.stringify(data)));
    this.res.write(JSON.stringify(data));
    this.res.end();
  }

  on(event: string, callback: (data: any) => void): void {
    this.res.on(event, callback);
  }
}
