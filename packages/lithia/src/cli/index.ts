#!/usr/bin/env node

import { description, name, version } from '../../package.json';

import { Command } from 'commander';
import { buildCommand } from './commands';

new Command(name)
  .description(description)
  .version(version)
  .usage('<command> [options]')
  .addCommand(buildCommand)
  .helpCommand(true)
  .parseAsync(process.argv);
