import { HttpMethods } from '../enums/http-methods';
import { RouteHandler } from './route-handler';
import { RouteMiddleware } from './route-middleware';

export type RouteModule = {
  [K in HttpMethods]: RouteHandler;
} & {
  middlewares?: RouteMiddleware[];
};
