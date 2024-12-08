import {
  Logger,
  NoConfigurationFileFoundError,
  Scanner,
} from '@lithiajs/common';

import { basename } from 'path';
import { convertObjectToEnvVariables } from './convert-object-to-env-variables';
import { LithiaConfig } from './types';

export abstract class ConfigLoader {
  private static logger: Logger = new Logger('ConfigLoader');
  private static files: RegExp[] = [/^lithia\.config\.js$/];
  private static defaultConfig: LithiaConfig = {
    app: {
      host: '0.0.0.0',
      port: 3000,
    },
    logger: {
      levels: ['debug', 'error', 'log', 'verbose', 'warn'],
      useTimestamp: false,
      useColors: true,
    },
    cli: {
      builder: {
        type: 'tsup',
        bundle: true,
      },
    },
  };

  static async execute(): Promise<void> {
    const configFiles: string[] = [];

    await Scanner.execute({
      directory: process.cwd(),
      searchFor: this.files,
      onFile(file: string) {
        configFiles.push(file);
      },
    });

    if (configFiles.length === 0) {
      throw new NoConfigurationFileFoundError();
    }

    const fileName = basename(configFiles[0]);

    if (configFiles.length > 1) {
      this.logger.warn(
        `More than one configuration file found. Using the first one: ${fileName}`,
      );
    }

    const config = await import(configFiles[0]);

    const variables = convertObjectToEnvVariables(
      this.mergeConfigs([
        this.defaultConfig,
        config,
        {
          routes: {
            folder: 'routes',
          },
        },
      ]),
    );

    Object.keys(variables).forEach((key) => {
      process.env[key] = variables[key];
    });
  }

  private static mergeConfigs(configs: any[]): LithiaConfig {
    if (!configs || configs.length === 0) {
      return ConfigLoader.defaultConfig;
    }

    if (configs.length === 1) {
      return configs[0];
    }

    return configs?.reduce((merged, current) => {
      Object.keys(current).forEach((key) => {
        if (
          typeof current[key] === 'object' &&
          !Array.isArray(current[key]) &&
          current[key]
        ) {
          merged[key] = this.mergeConfigs([merged[key] || {}, current[key]]);
        } else {
          merged[key] = current[key];
        }
      });
      return merged;
    }, {});
  }
}
