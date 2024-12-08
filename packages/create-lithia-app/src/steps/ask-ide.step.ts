import { OperationCancelledError } from '../errors';
import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { checkResourceInstallation } from '../utils';
import { colors } from '@lithiajs/common';
import prompts from 'prompts';

export class AskIDEStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    if (!ctx.get<boolean>('openInIDE')) return;

    const [isVSCodeInstalled, isWebStormInstalled] = await Promise.all([
      checkResourceInstallation('code --version'),
      checkResourceInstallation('webstorm --version'),
    ]);

    const answer = await prompts(
      {
        type: 'select',
        name: 'ide',
        message: `Which ${colors.lightGreen('IDE')} do you want to use?`,
        choices: [
          {
            title: 'Visual Studio Code',
            value: 'code',
            disabled: !isVSCodeInstalled,
          },
          {
            title: 'WebStorm',
            value: 'webstorm',
            disabled: !isWebStormInstalled,
          },
        ],
      },
      {
        onCancel: () => {
          throw new OperationCancelledError();
        },
      },
    );

    ctx.set('ide', answer.ide);
  }
}
