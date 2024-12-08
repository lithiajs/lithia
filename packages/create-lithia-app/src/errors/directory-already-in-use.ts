export class DirectoryAlreadyInUseError extends Error {
  constructor(directory: string) {
    super(`Directory ${directory} already exists.`);
  }
}
