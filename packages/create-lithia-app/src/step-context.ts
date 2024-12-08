export class StepContext {
  storage: Map<string, unknown> = new Map();

  public get<T>(key: string): T {
    return this.storage.get(key) as T;
  }

  public set<T>(key: string, value: T): void {
    this.storage.set(key, value);
  }

  public has(key: string): boolean {
    return this.storage.has(key);
  }

  public delete(key: string): void {
    this.storage.delete(key);
  }

  public clear(): void {
    this.storage.clear();
  }
}
