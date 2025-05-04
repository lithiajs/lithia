import { loadConfig, watchConfig } from 'c12';
import { klona } from 'klona';
import type { LithiaConfig, LithiaOptions, LoadConfigOptions } from 'lithia/types';
import { DEFAULT_CONFIG } from './defaults';

export async function loadOptions(overrides: LithiaConfig = {}, opts: LoadConfigOptions = {}): Promise<LithiaOptions> {
  overrides = klona(overrides);
  const loaded = await (opts.watch ? watchConfig<LithiaConfig> : loadConfig<LithiaConfig>)({
    name: 'lithia',
    configFile: 'lithia.config',
    cwd: process.cwd(),
    dotenv: true,
    overrides,
    defaults: DEFAULT_CONFIG,
    ...opts.c12,
  });

  const options = klona(loaded.config);
  options._config = overrides;
  options._c12 = loaded;

  return options as LithiaOptions;
}
