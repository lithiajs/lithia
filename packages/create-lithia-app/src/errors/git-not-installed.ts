export class GitNotInstalledError extends Error {
  constructor() {
    super(
      'Git is not installed on your system. Please install it and try again.',
    );
  }
}
