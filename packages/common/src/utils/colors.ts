export const colors = {
  magenta: (text: string) => `\u001B[35m${text}\u001B[39m`,
  red: (text: string) => `\u001B[31m${text}\u001B[39m`,
  blue: (text: string) => `\u001B[34m${text}\u001B[39m`,
  cyan: (text: string) => `\u001B[36m${text}\u001B[39m`,
  yellow: (text: string) => `\u001B[33m${text}\u001B[39m`,
  lightGreen: (text: string) => `\u001B[92m${text}\u001B[39m`,
};
