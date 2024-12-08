export class NoConfigurationFileFoundError extends Error {
  constructor() {
    super(
      `No Lithia configuration file found. Please refer to https://docs.lithiajs.org/configuration for more information.`,
    );
  }
}
