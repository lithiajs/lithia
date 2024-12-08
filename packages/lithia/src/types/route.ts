import { HttpMethod } from '../enums';
import { RouteHandler } from './route-handler';

export type Route = {
  pathname: string;
  regex: string;
  method: HttpMethod;
  params: Record<string, string>;
  namedRegex: string;
  middlewares: RouteHandler[];
  handler: RouteHandler;
};
