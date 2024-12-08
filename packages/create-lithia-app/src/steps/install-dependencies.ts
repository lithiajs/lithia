import { spinAndAwait } from '@lithiajs/common';
import { spawn } from 'child_process';
import { resolve } from 'path';
import { Step } from '../interfaces';
import { StepContext } from '../step-context';

export class InstallDependenciesStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    if (!ctx.get<boolean>('installDeps')) return;

    const packageManager = ctx.get<string>('packageManager');
    const directory = resolve(
      ctx.get<string>('directory'),
      ctx.get<string>('projectName'),
    );

    await spinAndAwait(
      new Promise<void>((resolve, reject) => {
        spawn(packageManager, ['install'], {
          cwd: directory,
          stdio: 'inherit',
        }).on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error('Failed to install dependencies'));
        });
      }),
      'Installing dependencies...',
    );
  }
}
