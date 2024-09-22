import { LithiaConfigLoader, LithiaEnvLoader } from '@lithiajs/env';
import { Command } from 'commander';

export const devCmd = new Command('dev')
  .description('Start Lithia app in development mode')
  .action(() => {
    try {
      const config = LithiaConfigLoader.load();
      LithiaEnvLoader.load(config);
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });
