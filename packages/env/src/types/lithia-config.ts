import { LithiaConfigBuilder } from './lithia-config-builder';

export type LithiaConfig = {
  app?: {
    host?: string;
    port?: number;
  };
  logger?: {
    levels?: Array<'debug' | 'error' | 'log' | 'verbose' | 'warn'>;
    useColors?: boolean;
    useTimestamp?: boolean;
  };
  cli?: {
    builder?: LithiaConfigBuilder;
  };
};
