import { OutgoingHttpHeaders } from 'http';

export interface Response {
  alreadySent: boolean;
  headers: OutgoingHttpHeaders;
  statusCode: number;
  statusMessage: string;
  status(code: number): this;
  writeHead(
    code: number,
    headers: Record<keyof OutgoingHttpHeaders, string>,
  ): this;
  write(chunk: string | Buffer): this;
  setHeader(name: string, value: string): this;
  json(body: unknown): void;
  send(body: unknown): void;
  end(chunk?: unknown): void;
  hasHeader(name: string): boolean;
  getHeader(name: string): string | number | undefined;
  removeHeader(name: string): void;
}
