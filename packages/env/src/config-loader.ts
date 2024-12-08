import {
  Logger,
  NoConfigurationFileFoundError,
  Scanner,
} from '@lithiajs/common';

import { Dirent } from 'fs';
import { LithiaConfig } from './types';
import { resolve } from 'path';

export class ConfigLoader {
  private readonly logger = new Logger(ConfigLoader.name);
  private readonly files: RegExp[] = [/\.lithia\.config\.ts$/];
  private readonly defaultConfig: LithiaConfig = {
    logger: {
      levels: ['debug', 'error', 'log', 'verbose', 'warn'],
      useTimestamp: false,
      useColors: true,
    },
  };

  async execute(): Promise<LithiaConfig> {
    const configFiles: Dirent[] = [];

    await Scanner.execute({
      directory: process.cwd(),
      searchFor: this.files,
      onFile(file) {
        configFiles.push(file);
      },
    });

    if (configFiles.length === 0) {
      throw new NoConfigurationFileFoundError();
    }

    if (configFiles.length > 1) {
      this.logger.warn(
        'More than one configuration file found. Using the first one.',
      );
    }

    const configFile = configFiles[0];
    const config = await import(resolve(process.cwd(), configFile.name)).then(
      (module) => module.default,
    );

    return this.mergeConfigs([this.defaultConfig, config]);
  }

  private mergeConfigs(configs: LithiaConfig[]): LithiaConfig {
    return configs.reduce((acc, config) => {
      return {
        ...acc,
        ...config,
      };
    }, {});
  }
}
