export class NoConfigurationFileFoundError extends Error {
  constructor() {
    super(
      'No configuration file found. Please create a lithia.config.ts file in the root of your project.',
    );
  }
}
