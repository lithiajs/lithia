import { LithiaDirectoryScanner } from '@lithiajs/scanner';
import { LITHIA_CONFIG_FILE_REGEX } from './constants';
import { defineConfig } from './define-config';
import { LithiaConfig } from './types';

export class LithiaConfigLoader {
  private static readonly lithiaConfigFileRegex = LITHIA_CONFIG_FILE_REGEX;

  private constructor() {}

  public static load(rootPath: string = process.cwd()): LithiaConfig {
    let config = defineConfig({});

    const scanner = new LithiaDirectoryScanner({
      scanDir: rootPath,
      searchFor: [this.lithiaConfigFileRegex],
      onlyScanRootDir: true,
      async onFile(filePath) {
        config = await import(filePath).then((module) => module.default);
      },
    });

    scanner.scan();
    return config;
  }
}
