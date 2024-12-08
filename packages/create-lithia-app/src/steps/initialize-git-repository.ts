import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import git from 'simple-git';
import { resolve } from 'path';
import { spinAndAwait } from '../utils';

export class InitializeGitRepositoryStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    const initGitRepository = ctx.get<boolean>('initGitRepository');

    if (!initGitRepository) return;

    const directory = resolve(ctx.get('directory'), ctx.get('projectName'));

    await spinAndAwait(
      new Promise<void>((resolve, reject) => {
        git(directory).init((error) => {
          if (error) reject(error);
          else resolve();
        });
      }),
      'Initializing git repository...',
    );
  }
}
