import { ProjectTemplate } from '../types';
import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { exec } from 'child_process';
import { resolve } from 'path';
import { rmSync } from 'fs';
import { spinAndAwait } from '../utils';

export class CloneSelectedTemplateStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    const template = ctx.get<ProjectTemplate>('template');
    const directory = resolve(ctx.get('directory'), ctx.get('projectName'));

    await spinAndAwait(
      new Promise<void>((resolve, reject) => {
        exec(
          `git clone --branch ${template.branch} ${template.url} ${directory}`,
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          },
        );
      }),
      `Cloning ${template.name} template...`,
    );

    rmSync(resolve(directory, '.git'), { recursive: true });
  }
}
