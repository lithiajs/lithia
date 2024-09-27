import { LithiaDirectoryScanner } from '@lithiajs/scanner';
import { execSync } from 'child_process';
import moment from 'moment';
import path from 'path';
import picocolors from 'picocolors';
import ts from 'typescript';
import { Logger } from '../utils/logger';
import { Builder } from './interfaces/builder';

export class LithiaAppBuilder {
  private readonly files = Array.from<string>([]);
  private readonly logger = new Logger({
    context: LithiaAppBuilder.name,
  });

  constructor(private readonly builder: Builder) {}

  build(options?: { exitOnError?: boolean }) {
    try {
      this.typeCheck();
      this.transpile();
    } catch {
      if (options?.exitOnError) {
        process.exit(1);
      }
    }
  }

  private transpile() {
    this.logger.info('Building Lithia app...');

    const scanner = new LithiaDirectoryScanner({
      scanDir: path.resolve(process.cwd(), 'src'),
      searchFor: [/\.ts$/],
      ignore: [/\.spec\.ts$/, /\.test\.ts$/, /\.d\.ts$/],
      onFile: (filePath: string) => {
        this.files.push(filePath);
      },
    });

    scanner.scan();
    const compiledFiles = this.builder.build(this.files);

    for (const file of compiledFiles) {
      this.logger.info(
        `✓ ${file.path} ${picocolors.gray(`(${file.timeout}ms)`)}`,
      );
    }

    this.files.length = 0;
    this.logger.info('Lithia app built successfully!');
  }

  private typeCheck() {
    this.logger.info('Type checking Lithia app...');

    const configFilePath = ts.findConfigFile(
      process.cwd(),
      ts.sys.fileExists,
      'tsconfig.json',
    );
    const now = moment.now();
    const tscArgs = ['--pretty', '--noEmit', '-p', configFilePath];

    execSync(`tsc ${tscArgs.join(' ')}`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    const duration = moment.now() - now;
    this.logger.info(`Type check completed in ${duration}ms`);
  }
}
