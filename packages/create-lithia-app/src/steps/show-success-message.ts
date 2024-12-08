import { relative, resolve } from 'path';

import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { colors } from '@lithiajs/common';

export class ShowSuccessMessageStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    const directory = resolve(ctx.get('directory'), ctx.get('projectName'));
    const relativePath = relative(process.cwd(), directory);
    const messages = [
      '\nHold on, we are almost done!',
      `Your ${colors.lightGreen('Lithia')} app has been successfully created!`,
      'To get started, run the following commands:',
      `├───> ${colors.lightGreen(`cd ${relativePath}`)}`,
      `└───> ${colors.lightGreen('npm run dev')}`,
      `\nFor more information, check out the Lithia documentation: ${colors.lightGreen('https://docs.lithiajs.org')}`,
    ];

    for (const message of messages) {
      console.log(message);
    }
  }
}
