import { Request, Response } from '../interfaces';

export type RouteHandler = (
  req: Request,
  res: Response,
) => Promise<void | unknown> | void | unknown;
