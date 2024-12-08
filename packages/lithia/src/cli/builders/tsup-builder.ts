import { Logger } from '@lithiajs/common';
import { build, type Options } from 'tsup';
import { DIST_FOLDER } from '../constants';
import { Builder } from '../interface';

export class TsupBuilder implements Builder {
  private readonly logger: Logger;
  private readonly options: Options;

  constructor() {
    this.logger = new Logger('TsupBuilder');
    this.options = {
      format: 'cjs',
      minify: true,
      keepNames: true,
      bundle: process.env.LITHIA_CLI_BUILDER_BUNDLE === 'true',
      silent: true,
      cjsInterop: true,
    };
  }

  async execute(files: string[]): Promise<void> {
    const now = Date.now();

    await build({
      ...this.options,
      entry: files,
      outDir: DIST_FOLDER,
    });

    this.logger.log(`Built in ${Date.now() - now}ms`);
  }
}
