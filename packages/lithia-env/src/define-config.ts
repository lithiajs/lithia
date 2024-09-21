import { LithiaConfig } from './types/lithia-config';

export function defineConfig(config: Partial<LithiaConfig>): LithiaConfig {
  return {
    entryFileName: 'app.ts',
    ...config,
  };
}
