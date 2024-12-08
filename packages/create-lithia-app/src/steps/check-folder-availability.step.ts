import { DirectoryAlreadyInUseError } from '../errors';
import { Step } from '../interfaces';
import { StepContext } from '../step-context';
import { existsSync } from 'fs';
import { resolve } from 'path';

export class CheckFolderAvailabilityStep implements Step {
  async execute(ctx: StepContext): Promise<void> {
    const directory = resolve(ctx.get('directory'), ctx.get('projectName'));

    if (existsSync(directory)) {
      throw new DirectoryAlreadyInUseError(directory);
    }
  }
}
