import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { parse, UrlWithParsedQuery } from 'url';
import { HttpMethods } from './enums/http-methods';
import { Request } from './interfaces';
import { RequestStore } from './request-store';

export class LithiaRequest implements Request {
  readonly method:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'OPTIONS'
    | 'HEAD'
    | 'CONNECT'
    | 'TRACE'
    | 'ALL';
  readonly url: UrlWithParsedQuery;
  readonly headers: IncomingHttpHeaders;
  readonly params: Record<string, string>;
  readonly query: Record<string, string>;
  readonly store: RequestStore;

  constructor(
    private readonly request: IncomingMessage,
    params: Record<string, string>,
  ) {
    this.headers = request.headers;
    this.method = request.method?.toUpperCase() as keyof typeof HttpMethods;
    this.url = parse(request.url ?? '', true);
    this.query = Object.fromEntries(
      new URLSearchParams(this.url.search ?? '').entries(),
    );
    this.params = params;
    this.store = new RequestStore();
  }

  async body<T>(): Promise<Readonly<T>> {
    return new Promise((resolve) => {
      let data = '';
      this.request.on('data', (chunk) => {
        data += chunk;
      });
      this.request.on('end', () => {
        switch (this.headers['content-type']) {
          case 'application/json':
            resolve(JSON.parse(data));
            break;
          default:
            resolve(data as unknown as T);
            break;
        }
      });
    });
  }
}
