import { LithiaConfig } from './types';

export class LithiaEnvLoader {
  private constructor() {}

  public static load(config: LithiaConfig): void {
    const iterate = (obj: object, path: string[] = []) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object') iterate(value, [...path, key]);
        else
          process.env[`LITHIA_ENV_${[...path, key].join('_').toUpperCase()}`] =
            String(value);
      });
    };

    iterate(config);
  }
}
