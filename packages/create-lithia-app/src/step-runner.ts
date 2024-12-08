import { Step } from './interfaces';
import { StepContext } from './step-context';

export class StepRunner {
  private readonly ctx: StepContext;

  constructor(private readonly steps: Step[]) {
    this.ctx = new StepContext();
  }

  async run() {
    for (const step of this.steps) {
      await step.execute(this.ctx);
    }
  }

  set(key: string, value: unknown) {
    this.ctx.set(key, value);
  }
}
