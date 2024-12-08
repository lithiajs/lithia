import { Logger, Scanner, spinAndAwait } from '@lithiajs/common';

import { SOURCE_FOLDER } from './constants';
import { Builder } from './interface';

export class LithiaBuilder {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('LithiaBuilder');
  }

  async execute(builder: Builder): Promise<void> {
    const files: string[] = [];

    await spinAndAwait(
      Scanner.execute({
        directory: SOURCE_FOLDER,
        searchFor: [/\.ts$/],
        recursive: true,
        onFile(file) {
          files.push(file);
        },
      }),
      'Scanning project files...',
    );

    await spinAndAwait(builder.execute(files), 'Building project files...');

    this.logger.log("Project's files have been built successfully.");
  }
}
