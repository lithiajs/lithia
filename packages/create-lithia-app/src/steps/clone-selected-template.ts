import { spinAndAwait } from '@lithiajs/common';
import { exec } from 'child_process';
import { rmSync } from 'fs';
import { resolve } from 'path';
import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { ProjectTemplate } from '../types';

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
