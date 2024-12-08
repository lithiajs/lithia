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
};
