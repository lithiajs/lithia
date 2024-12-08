import { Command } from 'commander';

async function build() {}

export const buildCommand = new Command('build')
  .description('Build Lithia.js application.')
  .action(build);
