import { OperationCancelledError } from '../errors';
import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { colors } from '@lithiajs/common';
import prompts from 'prompts';

export class AskInstallDepsStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    const answer = await prompts(
      {
        type: 'confirm',
        name: 'installDeps',
        message: `Do you want to ${colors.lightGreen('install dependencies')}?`,
        initial: true,
      },
      {
        onCancel: () => {
          throw new OperationCancelledError();
        },
      },
    );

    ctx.set('installDeps', answer.installDeps);
  }
}
