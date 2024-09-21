import { LITHIA_DIST_FOLDER } from '@lithiajs/env';
import path from 'path';

export function outputFilePath(filePath: string) {
  return path.resolve(
    LITHIA_DIST_FOLDER,
    path.relative('src', filePath.replace(/\.([jt])s?$/, '.js')),
  );
}
