import { OperationCancelledError } from '../errors';
import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { colors } from '@lithiajs/common';
import prompts from 'prompts';

export class AskProjectNameStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    if (ctx.get<string>('projectName')) return;

    const answer = await prompts(
      {
        type: 'text',
        name: 'projectName',
        message: `What is the ${colors.lightGreen('name')} of your project?`,
        initial: ctx.get<string>('defaultProjectName'),
        validate: this.validateProjectName,
        format: (value: string) => value.trim(),
      },
      {
        onCancel: () => {
          throw new OperationCancelledError();
        },
      },
    );

    ctx.set('projectName', answer.projectName);
  }

  private validateProjectName(value: string): string | boolean {
    if (!value) return 'Project name cannot be empty';
    return /^[a-z0-9-]+$/.test(value)
      ? true
      : 'Project name can only contain lowercase letters, numbers, and hyphens';
  }
}
