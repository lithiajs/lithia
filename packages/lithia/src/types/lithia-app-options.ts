import { RouteMiddleware } from './route-middleware';

export type LithiaAppOptions = {
  name: string;
  port: number;
  middlewares: RouteMiddleware[];
};
