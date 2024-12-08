import { Dirent } from 'fs';

export type ScanOptions = {
  searchFor: RegExp[];
  directory: string;
  recursive?: boolean;
  exclude?: RegExp[];
  ignore?: string[];
  onFile?: (file: Dirent) => void | Promise<void>;
};
