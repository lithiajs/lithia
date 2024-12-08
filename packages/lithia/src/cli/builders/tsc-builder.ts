import { Logger } from '@lithiajs/common';
import { resolve } from 'path';
import ts from 'typescript';
import { DIST_FOLDER } from '../constants';
import { Builder } from '../interface';

export class TscBuilder implements Builder {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('TscBuilder');
  }

  async execute(files: string[]): Promise<void> {
    const now = Date.now();

    const { config } = ts.readConfigFile(
      resolve(process.cwd(), 'tsconfig.json'),
      ts.sys.readFile,
    );

    const program = ts.createProgram(files, {
      ...config,
      outDir: DIST_FOLDER,
    });

    program.emit();

    this.logger.log(`Built in ${Date.now() - now}ms`);
  }
}
