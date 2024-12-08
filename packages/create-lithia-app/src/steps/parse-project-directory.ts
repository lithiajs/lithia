import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { resolve } from 'path';

export class ParseProjectDirectoryStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    const projectName = ctx.get<string>('projectName');

    if (!projectName.includes('/') && !projectName.includes('\\')) {
      ctx.set('directory', process.cwd());
      return;
    }

    const parts = projectName.split(/[/\\]/);
    const directory = parts.pop();
    const path = parts.join('/');
    ctx.set('directory', resolve(process.cwd(), path));
    ctx.set('projectName', directory);
  }
}
