import { consola } from 'consola';
import { createDebugger, createHooks } from 'hookable';
import type { Lithia, LithiaConfig, LoadConfigOptions } from '../types';
import { loadOptions } from './config';

export async function createLithia(config: LithiaConfig = {}, opts: LoadConfigOptions = {}): Promise<Lithia> {
  const options = await loadOptions(config, opts);

  const lithia: Lithia = {
    options,
    hooks: createHooks(),
    logger: consola.withDefaults({
      tag: 'lithia',
    }),
  };

  if (lithia.options.debug) {
    createDebugger(lithia.hooks, { tag: 'lithia' });
    createDebugger(lithia.options.server.hooks, { tag: 'lithia:server' });
    createDebugger(lithia.options.router.hooks, { tag: 'lithia:router' });
  }

  return lithia;
}
