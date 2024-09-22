#!/usr/bin/env node

/**
 * Lithia CLI
 * Command line interface for Lithia
 * Copyright (c) 2024 Lithia
 * https://lithiajs.org
 * MIT License
 */

import { Command } from 'commander';
import { description, name, version } from '../../package.json';
import { buildCmd } from './commands';
import { devCmd } from './commands/dev';

try {
  const program = new Command(name)
    .version(version)
    .description(description)
    .usage('<command> [options]');

  program.addCommand(buildCmd);
  program.addCommand(devCmd);

  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
