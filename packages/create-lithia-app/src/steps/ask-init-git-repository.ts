import { GitNotInstalledError, OperationCancelledError } from '../errors';

import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { checkResourceInstallation } from '../utils';
import { colors } from '@lithiajs/common';
import prompts from 'prompts';

export class AskInitGitRepositoryStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    const gitInstalled = await checkResourceInstallation('git --version');

    if (!gitInstalled) throw new GitNotInstalledError();

    const answer = await prompts(
      {
        type: 'confirm',
        name: 'initGitRepository',
        message: `Do you want to initialize a ${colors.lightGreen('git repository')}?`,
        initial: true,
      },
      {
        onCancel: () => {
          throw new OperationCancelledError();
        },
      },
    );

    ctx.set('initGitRepository', answer.initGitRepository);
  }
}
