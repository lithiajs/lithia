import { OperationCancelledError } from '../errors';
import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { checkResourceInstallation } from '../utils';
import { colors } from '@lithiajs/common';
import prompts from 'prompts';

export class AskPackageManagerStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    if (!ctx.get<boolean>('installDeps')) return;

    const [npmInstalled, yarnInstalled] = await Promise.all([
      checkResourceInstallation('npm --version'),
      checkResourceInstallation('yarn --version'),
    ]);

    const answer = await prompts(
      {
        type: 'select',
        name: 'packageManager',
        message: `Which ${colors.lightGreen('package manager')} would you like to use?`,
        choices: [
          {
            title: 'npm',
            value: 'npm',
            disabled: !npmInstalled,
          },
          {
            title: 'yarn',
            value: 'yarn',
            disabled: !yarnInstalled,
          },
        ],
      },
      {
        onCancel: () => {
          throw new OperationCancelledError();
        },
      },
    );

    ctx.set('packageManager', answer.packageManager);
  }
}
