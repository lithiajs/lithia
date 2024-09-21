import { LithiaConfigLoader, LithiaEnvLoader } from '@lithiajs/env';
import { Command } from 'commander';
import { SwcBuilder } from '../builders/swc-builder';
import { LithiaAppBuilder } from '../lithia-app-builder';

export const buildCmd = new Command('build')
  .description('Build Lithia app')
  .action(() => {
    try {
      const config = LithiaConfigLoader.load(process.cwd());
      LithiaEnvLoader.load(config);

      const builder = new LithiaAppBuilder(new SwcBuilder());

      builder.build();
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });
