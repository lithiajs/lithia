import { Builder } from '../interface';

export class TscBuilder implements Builder {
  execute(files: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
