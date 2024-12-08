export interface Builder {
  execute(files: string[]): Promise<void>;
}
