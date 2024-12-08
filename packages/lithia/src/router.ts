import { Logger, NotFoundException, Scanner } from '@lithiajs/common';

import { HttpMethod } from './enums';
import { Route } from './types/route';
import { RouteHandler } from './types/route-handler';
import { RouteModule } from './types/route-module';
import { resolve } from 'path';

export class LithiaRouter {
  private readonly routesFolder: string;
  private readonly logger: Logger;
  private readonly routes: Route[];

  constructor() {
    this.routesFolder = process.env.LITHIA_ROUTES_FOLDER || 'routes';
    this.logger = new Logger(LithiaRouter.name);
    this.routes = [];
  }

  async init(): Promise<void> {
    const routeFiles = await this.scanRoutes();
    await Promise.all(routeFiles.map((routeFile) => this.loadRoute(routeFile)));
    for (const route of this.routes) {
      this.logger.log(
        `Route ${route.method.toUpperCase()} ${route.pathname} loaded`,
      );
    }
  }

  matchRoute(
    method: string,
    pathname: string,
  ): Readonly<{
    handler: RouteHandler;
    middlewares: RouteHandler[];
    params: Readonly<Record<string, string>>;
  }> {
    const matchingRoute = this.routes.find(
      (route) =>
        route.method === method && new RegExp(route.regex).test(pathname),
    );

    if (!matchingRoute)
      throw new NotFoundException(
        `No matching route found for ${method} ${pathname}`,
      );

    const params =
      pathname.match(new RegExp(matchingRoute.regex))?.slice(1) || [];

    return {
      handler: matchingRoute.handler,
      middlewares: matchingRoute.middlewares,
      params: Object.fromEntries(
        Object.entries(matchingRoute.params).map(([key], index) => [
          key,
          params[index],
        ]),
      ),
    };
  }

  private async loadRoute(routeFile: string): Promise<void> {
    const module: RouteModule = await import(routeFile);
    this.extractHandlerNames(module).forEach((method) => {
      const route = this.buildRoute(routeFile, method);
      this.routes.push({
        ...route,
        middlewares: module.middlewares || [],
        handler: module[method],
      });
    });
  }

  private async scanRoutes(): Promise<string[]> {
    const routeFiles: string[] = [];

    await Scanner.execute({
      directory: resolve(process.cwd(), this.routesFolder),
      recursive: true,
      searchFor: [/\.js$/],
      onFile(file) {
        delete require.cache[require.resolve(file.parentPath)];
        routeFiles.push(file.parentPath);
      },
    });

    return routeFiles;
  }

  private extractHandlerNames(routeModule: RouteModule): HttpMethod[] {
    return Object.keys(routeModule).filter((key) =>
      Object.values(HttpMethod).includes(key as HttpMethod),
    ) as HttpMethod[];
  }

  private buildRoute(
    routeFilePath: string,
    method: HttpMethod,
  ): Omit<Route, 'middlewares' | 'handler'> {
    const relativePath = routeFilePath.split(
      new RegExp(`${this.routesFolder}/`),
    )[1];
    const pathname =
      '/' +
      relativePath
        .replace(/\.js$/, '')
        .replace(/index$/, '')
        .replace(/\[([^\]]+)]/g, ':$1')
        .replaceAll(/\\/g, '/')
        .replace(/\/$/, '');
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
      pathname,
      params,
      namedRegex,
      regex: regex.source,
    };
  }
}
