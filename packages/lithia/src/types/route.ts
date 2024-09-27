import { HttpMethods } from '../enums/http-methods';
import { RouteHandler } from './route-handler';
import { RouteMiddleware } from './route-middleware';

export type Route = {
  pathname: string;
  regex: string;
  method: keyof typeof HttpMethods;
  params: Record<string, string>;
  namedRegex: string;
  middlewares: RouteMiddleware[];
  handler: RouteHandler;
};
