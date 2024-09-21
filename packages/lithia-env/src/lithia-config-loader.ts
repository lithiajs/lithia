import fs from 'fs';
import colors from 'picocolors';
import { LITHIA_CONFIG_FILE_REGEX } from './constants';
import { LithiaConfig } from './types/lithia-config';

export class LithiaConfigLoader {
  private static readonly lithiaConfigFileRegex = LITHIA_CONFIG_FILE_REGEX;

  private constructor() {}

  public static async loadConfig(rootPath: string): Promise<LithiaConfig> {
    const files = fs.readdirSync(rootPath);
    const configFiles = files.filter((file) =>
      this.lithiaConfigFileRegex.test(file),
    );

    if (configFiles.length === 0) {
      throw new Error(
        `No ${colors.green('lithia.config.(json|js|ts)')} file found in root directory.`,
      );
    }

    if (configFiles.length > 1) {
      throw new Error(
        `Multiple ${colors.green(
          'lithia.config.(json|js|ts)',
        )} files found in root directory.`,
      );
    }

    const configFile = configFiles[0];

    console.log(colors.green(`Loading ${configFile}...`));

    const configFilePath = `${rootPath}/${configFile}`;
    const config = await import(configFilePath).then(
      (module) => module.default,
    );

    console.log(colors.green('Config loaded successfully!'));

    return config;
  }
}
