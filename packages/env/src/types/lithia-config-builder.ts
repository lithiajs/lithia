export type LithiaConfigBuilder =
  | {
      type?: 'tsup';
      bundle?: boolean;
    }
  | {
      type?: 'tsc';
    };
