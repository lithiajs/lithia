import { IncomingHttpHeaders } from 'http';
import { UrlWithParsedQuery } from 'url';
import { HttpMethods } from '../enums/http-methods';
import { RequestStore } from '../request-store';

export interface Request {
  method: keyof typeof HttpMethods;
  url: UrlWithParsedQuery;
  headers: IncomingHttpHeaders;
  params: Record<string, string>;
  query: Record<string, string>;
  store: RequestStore;

  body<T>(): Promise<Readonly<T>>;
}
