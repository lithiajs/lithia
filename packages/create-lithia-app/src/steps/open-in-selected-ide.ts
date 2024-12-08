import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { resolve } from 'path';
import { spawn } from 'child_process';

export class OpenInSelectedIDEStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    const ide = ctx.get<string>('ide');
    const directory = ctx.get<string>('directory');
    const projectName = ctx.get<string>('projectName');
    const projectDirectory = resolve(directory, projectName);

    if (!ide) return;

    spawn(ide, [projectDirectory], {
      detached: true,
      stdio: 'ignore',
    }).unref();
  }
}
