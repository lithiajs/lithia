import { relative, resolve } from 'path';
import { DIST_FOLDER, SOURCE_FOLDER } from '../constants';

export function getOutputPath(path: string) {
  return resolve(
    DIST_FOLDER,
    relative(SOURCE_FOLDER, path.replace(/\.([jt])s?$/, '.js')),
  );
}
