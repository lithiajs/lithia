import { OutgoingHttpHeaders, ServerResponse } from 'http';
import { HttpCodes } from './enums/http-codes';
import { Response } from './interfaces';

export class LithiaResponse implements Response {
  private sent: boolean;

  get alreadySent(): boolean {
    return this.sent;
  }

  get headers(): OutgoingHttpHeaders {
    return this.response.getHeaders();
  }

  get statusCode() {
    return this.response.statusCode;
  }

  get statusMessage() {
    return this.response.statusMessage;
  }

  constructor(private readonly response: ServerResponse) {
    this.sent = false;
  }

  status(code: number): this {
    this.response.statusCode = code;
    Object.entries(HttpCodes).forEach(([key, value]) => {
      if (value === code) {
        this.response.statusMessage = key;
      }
    });
    return this;
  }

  writeHead(
    code: number,
    headers: Record<keyof OutgoingHttpHeaders, string>,
  ): this {
    this.response.writeHead(code, headers);
    return this;
  }

  write(chunk: string | Buffer | Uint8Array): this {
    this.response.write(chunk);
    return this;
  }

  setHeader(name: string, value: string): this {
    this.response.setHeader(name, value);
    return this;
  }

  json(body: unknown): void {
    this.setHeader('Content-Type', 'application/json');
    this.send(JSON.stringify(body));
  }

  send(body: string | Buffer | Uint8Array): void {
    this.write(body);
    this.end();
  }

  end(chunk?: unknown): void {
    this.response.end(chunk);
    this.sent = true;
  }

  hasHeader(name: string): boolean {
    return this.response.hasHeader(name);
  }

  getHeader(name: string): string | number | undefined {
    return this.response.getHeader(name) as string | number | undefined;
  }

  removeHeader(name: string): void {
    this.response.removeHeader(name);
  }
}
