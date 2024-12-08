export function convertObjectToEnvVariables(objectValue: object) {
  const envVariables: Record<string, string> = {};

  function flattenConfig(prefix: string, obj: object) {
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        envVariables[`${prefix}_${key}`.toUpperCase()] = value.join(',');
      } else if (typeof value === 'object') {
        flattenConfig(`${prefix}_${key}`.toUpperCase(), value);
      } else {
        envVariables[`${prefix}_${key}`.toUpperCase()] = value?.toString();
      }
    }
  }

  flattenConfig('LITHIA', objectValue);

  return envVariables;
}
