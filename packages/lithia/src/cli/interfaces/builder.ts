import { CompiledFile } from '../types/compiled-file';

export interface Builder {
  build(files: string[]): CompiledFile[];
}
