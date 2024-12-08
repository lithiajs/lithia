#!/usr/bin/env node

import { description, name, version } from '../../package.json';

import { Command } from 'commander';

async function cli() {
  const program = new Command(name)
    .description(description)
    .version(version)
    .usage('<command> [options]');

  await program.parseAsync(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

cli().then();
