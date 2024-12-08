export class UndefinedBuilderTypeError extends Error {
  constructor() {
    super(
      'Cannot determine the application builder.  Please provide a valid builder type.',
    );
  }
}
