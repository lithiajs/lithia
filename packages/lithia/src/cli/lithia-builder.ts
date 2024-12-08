import { Logger, Scanner, TypeCheckingError } from '@lithiajs/common';

import { exec } from 'child_process';
import path from 'path';
import { SOURCE_FOLDER } from './constants';
import { Builder } from './interface';

export class LithiaBuilder {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('LithiaBuilder');
  }

  async execute(builder: Builder): Promise<void> {
    const files: string[] = [];

    await Scanner.execute({
      directory: SOURCE_FOLDER,
      searchFor: [/\.ts$/],
      recursive: true,
      onFile(file) {
        files.push(file);
      },
    });
    await this.typeCheck();
    await builder.execute(files);

    this.logger.log("Project's files have been built successfully.");
  }

  private async typeCheck(): Promise<void> {
    if (process.env.LITHIA_CLI_BUILDER_TYPECHECK !== 'true') return;

    const now = Date.now();
    this.logger.log('Type checking files...');

    await new Promise<void>((resolve, reject) => {
      exec(
        `tsc --noEmit --skipLibCheck --pretty --project ${path.resolve(process.cwd(), 'tsconfig.json')}`,
        {
          cwd: process.cwd(),
        },
        (error, stdout) => {
          if (error) {
            reject(new TypeCheckingError(stdout));
          } else {
            resolve();
          }
        },
      );
    });

    this.logger.log(`Type checking completed in ${Date.now() - now}ms.`);
  }
}
