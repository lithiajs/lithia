export type LithiaConfig = {
  logger?: {
    levels?: Array<'debug' | 'error' | 'log' | 'verbose' | 'warn'>;
    useColors?: boolean;
    useTimestamp?: boolean;
  };
};
