import { StepContext } from '../step-context';

export interface Step {
  execute(ctx: StepContext): Promise<void>;
}
