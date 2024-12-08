import { HttpMethod } from '../enums';
import { RouteHandler } from './route-handler';

export type RouteModule = {
  [H in HttpMethod]: RouteHandler;
} & {
  middlewares?: RouteHandler[];
};
