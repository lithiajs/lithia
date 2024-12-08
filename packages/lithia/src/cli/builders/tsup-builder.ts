import { dirname } from 'path';
import { build, type Options } from 'tsup';
import { Builder } from '../interface';
import { getOutputPath } from '../utils';

export class TsupBuilder implements Builder {
  private readonly options: Options;

  constructor() {
    this.options = {
      format: 'cjs',
      minify: true,
      keepNames: true,
      bundle: true,
      silent: true,
      cjsInterop: true,
    };
  }

  async execute(files: string[]): Promise<void> {
    await Promise.all(
      files.map((file) => {
        const outputPath = getOutputPath(file);
        return build({
          ...this.options,
          entry: [file],
          outDir: dirname(outputPath),
        });
      }),
    );
  }
}
