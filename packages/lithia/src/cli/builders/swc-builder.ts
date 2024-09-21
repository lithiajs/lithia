import { Config, transformFileSync } from '@swc/core';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { outputFilePath } from '../../utils/output-file-path';
import { Builder } from '../interfaces/builder';
import { CompiledFile } from '../types/compiled-file';

export class SwcBuilder implements Builder {
  private readonly config: Config = {
    jsc: {
      baseUrl: process.cwd(),
      parser: {
        syntax: 'typescript',
      },
      paths: this.extractPathsFromTsConfig(),
      target: 'esnext',
      keepClassNames: true,
    },
    module: {
      type: 'commonjs',
      strict: true,
      strictMode: true,
    },
    sourceMaps: true,
  };

  build(files: string[]): CompiledFile[] {
    const compiledFiles: CompiledFile[] = [];

    for (const file of files) {
      const now = moment.now();
      const { code } = transformFileSync(file, this.config);
      const outputPath = outputFilePath(file);
      const relativePath = path.relative(process.cwd(), outputPath);

      if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      }

      fs.writeFileSync(outputPath, code);

      compiledFiles.push({
        path: relativePath,
        timeout: moment.now() - now,
      });
    }

    return compiledFiles;
  }

  private extractPathsFromTsConfig(): Record<string, string[]> {
    const tsConfigPath = path.resolve(process.cwd(), 'tsconfig.json');

    if (!fs.existsSync(tsConfigPath)) {
      return {};
    }

    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));

    if (!tsConfig.compilerOptions?.paths) {
      return {};
    }

    return tsConfig.compilerOptions.paths;
  }
}
