import { readFileSync, writeFileSync } from 'fs';

import { Step } from '../interfaces/step';
import { StepContext } from '../step-context';
import { resolve } from 'path';

export class ChangeProjectInfoStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    const projectName = ctx.get<string>('projectName');
    const projectDirectory = ctx.get<string>('directory');
    const packageJsonPath = resolve(
      projectDirectory,
      projectName,
      'package.json',
    );
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    packageJson.name = projectName;
    packageJson.description = `A Lithia app named ${projectName}`;
    packageJson.version = '0.1.0';

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}
