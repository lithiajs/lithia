export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export type FileInfo = {
  path: string;
  fullPath: string;
};

export type Possible<T> = T | undefined | null;
