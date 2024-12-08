import {
  TypeCheckingError,
  UndefinedBuilderTypeError,
  UnknownBuilderTypeError,
} from '@lithiajs/common';

import { ConfigLoader } from '@lithiajs/env';
import { Command } from 'commander';
import { TsupBuilder } from '../builders';
import { TscBuilder } from '../builders/tsc-builder';
import { Builder } from '../interface';
import { LithiaBuilder } from '../lithia-builder';

async function build() {
  try {
    await ConfigLoader.execute();

    const type: string | undefined = process.env.LITHIA_CLI_BUILDER_TYPE;

    if (!type) throw new UndefinedBuilderTypeError();

    const builders: {
      [key: string]: Builder;
    } = {
      tsc: new TscBuilder(),
      tsup: new TsupBuilder(),
    };

    if (!builders[type]) throw new UnknownBuilderTypeError(type);

    const builder = new LithiaBuilder();
    await builder.execute(builders[type]);
  } catch (error) {
    if (error instanceof TypeCheckingError) return console.error(error.stack);

    console.error(error.message);
  }
}

export const buildCommand = new Command('build')
  .description('Build Lithia.js application.')
  .action(build);
