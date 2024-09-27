import { LITHIA_ROUTES_FOLDER } from '@lithiajs/env';
import { LithiaDirectoryScanner } from '@lithiajs/scanner';
import path from 'path';
import { HttpMethods } from './enums/http-methods';
import { Route, RouteHandler, RouteMiddleware, RouteModule } from './types';
import { Logger } from './utils/logger';

export class LithiaRouter {
  private readonly logger: Logger;
  private readonly routes: Route[];

  constructor() {
    this.logger = new Logger(LithiaRouter.name);
    this.routes = [];
  }

  matchRoute(
    method: string,
    pathname: string,
  ): Readonly<{
    handler: RouteHandler;
    middlewares: RouteMiddleware[];
    params: Readonly<Record<string, string>>;
  }> {
    const route = this.routes.find(
      (route) =>
        route.method === method && new RegExp(route.regex).test(pathname),
    );

    if (!route)
      throw new Error(`Route ${method.toUpperCase()} ${pathname} not found`);

    return {
      handler: route.handler,
      middlewares: route.middlewares,
      params: this.extractParams(route, pathname),
    };
  }

  async prepare(): Promise<void> {
    const routeFiles = this.scanRoutes();

    const promises = routeFiles.map(async (filePath) => {
      const routeModule: RouteModule = await import(
        path.resolve(process.cwd(), filePath)
      );
      const exportedHandlers = this.extractHandlerNames(routeModule);
      exportedHandlers.forEach((method) => {
        this.routes.push(this.createRoute(filePath, method, routeModule));
      });
    });

    await Promise.all(promises);
  }

  private scanRoutes(): string[] {
    const routeFiles: string[] = [];

    const scanner = new LithiaDirectoryScanner({
      scanDir: LITHIA_ROUTES_FOLDER,
      searchFor: [/\/*.js$/],
      ignore: [/\/*.spec.js$/, /\/*.test.js$/],
      onFile(filePath: string) {
        delete require.cache[filePath];
        routeFiles.push(filePath);
      },
    });

    scanner.scan();

    return routeFiles;
  }

  private extractHandlerNames(routeModule: RouteModule): HttpMethods[] {
    return Object.keys(routeModule).filter((key) =>
      Object.values(HttpMethods).includes(key as HttpMethods),
    ) as HttpMethods[];
  }

  private createRoute(
    routeFilePath: string,
    method: HttpMethods,
    routeModule: RouteModule,
  ): Route {
    const relativePath = routeFilePath.split(
      new RegExp(`${LITHIA_ROUTES_FOLDER}/`),
    )[1];
    const pathname = `/${relativePath
      .replace(/\.js$/, '')
      .replace(/index$/, '')
      .replace(/\[([^\]]+)]/g, ':$1')
      .replace(/\\/g, '/')
      .replace(/\/$/, '')}`;
    const params: Record<string, string> = {};
    const namedRegex = pathname.replace(/:(\w+)/g, (_, key) => {
      params[key] = key;
      return `:${key}`;
    });
    const regex = new RegExp(
      `^${namedRegex.replace(/\//g, '\\/').replace(/:\w+/g, '([^\\/]+)')}$`,
    );

    return {
      method,
      namedRegex,
      params,
      pathname,
      regex: regex.source,
      middlewares: routeModule.middlewares || [],
      handler: routeModule[method],
    };
  }
  private extractParams(
    route: Route,
    pathname: string,
  ): Readonly<Record<string, string>> {
    const params: Record<string, string> = {};
    const matches = pathname.match(new RegExp(route.regex));

    if (!matches) return params;

    const [, ...values] = matches;

    Object.keys(route.params).forEach((key, index) => {
      params[key] = values[index];
    });

    return params;
  }
}
