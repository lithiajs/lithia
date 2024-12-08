import {
  Logger,
  NoConfigurationFileFoundError,
  Scanner,
} from '@lithiajs/common';

import { Dirent } from 'fs';
import { resolve } from 'path';
import { convertObjectToEnvVariables } from './convert-object-to-env-variables';
import { LithiaConfig } from './types';

export class ConfigLoader {
  private readonly logger: Logger;
  private readonly files: RegExp[];
  private readonly defaultConfig: LithiaConfig;

  constructor() {
    this.logger = new Logger(ConfigLoader.name);
    this.files = [/^lithia\.config\.js$/];
    this.defaultConfig = {
      app: {
        host: '0.0.0.0',
        port: 3000,
      },
      logger: {
        levels: ['debug', 'error', 'log', 'verbose', 'warn'],
        useTimestamp: false,
        useColors: true,
      },
    };
  }

  async execute(): Promise<void> {
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
        `More than one configuration file found. Using the first one: ${configFiles[0].name}`,
      );
    }

    const config = await import(resolve(process.cwd(), configFiles[0].name));

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

  private mergeConfigs(configs: any[]): LithiaConfig {
    if (!configs || configs.length === 0) {
      return this.defaultConfig;
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
