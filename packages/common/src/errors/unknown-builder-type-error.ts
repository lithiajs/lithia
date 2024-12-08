export class UnknownBuilderTypeError extends Error {
  constructor(builderType: string) {
    super(
      `The provided builder (${builderType}) is not supported. Please provide a valid builder type.`,
    );
  }
}
