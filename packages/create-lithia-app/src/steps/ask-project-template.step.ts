import { OperationCancelledError } from '../errors';
import { ProjectTemplate } from '../types';
import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { colors } from '@lithiajs/common';
import prompts from 'prompts';

export class AskProjectTemplateStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    const templates = ctx.get<ProjectTemplate[]>('templates');

    const answer = await prompts(
      {
        type: 'select',
        name: 'template',
        message: `Which ${colors.lightGreen('template')} would you like to use?`,
        choices: templates.map((template) => ({
          title: template.name,
          value: template,
          description: template.description,
        })),
      },
      {
        onCancel: () => {
          throw new OperationCancelledError();
        },
      },
    );

    ctx.set('template', answer.template);
  }
}
