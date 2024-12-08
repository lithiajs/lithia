import { OperationCancelledError } from '../errors';
import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { colors } from '@lithiajs/common';
import prompts from 'prompts';

export class AskOpenInIDEStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    const answer = await prompts(
      {
        type: 'confirm',
        name: 'openInIDE',
        message: `Do you want to ${colors.lightGreen('open')} the project in your IDE?`,
        initial: true,
      },
      {
        onCancel: () => {
          throw new OperationCancelledError();
        },
      },
    );

    ctx.set('openInIDE', answer.openInIDE);
  }
}
