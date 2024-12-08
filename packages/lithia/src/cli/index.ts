#!/usr/bin/env node

import { description, name, version } from '../../package.json';

import { ConfigLoader } from '@lithiajs/env';
import { Command } from 'commander';
import { buildCommand } from './commands/build';

async function cli() {
  try {
    await new ConfigLoader().execute();

    console.log(process.env);

    const program = new Command(name)
      .description(description)
      .version(version)
      .usage('<command> [options]')
      .addCommand(buildCommand);

    await program.parseAsync(process.argv);

    if (!process.argv.slice(2).length) program.outputHelp();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

cli().then();
