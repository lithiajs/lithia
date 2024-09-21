import fs from 'fs';
import path from 'path';
import { LithiaDirectoryScannerOptions } from './types/lithia-directory-scanner-options';

export class LithiaDirectoryScanner {
  private queue: Promise<void>[] = [];

  constructor(private readonly options: LithiaDirectoryScannerOptions) {}

  scan(): void {
    this.queue = [];

    if (!fs.existsSync(this.options.scanDir)) {
      throw new Error(
        'An error occurred while scanning the directory. The directory does not exist.',
      );
    }

    this.scanDir(this.options.scanDir);
  }

  private scanDir(dir: string): void {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (this.options.ignore?.some((r) => r.test(filePath))) continue;
      if (stat.isDirectory() && !this.options.onlyScanRootDir)
        this.scanDir(filePath);
      else {
        const normalizedFilePath = path
          .normalize(filePath)
          .replaceAll(/\\/g, '/');

        if (this.options.searchFor.some((r) => r.test(normalizedFilePath))) {
          this.queue.push(this.options.onFile(normalizedFilePath));
        }
      }
    }
  }
}
