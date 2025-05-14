import type { IncomingHttpHeaders, OutgoingHttpHeader, OutgoingHttpHeaders } from 'http';
import type { Possible } from './_utils';
import type { RouteMetadata } from './route';

export interface LithiaRequest {
  id: string;
  pathname: Readonly<string>;
  method: Readonly<string>;
  headers: Readonly<IncomingHttpHeaders>;
  query: Readonly<Record<string, string>>;
  params: Readonly<Record<string, string>>;
  ip: Readonly<string>;
  body<T = any>(): Promise<Readonly<T>>;
  get<T = any>(key: string): Possible<T>;
  set(key: string, value: any): void;
  on(event: string, callback: (data: any) => void): void;
}

export interface LithiaResponse {
  statusCode: Readonly<number>;
  isEnded: boolean;
  headers(): Readonly<OutgoingHttpHeaders>;
  status(code: number): this;
  addHeader(key: string, value: OutgoingHttpHeader): this;
  removeHeader(key: string): this;
  on(event: string, callback: (data: any) => void): void;
}

export type LithiaHandler = (request: LithiaRequest, response: LithiaResponse) => void | Promise<void>;

export type LithiaMiddleware = (
  request: LithiaRequest,
  response: LithiaResponse,
  next: () => void,
) => void | Promise<void>;

export type LithiaErrorHandler = (
  error: Error,
  request: LithiaRequest,
  response: LithiaResponse,
) => void | Promise<void>;

export type RouteModule = {
  default?: LithiaHandler;
  middlewares?: LithiaMiddleware[];
  errorHandler?: LithiaErrorHandler;
  metadata?: RouteMetadata;
};
