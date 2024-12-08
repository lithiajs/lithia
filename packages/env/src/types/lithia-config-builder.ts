export type LithiaConfigBuilder =
  | {
      type?: 'tsup';
      bundle?: boolean;
      typeCheck?: boolean;
    }
  | {
      type?: 'tsc';
      typeCheck?: boolean;
    };
