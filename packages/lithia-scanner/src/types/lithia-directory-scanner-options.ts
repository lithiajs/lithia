export type LithiaDirectoryScannerOptions = {
  scanDir: string;
  searchFor: RegExp[];
  ignore?: RegExp[];
  onlyScanRootDir?: boolean;
  onFile(filePath: string): Promise<void>;
};
