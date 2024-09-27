export class RequestStore {
  private readonly memo = new Map<string, unknown>();

  get<T = unknown>(key: string): T | undefined {
    return this.memo.get(key) as T;
  }

  set<T = unknown>(key: string, value: T): void {
    this.memo.set(key, value);
  }

  delete(key: string): void {
    this.memo.delete(key);
  }

  clear(): void {
    this.memo.clear();
  }

  has(key: string): boolean {
    return this.memo.has(key);
  }

  keys(): IterableIterator<string> {
    return this.memo.keys();
  }

  values(): IterableIterator<unknown> {
    return this.memo.values();
  }

  entries(): IterableIterator<[string, unknown]> {
    return this.memo.entries();
  }

  [Symbol.iterator](): IterableIterator<[string, unknown]> {
    return this.memo.entries();
  }
}
