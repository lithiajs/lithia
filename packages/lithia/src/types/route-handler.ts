export type RouteHandler = (
  request: Request,
  response: Response,
) => Promise<void | unknown>;
