import { Request, Response } from '../interfaces';

export type RouteMiddleware = (
  req: Request,
  res: Response,
  next: (...args: unknown[]) => void,
) => Promise<void> | void;
