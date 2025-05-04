import { createHooks } from 'hookable';
import type { LithiaConfig } from 'lithia/types';
import { isDebug } from 'std-env';

export const DEFAULT_CONFIG: LithiaConfig = {
  debug: isDebug,
  router: {
    baseDir: 'routes',
    hooks: createHooks(),
  },
  server: {
    port: 3000,
    host: 'localhost',
    hooks: createHooks(),
  },
  security: {
    cors: {
      enabled: false,
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type,Authorization',
      exposedHeaders: 'Content-Type,Authorization',
      maxAge: 600,
      credentials: true,
    },
  },
};
