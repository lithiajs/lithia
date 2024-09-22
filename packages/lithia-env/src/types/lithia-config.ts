type LithiaEnv = 'development' | 'production';

export type LithiaConfig = {
  /**
   * Entry file name for Lithia app.
   * Defaults to `app.ts`.
   */
  entryFileName: string;
  /**
   * Environments configuration.
   */
  environments?: {
    [E in LithiaEnv]?: {
      /**
       * `.env` file names for the environment.
       */
      envFileNames: string[];
    };
  };
};
