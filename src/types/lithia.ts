import type { ConsolaInstance } from 'consola';
import type { LithiaHooks } from './hooks';
import type { LithiaOptions } from './options';

export interface Lithia {
  options: LithiaOptions;
  hooks: LithiaHooks;
  logger: ConsolaInstance;
}
