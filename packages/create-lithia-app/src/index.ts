#!/usr/bin/env node

import {
  AskIDEStep,
  AskInitGitRepositoryStep,
  AskInstallDepsStep,
  AskOpenInIDEStep,
  AskPackageManagerStep,
  AskProjectNameStep,
  AskProjectTemplateStep,
  ChangeProjectInfoStep,
  CheckFolderAvailabilityStep,
  CloneSelectedTemplateStep,
  InitializeGitRepositoryStep,
  InstallDependenciesStep,
  OpenInSelectedIDEStep,
  ParseProjectDirectoryStep,
} from './steps';
import { description, name, version } from '../package.json';

import { Command } from 'commander';
import { OperationCancelledError } from './errors';
import { ProjectTemplate } from './types';
import { ShowSuccessMessageStep } from './steps/show-success-message';
import { StepRunner } from './step-runner';

const templates: ProjectTemplate[] = [
  {
    name: 'default',
    branch: 'main',
    url: 'https://github.com/lithiajs/lithia-default-app-template',
    description: 'Default Lithia app template',
  },
];

async function createLithiaApp(projectName?: string) {
  const runner = new StepRunner([
    new AskProjectNameStep(),
    new AskProjectTemplateStep(),
    new AskInstallDepsStep(),
    new AskPackageManagerStep(),
    new AskInitGitRepositoryStep(),
    new AskOpenInIDEStep(),
    new AskIDEStep(),
    new ParseProjectDirectoryStep(),
    new CheckFolderAvailabilityStep(),
    new CloneSelectedTemplateStep(),
    new ChangeProjectInfoStep(),
    new InstallDependenciesStep(),
    new InitializeGitRepositoryStep(),
    new OpenInSelectedIDEStep(),
    new ShowSuccessMessageStep(),
  ]);

  runner.set('defaultProjectName', 'my-lithia-app');
  runner.set('projectName', projectName);
  runner.set('templates', templates);

  try {
    await runner.run();
  } catch (error) {
    if (error instanceof OperationCancelledError) return;
    console.error(`\n${error.message}`);
  }
}

new Command(name)
  .description(description)
  .version(version)
  .arguments('[projectName]')
  .action(createLithiaApp)
  .parseAsync(process.argv);
