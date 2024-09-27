import http, { IncomingMessage, ServerResponse } from 'http';
import { isAsyncFunction } from 'util/types';
import { LithiaRequest } from './lithia-request';
import { LithiaResponse } from './lithia-response';
import { LithiaRouter } from './lithia-router';
import { LithiaAppOptions } from './types/lithia-app-options';
import { Logger } from './utils/logger';
export class Lithia {
  private static readonly staticInstanceRef: Lithia;
  readonly server: http.Server;
  private readonly router: LithiaRouter;
  private readonly logger: Logger;
  private readonly options: LithiaAppOptions;

  private constructor(options?: Partial<LithiaAppOptions>) {
    this.router = new LithiaRouter();
    this.logger = new Logger(Lithia.name);
    this.options = {
      name: 'lithia',
      port: 3000,
      middlewares: [],
      ...options,
    };
    this.server = http.createServer(this.handleRequest.bind(this));
  }

  static create(options?: Partial<LithiaAppOptions>): Lithia {
    if (!Lithia.staticInstanceRef) {
      return new Lithia(options);
    }

    return Lithia.staticInstanceRef;
  }

  start(callback?: () => void): void {
    if (this.server.listening) return;

    this.router
      .prepare()
      .then(() => {
        this.server.listen(this.options.port, '0.0.0.0', () => {
          this.logger.info(
            `${this.options.name} server is running on http://localhost:${this.options.port}`,
          );

          callback?.();
        });
      })
      .catch((error) => {
        this.logger.error(error.toString());
      });
  }

  close(callback?: () => void): void {
    if (!this.server.listening) return;

    this.server.close(callback)?.unref();
  }

  private async handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    if (!req.method || !req.url) {
      this.logger.error('Invalid request method or url');
      return;
    }

    const route = this.router.matchRoute(req.method, req.url);
    const request = new LithiaRequest(req, route.params);
    const response = new LithiaResponse(res);

    await new Promise<void>((resolve) => {
      let i = 0;

      async function next() {
        if (response.alreadySent) return resolve();
        if (i >= route.middlewares.length) return resolve();
        const middleware = route.middlewares[i++];
        if (isAsyncFunction(middleware)) {
          await middleware(request, response, next);
        } else {
          middleware(request, response, next);
        }
      }

      next();
    });

    if (response.alreadySent) return;

    try {
      const data = await route.handler(request, response);

      if (!data) return response.status(204).end();
      switch (typeof data) {
        case 'object':
          response.json(data);
          break;
        default:
          response.send(data.toString());
      }
    } catch (error) {
      if (error.name === 'HttpError') {
        response.status(error.code).send(error.message);
        return;
      }

      this.logger.error(error);
      response.status(500).send('Internal server error');
    }
  }
}
