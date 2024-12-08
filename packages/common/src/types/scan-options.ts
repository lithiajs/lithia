export type ScanOptions = {
  searchFor: RegExp[];
  directory: string;
  recursive?: boolean;
  exclude?: RegExp[];
  ignore?: string[];
  onFile?: (file: string) => void | Promise<void>;
};
