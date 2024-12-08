import { ScanOptions } from './types/scan-options';
import { readdir } from 'fs/promises';

export abstract class Scanner {
  public static async execute(options: ScanOptions) {
    const files = await readdir(options.directory, {
      withFileTypes: true,
      recursive: options.recursive,
    });

    const matchedFiles = files.filter((file) => {
      if (file.isDirectory()) return false;
      return (
        options.searchFor.some((pattern) => pattern.test(file.name)) &&
        !options.exclude?.some((pattern) => pattern.test(file.name)) &&
        !options.ignore?.some((fileName) => fileName === file.name)
      );
    });

    await Promise.all(matchedFiles.map(async (file) => options.onFile?.(file)));
  }
}
