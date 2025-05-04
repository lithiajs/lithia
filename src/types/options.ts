import type { C12InputConfig, ConfigWatcher, ResolvedConfig, WatchConfigOptions } from 'c12';
import type { DeepPartial } from './_utils';
import type { RouterHooks, ServerHooks } from './hooks';

export interface LithiaOptions {
  _c12: ResolvedConfig<LithiaConfig> | ConfigWatcher<LithiaConfig>;
  _cli: {
    command: string;
  };
  _config: LithiaConfig;
  _env: 'dev' | 'prod';

  debug: boolean;

  router: {
    baseDir: string;
    hooks: RouterHooks;
  };

  server: {
    port: number;
    host: string;
    hooks: ServerHooks;
  };

  security: {
    cors: {
      enabled: boolean;
      origin: string | string[];
      methods: string | string[];
      allowedHeaders: string | string[];
      exposedHeaders: string | string[];
      maxAge: number;
      credentials: boolean;
    };
  };
}

export interface LithiaConfig extends DeepPartial<LithiaOptions>, C12InputConfig<LithiaConfig> {}

export interface LoadConfigOptions {
  watch?: boolean;
  c12?: WatchConfigOptions;
}
